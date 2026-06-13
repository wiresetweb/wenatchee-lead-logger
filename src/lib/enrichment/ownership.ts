/**
 * Ownership signals (docs/LEAD_ENRICHMENT.md). Derives the most buyer-valuable facts
 * about who owns the property and for how long:
 *
 *  - owner-occupied vs absentee: prefer comparing the assessor's tax-MAILING address to
 *    the PROPERTY address (a landlord's mail goes elsewhere) — far more reliable than a
 *    name match. Falls back to the submitted-name match when no mailing address exists.
 *  - new homeowner: bought within the last 12 months — the single strongest renovation/
 *    home-services intent signal.
 *  - tenure: years owned, for context.
 */

import type { OwnerMatch } from "./names";

export interface OwnershipSignals {
  ownerOccupied: boolean | null;
  absenteeOwner: boolean | null;
  basis: "mailing_match" | "mailing_mismatch" | "name_match" | "name_mismatch" | "unknown";
  newHomeowner: boolean | null;
  tenureYears: number | null;
  saleDate: string | null;
  salePrice: number | null;
}

/** Normalize a US address to { number, tokens } for loose comparison. */
function normalizeAddr(addr: string): { num: string | null; tokens: Set<string> } {
  const cleaned = addr
    .toLowerCase()
    .replace(/[.,#]/g, " ")
    .replace(/\b(street|st|avenue|ave|road|rd|drive|dr|lane|ln|court|ct|place|pl|boulevard|blvd|way|circle|cir|terrace|ter|highway|hwy|apt|unit|ste|suite|n|s|e|w|ne|nw|se|sw)\b/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  const numMatch = cleaned.match(/^\d+/);
  const tokens = new Set(cleaned.split(" ").filter((t) => t.length > 1 && !/^\d+$/.test(t)));
  return { num: numMatch ? numMatch[0] : null, tokens };
}

/** Do two addresses plausibly refer to the same place? */
function addressesMatch(a: string, b: string): boolean {
  const x = normalizeAddr(a);
  const y = normalizeAddr(b);
  if (x.num && y.num && x.num !== y.num) return false;
  // Share at least one street-name token.
  for (const t of x.tokens) if (y.tokens.has(t)) return true;
  // Same house number and no usable tokens on either side → treat as match.
  return Boolean(x.num && x.num === y.num && (x.tokens.size === 0 || y.tokens.size === 0));
}

function parseSale(saleDate: string | null): { newHomeowner: boolean | null; tenureYears: number | null } {
  if (!saleDate) return { newHomeowner: null, tenureYears: null };
  let ms = Date.parse(saleDate);
  // ArcGIS often returns epoch milliseconds as a numeric string.
  if (Number.isNaN(ms) && /^\d{10,13}$/.test(saleDate.trim())) {
    const n = Number(saleDate.trim());
    ms = saleDate.trim().length <= 10 ? n * 1000 : n;
  }
  if (Number.isNaN(ms)) return { newHomeowner: null, tenureYears: null };
  const years = (Date.now() - ms) / (365.25 * 24 * 3600 * 1000);
  if (years < 0 || years > 200) return { newHomeowner: null, tenureYears: null };
  return { newHomeowner: years <= 1, tenureYears: Math.round(years * 10) / 10 };
}

export function computeOwnership(args: {
  situsAddress: string | null;
  mailingAddress: string | null;
  saleDate: string | null;
  salePrice: number | null;
  nameMatch: OwnerMatch;
}): OwnershipSignals {
  const { situsAddress, mailingAddress, saleDate, salePrice, nameMatch } = args;
  const sale = parseSale(saleDate);

  // Strongest signal: tax-mailing address vs property address.
  if (situsAddress && mailingAddress) {
    const occupied = addressesMatch(situsAddress, mailingAddress);
    return {
      ownerOccupied: occupied,
      absenteeOwner: !occupied,
      basis: occupied ? "mailing_match" : "mailing_mismatch",
      saleDate,
      salePrice,
      ...sale,
    };
  }

  // Fallback: submitted-name vs owner-of-record match.
  const ownerOccupied = nameMatch === "matched" ? true : nameMatch === "no_match" ? false : null;
  return {
    ownerOccupied,
    absenteeOwner: ownerOccupied == null ? null : !ownerOccupied,
    basis: nameMatch === "matched" ? "name_match" : nameMatch === "no_match" ? "name_mismatch" : "unknown",
    saleDate,
    salePrice,
    ...sale,
  };
}
