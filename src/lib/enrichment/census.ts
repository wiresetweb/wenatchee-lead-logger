/**
 * Free Census appends (docs/LEAD_ENRICHMENT.md §3):
 *  1. Census Geocoder — address → lat/lng, county, census tract (no key required)
 *  2. ACS 5-year — tract-level median household income + median home value
 *
 * These are AREA-LEVEL estimates, never individual income — always presented as
 * "estimated" (FCRA boundary, docs/COMPLIANCE.md §4). An optional CENSUS_API_KEY
 * raises rate limits; not required at our volume.
 */

const ACS_YEAR = "2023";

export interface GeocodeResult {
  lat: number;
  lng: number;
  stateFips: string;
  countyFips: string;
  countyName: string;
  tract: string;
}

export async function geocodeAddress(
  addressLine1: string,
  city: string,
  state: string,
  postalCode?: string,
): Promise<GeocodeResult | null> {
  const oneLine = [addressLine1, city, state, postalCode].filter(Boolean).join(", ");
  const url =
    "https://geocoding.geo.census.gov/geocoder/geographies/onelineaddress?" +
    new URLSearchParams({
      address: oneLine,
      benchmark: "Public_AR_Current",
      vintage: "Current_Current",
      format: "json",
    });

  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      result?: {
        addressMatches?: Array<{
          coordinates: { x: number; y: number };
          geographies?: Record<string, Array<Record<string, string>>>;
        }>;
      };
    };
    const match = data.result?.addressMatches?.[0];
    if (!match) return null;
    const tractInfo = match.geographies?.["Census Tracts"]?.[0];
    const countyInfo = match.geographies?.["Counties"]?.[0];
    if (!tractInfo) return null;
    return {
      lat: match.coordinates.y,
      lng: match.coordinates.x,
      stateFips: tractInfo.STATE,
      countyFips: tractInfo.COUNTY,
      countyName: countyInfo?.NAME ?? "",
      tract: tractInfo.TRACT,
    };
  } catch {
    return null;
  }
}

export interface AcsTractData {
  medianHouseholdIncome: number | null;
  medianHomeValue: number | null;
}

export interface AcsAttempt {
  url: string;
  status?: number;
  error?: string;
  values?: unknown;
}

/** ACS uses large negative sentinels for suppressed/unavailable values. */
function acsNumber(v: string | null | undefined): number | null {
  if (v == null) return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export async function fetchAcsTractData(
  stateFips: string,
  countyFips: string,
  tract: string,
  diag?: AcsAttempt[],
): Promise<AcsTractData | null> {
  const key = process.env.CENSUS_API_KEY;
  const vars = "B19013_001E,B25077_001E"; // median household income, median home value

  // Build the URL manually: URLSearchParams encodes spaces as "+", but the Census API
  // expects the `in=` clause to use "%20" between the state and county selectors.
  const keyParam = key ? `&key=${encodeURIComponent(key)}` : "";
  const tractUrl =
    `https://api.census.gov/data/${ACS_YEAR}/acs/acs5?get=${vars}` +
    `&for=tract:${tract}&in=${encodeURIComponent(`state:${stateFips} county:${countyFips}`)}` +
    keyParam;
  // County-level fallback — more likely to resolve, still a useful area estimate.
  const countyUrl =
    `https://api.census.gov/data/${ACS_YEAR}/acs/acs5?get=${vars}` +
    `&for=county:${countyFips}&in=state:${stateFips}` +
    keyParam;

  for (const url of [tractUrl, countyUrl]) {
    const attempt: AcsAttempt = { url: url.replace(/&key=[^&]*/, key ? "&key=***" : "") };
    if (diag) diag.push(attempt);
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
      attempt.status = res.status;
      if (!res.ok) {
        attempt.error = await res.text().catch(() => "").then((t) => t.slice(0, 120));
        continue;
      }
      const rows = (await res.json()) as string[][];
      const values = rows?.[1]; // rows[0] = headers, rows[1] = values
      attempt.values = values ?? rows;
      if (!values) continue;
      const income = acsNumber(values[0]);
      const homeValue = acsNumber(values[1]);
      if (income != null || homeValue != null) {
        return { medianHouseholdIncome: income, medianHomeValue: homeValue };
      }
    } catch (e) {
      attempt.error = e instanceof Error ? e.message : String(e);
    }
  }
  return null;
}
