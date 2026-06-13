import "server-only";

/**
 * Enrichment orchestrator (docs/LEAD_ENRICHMENT.md §2). Runs asynchronously after a
 * lead is captured — a failure here never blocks or loses the lead. Free-stack v1:
 *
 *   1. dedupe check (same phone/email in the last 30 days)
 *   2. email quality (disposable list + MX via DoH)
 *   3. Census geocode (tract/county/lat-lng) when a street address was given
 *   4. ACS tract append (median household income, median home value — AREA estimates)
 *   5. score + grade, persist to lead_enrichment, advance leads.status
 *
 * Property/ownership (county assessor) is Phase 2b — columns exist, source pending.
 */

import { getServiceClient } from "../supabase/server";
import { deliverLead } from "../delivery";
import { geocodeAddress, fetchAcsTractData } from "./census";
import { hasMxRecords, isDisposableEmail } from "./email";
import { scoreLead } from "./score";

interface LeadRow {
  id: string;
  trade: string;
  service_type: string;
  timeline: string | null;
  full_name: string;
  phone: string;
  email: string;
  project_details: string | null;
  address_line1: string | null;
  city: string;
  state: string;
  postal_code: string | null;
}

export async function enrichLead(leadId: string): Promise<void> {
  const supabase = getServiceClient();
  if (!supabase) return;

  const { data: lead, error } = await supabase
    .from("leads")
    .select(
      "id, trade, service_type, timeline, full_name, phone, email, project_details, address_line1, city, state, postal_code",
    )
    .eq("id", leadId)
    .single<LeadRow>();
  if (error || !lead) {
    console.error("[enrich] lead fetch failed:", error?.message);
    return;
  }

  // 1. Dedupe: same phone or email in the last 30 days (excluding this lead).
  const since = new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString();
  const { count: dupCount } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .neq("id", lead.id)
    .gte("created_at", since)
    .or(`phone.eq.${lead.phone},email.eq.${lead.email}`);
  const isDuplicate = (dupCount ?? 0) > 0;

  // 2 + 3 in parallel: email quality and geocoding.
  const [emailMx, geo] = await Promise.all([
    hasMxRecords(lead.email),
    lead.address_line1
      ? geocodeAddress(lead.address_line1, lead.city, lead.state, lead.postal_code ?? undefined)
      : Promise.resolve(null),
  ]);
  const emailDisposable = isDisposableEmail(lead.email);

  // 4. ACS tract data when we resolved a tract.
  const acs = geo ? await fetchAcsTractData(geo.stateFips, geo.countyFips, geo.tract) : null;

  // 5. Score.
  const { score, grade, needFlags, fraudFlags } = scoreLead({
    timeline: lead.timeline,
    serviceType: lead.service_type,
    hasAddress: Boolean(lead.address_line1),
    phoneE164: /^\+1\d{10}$/.test(lead.phone),
    emailMx,
    emailDisposable,
    isDuplicate,
    areaMedianIncome: acs?.medianHouseholdIncome ?? null,
  });

  const { error: upsertError } = await supabase.from("lead_enrichment").upsert({
    lead_id: lead.id,
    enriched_at: new Date().toISOString(),
    area_median_income: acs?.medianHouseholdIncome ?? null,
    area_median_home_value: acs?.medianHomeValue ?? null,
    census_tract: geo ? `${geo.stateFips}${geo.countyFips}${geo.tract}` : null,
    email_valid: emailMx,
    email_disposable: emailDisposable,
    phone_valid: /^\+1\d{10}$/.test(lead.phone),
    need_flags: needFlags,
    fraud_flags: fraudFlags,
    lead_score: score,
    lead_grade: grade,
    raw: { geo, acs, sources: ["census_geocoder", "acs5", "dns_mx"] },
    provider_costs: { total_usd: 0 }, // free stack
  });
  if (upsertError) {
    console.error("[enrich] enrichment upsert failed:", upsertError.message);
    return;
  }

  // Advance lifecycle + backfill geo columns on the lead.
  const { error: updateError } = await supabase
    .from("leads")
    .update({
      status: grade === "reject" ? "rejected" : "scored",
      ...(geo
        ? { lat: geo.lat, lng: geo.lng, county: geo.countyName.replace(/ County$/, "") }
        : {}),
    })
    .eq("id", lead.id);
  if (updateError) {
    console.error("[enrich] lead status update failed:", updateError.message);
  }

  // Route + deliver to eligible buyers (advances status to 'delivered'; no-op if
  // no buyers match or the lead was rejected).
  await deliverLead(
    supabase,
    {
      id: lead.id,
      trade: lead.trade,
      city: lead.city,
      service_type: lead.service_type,
      full_name: lead.full_name,
      phone: lead.phone,
      email: lead.email,
      timeline: lead.timeline,
      project_details: lead.project_details ?? null,
      address_line1: lead.address_line1,
    },
    {
      lead_grade: grade,
      lead_score: score,
      owner_occupied: null,
      area_median_income: acs?.medianHouseholdIncome ?? null,
      need_flags: needFlags,
    },
  );
}
