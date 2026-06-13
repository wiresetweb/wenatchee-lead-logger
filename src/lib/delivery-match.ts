/**
 * Pure buyer-matching logic (no server-only deps, so it's unit-testable).
 * Used by src/lib/delivery.ts to decide which buyers are eligible for a lead.
 */

export const GRADE_RANK: Record<string, number> = { A: 3, B: 2, C: 1, reject: 0 };

export interface MatchBuyer {
  trade: string;
  active: boolean;
  min_grade: string;
  service_areas: string[];
  service_types: string[];
}

export interface MatchLead {
  trade: string;
  city: string;
  service_type: string;
}

/** True if `buyer` should receive `lead` at the given grade. */
export function buyerMatches(buyer: MatchBuyer, lead: MatchLead, grade: string): boolean {
  if (!buyer.active) return false;
  if (buyer.trade !== lead.trade) return false;
  if ((GRADE_RANK[grade] ?? 0) < (GRADE_RANK[buyer.min_grade] ?? 1)) return false;
  if (
    buyer.service_areas.length > 0 &&
    !buyer.service_areas.some((a) => a.toLowerCase() === lead.city.toLowerCase())
  ) {
    return false;
  }
  if (buyer.service_types.length > 0 && !buyer.service_types.includes(lead.service_type)) {
    return false;
  }
  return true;
}
