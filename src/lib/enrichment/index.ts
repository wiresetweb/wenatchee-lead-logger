import "server-only";

/**
 * Enrichment orchestrator (docs/LEAD_ENRICHMENT.md §2). Runs asynchronously after a
 * lead is captured — a failure here never blocks or loses the lead. Free stack + an
 * optional paid phone lookup:
 *
 *   1. dedupe check (same phone/email in the last 30 days)
 *   2. email quality (disposable list + MX via DoH)
 *   3. Census geocode (tract/county/lat-lng) when a street address was given
 *   4. in parallel: ACS area append, county parcel lookup (owner + property), phone intel
 *   5. owner-name match → owner-occupancy; property age → need flags
 *   6. score + grade, persist to lead_enrichment, advance status, route to buyers
 */

import { getServiceClient } from "../supabase/server";
import { deliverLead } from "../delivery";
import { geocodeAddress, fetchAcsTractData } from "./census";
import { hasMxRecords, isDisposableEmail } from "./email";
import { lookupParcel, propertyNeedFlags } from "./property";
import { lookupPhone } from "./phone";
import { matchOwnerName, ownerOccupiedFromMatch } from "./names";
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

  // 4. In parallel: ACS area data, county parcel lookup (owner + property), phone intel.
  const county = geo?.countyName.replace(/ County$/, "") ?? null;
  const [acs, parcel, phone] = await Promise.all([
    geo ? fetchAcsTractData(geo.stateFips, geo.countyFips, geo.tract) : Promise.resolve(null),
    geo ? lookupParcel(geo.lat, geo.lng, county) : Promise.resolve(null),
    lookupPhone(lead.phone),
  ]);

  // 5. Owner-name match → owner-occupancy (neutral); property age → need flags.
  const ownerMatch = matchOwnerName(lead.full_name, parcel?.ownerName);
  const ownerOccupied = ownerOccupiedFromMatch(ownerMatch);
  const needFlagsBase = propertyNeedFlags(parcel?.yearBuilt ?? null);

  // 6. Score.
  const phoneE164 = /^\+1\d{10}$/.test(lead.phone);
  const { score, grade, needFlags, fraudFlags } = scoreLead({
    timeline: lead.timeline,
    serviceType: lead.service_type,
    hasAddress: Boolean(lead.address_line1),
    phoneE164,
    emailMx,
    emailDisposable,
    isDuplicate,
    areaMedianIncome: acs?.medianHouseholdIncome ?? null,
    ownerOccupied,
    phoneLineType: phone?.lineType ?? null,
  });
  const allNeedFlags = [...new Set([...needFlagsBase, ...needFlags])];

  const sources = ["census_geocoder", "acs5", "dns_mx"];
  if (parcel) sources.push(`parcel:${county}`);
  if (phone) sources.push("twilio_lookup");

  const { error: upsertError } = await supabase.from("lead_enrichment").upsert({
    lead_id: lead.id,
    enriched_at: new Date().toISOString(),
    owner_occupied: ownerOccupied,
    property_value: parcel?.assessedValue ?? null,
    year_built: parcel?.yearBuilt ?? null,
    area_median_income: acs?.medianHouseholdIncome ?? null,
    area_median_home_value: acs?.medianHomeValue ?? null,
    census_tract: geo ? `${geo.stateFips}${geo.countyFips}${geo.tract}` : null,
    phone_line_type: phone?.lineType ?? null,
    phone_carrier: phone?.carrier ?? null,
    email_valid: emailMx,
    email_disposable: emailDisposable,
    phone_valid: phoneE164,
    need_flags: allNeedFlags,
    fraud_flags: fraudFlags,
    lead_score: score,
    lead_grade: grade,
    raw: {
      geo,
      acs,
      parcel: parcel ? { ...parcel, ownerMatch } : null,
      phone,
      sources,
    },
    provider_costs: { total_usd: phone ? 0.008 : 0 },
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
      owner_occupied: ownerOccupied,
      area_median_income: acs?.medianHouseholdIncome ?? null,
      need_flags: allNeedFlags,
    },
  );
}
