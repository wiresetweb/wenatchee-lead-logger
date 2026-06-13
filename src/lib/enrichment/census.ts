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
): Promise<AcsTractData | null> {
  const params = new URLSearchParams({
    get: "B19013_001E,B25077_001E", // median household income, median home value
    for: `tract:${tract}`,
    in: `state:${stateFips} county:${countyFips}`,
  });
  const key = process.env.CENSUS_API_KEY;
  if (key) params.set("key", key);

  try {
    const res = await fetch(`https://api.census.gov/data/${ACS_YEAR}/acs/acs5?${params}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const rows = (await res.json()) as string[][];
    // rows[0] = headers, rows[1] = values
    const values = rows[1];
    if (!values) return null;
    return {
      medianHouseholdIncome: acsNumber(values[0]),
      medianHomeValue: acsNumber(values[1]),
    };
  } catch {
    return null;
  }
}
