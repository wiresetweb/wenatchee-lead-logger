/**
 * Lead scoring v1 — transparent rule-based model (docs/LEAD_ENRICHMENT.md §4).
 * Owner-occupancy (from county parcel data) is the strongest signal; phone line-type
 * applies when the paid Twilio lookup is enabled. Recalibrate against buyer outcomes.
 */

export interface ScoreInput {
  timeline: string | null;
  serviceType: string;
  hasAddress: boolean;
  phoneE164: boolean;
  emailMx: boolean | null;
  emailDisposable: boolean;
  isDuplicate: boolean;
  areaMedianIncome: number | null;
  /** From owner-name match: true = owner, false = likely renter, null = unknown. */
  ownerOccupied: boolean | null;
  /** mobile | landline | voip | null (paid lookup disabled). */
  phoneLineType: string | null;
  /** Bought within the last 12 months — strong renovation intent. */
  newHomeowner?: boolean | null;
}

export interface ScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "reject";
  needFlags: string[];
  fraudFlags: string[];
}

const HIGH_TICKET = /panel|rewir|generator/i;
const MID_TICKET = /ev charger/i;

export function scoreLead(input: ScoreInput): ScoreResult {
  const fraudFlags: string[] = [];
  const needFlags: string[] = [];
  let score = 10; // base

  // Urgency
  if (input.timeline === "asap") score += 18;
  else if (input.timeline === "this_month") score += 11;
  else if (input.timeline === "researching") score += 2;

  // Service value
  if (HIGH_TICKET.test(input.serviceType)) {
    score += 18;
    needFlags.push("high_ticket_service");
  } else if (MID_TICKET.test(input.serviceType)) {
    score += 14;
  } else {
    score += 7;
  }

  // Owner-occupancy — the single most predictive field for home-services close rate.
  if (input.ownerOccupied === true) score += 22;
  else if (input.ownerOccupied === false) score -= 15; // likely renter

  // New homeowner (bought < 12 mo) — high renovation/home-services intent.
  if (input.newHomeowner === true) {
    score += 12;
    needFlags.push("new_homeowner");
  }

  // Contact quality
  if (input.phoneE164) score += 8;
  if (input.emailMx === true) score += 8;
  if (input.emailDisposable) {
    score -= 25;
    fraudFlags.push("disposable_email");
  }
  // Phone line-type (only when the paid lookup ran)
  if (input.phoneLineType === "mobile") score += 8;
  else if (input.phoneLineType === "voip") {
    score -= 8;
    fraudFlags.push("voip_number");
  }

  // Seriousness: gave a full street address
  if (input.hasAddress) score += 8;

  // Area affluence (estimate — area-level, never individual)
  if (input.areaMedianIncome != null) {
    if (input.areaMedianIncome >= 80_000) score += 8;
    else if (input.areaMedianIncome >= 60_000) score += 4;
  }

  // Duplicate suppression
  if (input.isDuplicate) {
    score -= 30;
    fraudFlags.push("duplicate_recent");
  }

  score = Math.max(0, Math.min(100, score));

  let grade: ScoreResult["grade"];
  if (fraudFlags.length > 0 && score < 25) grade = "reject";
  else if (score >= 75) grade = "A";
  else if (score >= 50) grade = "B";
  else if (score >= 25) grade = "C";
  else grade = "reject";

  return { score, grade, needFlags, fraudFlags };
}
