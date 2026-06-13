import "server-only";

/**
 * Lead routing + delivery (docs/DATA_MODEL.md §3, PROJECT_PLAN §10 Phase 3).
 * Runs after a lead is scored. Matches the lead to eligible active buyers, records
 * a lead_deliveries row (idempotent), emails each buyer in real time, and advances
 * the lead to 'delivered'.
 *
 * v1 economics: a buyer's first INTRO_FREE_COUNT leads are free (price 0) to prove
 * value before they pay (docs/LEAD_ENRICHMENT.md §3).
 */

import type { SupabaseClient } from "@supabase/supabase-js";
import { SITE } from "./site";
import { sendBuyerLeadEmail, type LeadEmailData } from "./email";
import { buyerMatches } from "./delivery-match";

const INTRO_FREE_COUNT = 5;

interface BuyerRow {
  id: string;
  name: string;
  trade: string;
  contact_email: string | null;
  delivery_target: string | null;
  service_areas: string[];
  service_types: string[];
  min_grade: string;
  price_per_lead: number;
  active: boolean;
}

interface LeadForDelivery {
  id: string;
  trade: string;
  city: string;
  service_type: string;
  full_name: string;
  phone: string;
  email: string;
  timeline: string | null;
  project_details: string | null;
  address_line1: string | null;
}

interface EnrichmentForDelivery {
  lead_grade: string | null;
  lead_score: number | null;
  owner_occupied: boolean | null;
  area_median_income: number | null;
  need_flags: string[] | null;
  absentee_owner?: boolean | null;
  new_homeowner?: boolean | null;
  tenure_years?: number | null;
  job_tags?: string[] | null;
  job_value_band?: string | null;
  urgent_safety?: boolean | null;
  property?: {
    sqft: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    stories: number | null;
    heating: string | null;
    cooling: string | null;
  } | null;
}

export async function deliverLead(
  supabase: SupabaseClient,
  lead: LeadForDelivery,
  enrichment: EnrichmentForDelivery,
): Promise<void> {
  const grade = enrichment.lead_grade;
  if (!grade || grade === "reject") return; // never deliver rejects

  const { data: buyers, error } = await supabase
    .from("buyers")
    .select(
      "id, name, trade, contact_email, delivery_target, service_areas, service_types, min_grade, price_per_lead, active",
    )
    .eq("active", true)
    .eq("trade", lead.trade)
    .returns<BuyerRow[]>();
  if (error) {
    console.error("[delivery] buyer fetch failed:", error.message);
    return;
  }

  const eligible = (buyers ?? []).filter((b) => buyerMatches(b, lead, grade));
  if (eligible.length === 0) return;

  const emailData: LeadEmailData = {
    fullName: lead.full_name,
    phone: lead.phone,
    email: lead.email,
    city: lead.city,
    serviceType: lead.service_type,
    timeline: lead.timeline,
    projectDetails: lead.project_details,
    addressLine1: lead.address_line1,
    grade,
    score: enrichment.lead_score,
    ownerStatus:
      enrichment.owner_occupied == null
        ? "Unverified"
        : enrichment.owner_occupied
          ? "Owner-occupied"
          : "Likely renter (absentee owner)",
    areaIncome: enrichment.area_median_income,
    needFlags: enrichment.need_flags ?? [],
    newHomeowner: enrichment.new_homeowner ?? null,
    tenureYears: enrichment.tenure_years ?? null,
    jobTags: enrichment.job_tags ?? [],
    jobValueBand: enrichment.job_value_band ?? null,
    urgentSafety: enrichment.urgent_safety ?? false,
    property: enrichment.property ?? null,
  };
  const portalUrl = `${SITE.url.replace(/\/$/, "")}/portal`;

  let deliveredAny = false;
  for (const buyer of eligible) {
    // Intro-free pricing: first N leads to this buyer are free.
    const { count: priorCount } = await supabase
      .from("lead_deliveries")
      .select("id", { count: "exact", head: true })
      .eq("buyer_id", buyer.id);
    const isIntroFree = (priorCount ?? 0) < INTRO_FREE_COUNT;

    const { data: delivery, error: insErr } = await supabase
      .from("lead_deliveries")
      .upsert(
        {
          lead_id: lead.id,
          buyer_id: buyer.id,
          price: isIntroFree ? 0 : buyer.price_per_lead,
          is_intro_free: isIntroFree,
          method: "email",
          status: "sent",
        },
        { onConflict: "lead_id,buyer_id", ignoreDuplicates: true },
      )
      .select("id")
      .maybeSingle();
    if (insErr) {
      console.error("[delivery] insert failed:", insErr.message);
      continue;
    }
    if (!delivery) continue; // already delivered to this buyer (idempotent)
    deliveredAny = true;

    const to = buyer.delivery_target || buyer.contact_email;
    if (to) {
      const sent = await sendBuyerLeadEmail(to, buyer.name, emailData, portalUrl);
      if (!sent) {
        await supabase
          .from("lead_deliveries")
          .update({ status: "sent", response: { email: "not_sent" } })
          .eq("id", delivery.id);
      }
    }
  }

  if (deliveredAny) {
    await supabase.from("leads").update({ status: "delivered" }).eq("id", lead.id);
  }
}
