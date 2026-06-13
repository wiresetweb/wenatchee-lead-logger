/**
 * Owner-name matching for owner-occupancy inference (docs/LEAD_ENRICHMENT.md).
 *
 * Compares the name a homeowner submitted against the owner of record from county
 * parcel data. This is a NEUTRAL occupancy signal — a mismatch is most likely a renter
 * or a different household member, NOT fraud. Entity owners (LLC/trust) are "unknown"
 * because the submitter could well be the principal.
 */

export type OwnerMatch = "matched" | "no_match" | "unknown";

const SUFFIXES = new Set(["jr", "sr", "ii", "iii", "iv", "v"]);
const TITLES = new Set(["mr", "mrs", "ms", "dr", "miss"]);
const ENTITY_HINTS = /\b(llc|l\.l\.c|inc|incorporated|corp|company|co|trust|trustee|estate|lp|llp|ltd|properties|holdings|rentals|investments|partners|hoa|association)\b/i;

/** Lowercase, strip punctuation, drop titles/suffixes → set of name tokens. */
export function nameTokens(raw: string): string[] {
  return raw
    .toLowerCase()
    .replace(/[.,&/]/g, " ")
    .replace(/[^a-z\s'-]/g, " ")
    .split(/\s+/)
    .map((t) => t.replace(/^['-]+|['-]+$/g, ""))
    .filter((t) => t.length > 1 && !SUFFIXES.has(t) && !TITLES.has(t));
}

export function isEntityOwner(ownerRecord: string): boolean {
  return ENTITY_HINTS.test(ownerRecord);
}

/**
 * Match a submitted full name against an owner-of-record string. County records are
 * often "LAST FIRST [MIDDLE]" or "LAST, FIRST" and may list multiple owners
 * ("SMITH JOHN & JANE"). We match if the submitter's first and last names both appear
 * among the owner tokens.
 */
export function matchOwnerName(submittedName: string, ownerRecord: string | null | undefined): OwnerMatch {
  if (!ownerRecord || !ownerRecord.trim()) return "unknown";
  if (isEntityOwner(ownerRecord)) return "unknown";

  const submitted = nameTokens(submittedName);
  const owner = new Set(nameTokens(ownerRecord));
  if (submitted.length < 2 || owner.size === 0) return "unknown";

  const first = submitted[0];
  const last = submitted[submitted.length - 1];

  const firstHit = owner.has(first);
  const lastHit = owner.has(last);

  // Last name is the strongest signal; require it plus either the first name or a
  // shared additional token to call it a match.
  if (lastHit && firstHit) return "matched";
  if (lastHit && submitted.some((t, i) => i > 0 && i < submitted.length - 1 && owner.has(t)))
    return "matched";
  // Only the last name matches (common with married couples listed by one spouse):
  if (lastHit && owner.size <= 4) return "matched";

  return "no_match";
}

/** owner_occupied boolean from the match result (null = unknown). */
export function ownerOccupiedFromMatch(match: OwnerMatch): boolean | null {
  if (match === "matched") return true;
  if (match === "no_match") return false;
  return null;
}
