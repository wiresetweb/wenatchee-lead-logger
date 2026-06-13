/**
 * Lead scoring v1 — transparent rule-based model (docs/LEAD_ENRICHMENT.md §4).
 * Free-stack signals only; property/ownership signals join in Phase 2b when the
 * county-assessor source lands. Recalibrate against buyer outcomes once we have them.
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
}

export interface ScoreResult {
  score: number;
  grade: "A" | "B" | "C" | "reject";
  needFlags: string[];
  fraudFlags: string[];
}

/** High-ticket electrical work scores higher (more valuable to the buyer). */
const HIGH_TICKET = /panel|rewir|generator/i;
const MID_TICKET = /ev charger/i;

export function scoreLead(input: ScoreInput): ScoreResult {
  const fraudFlags: string[] = [];
  const needFlags: string[] = [];
  let score = 10; // base

  // Urgency
  if (input.timeline === "asap") score += 20;
  else if (input.timeline === "this_month") score += 12;
  else if (input.timeline === "researching") score += 2;

  // Service value
  if (HIGH_TICKET.test(input.serviceType)) {
    score += 20;
    needFlags.push("high_ticket_service");
  } else if (MID_TICKET.test(input.serviceType)) {
    score += 16;
  } else {
    score += 8;
  }

  // Contact quality
  if (input.phoneE164) score += 10;
  if (input.emailMx === true) score += 10;
  if (input.emailDisposable) {
    score -= 25;
    fraudFlags.push("disposable_email");
  }

  // Seriousness: gave a full street address
  if (input.hasAddress) score += 10;

  // Area affluence (estimate — area-level, never individual)
  if (input.areaMedianIncome != null) {
    if (input.areaMedianIncome >= 80_000) score += 10;
    else if (input.areaMedianIncome >= 60_000) score += 6;
    else score += 2;
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
