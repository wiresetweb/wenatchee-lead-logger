/**
 * County parcel lookup via public ArcGIS REST services (free). Given the lead's
 * geocoded coordinates, we do a point-in-polygon query against the county's parcel
 * layer and pull the owner of record + property attributes.
 *
 * Field names vary by county, so we DON'T hardcode them — we request all fields and
 * detect the owner / year-built / value / land-use fields by matching attribute keys.
 * Every failure degrades gracefully to null, and the raw attributes are returned so we
 * can verify and tune field detection against real leads.
 *
 * Sources: Chelan County Assessor parcels (maps.wenatcheewa.gov), Douglas County GIS
 * (gis.douglascountywa.net). Owner names are public records for taxation.
 */

export interface ParcelData {
  ownerName: string | null;
  yearBuilt: number | null;
  assessedValue: number | null;
  situsAddress: string | null;
  landUse: string | null;
  /** Which endpoint answered + the raw attributes, for tuning. */
  source: string | null;
  raw: Record<string, unknown> | null;
}

/** Candidate parcel layer URLs per county, tried in order until one returns a feature. */
const COUNTY_LAYERS: Record<string, string[]> = {
  Chelan: [
    "https://maps.wenatcheewa.gov/server/rest/services/Parcels/FeatureServer/0",
  ],
  Douglas: [
    "https://gis.douglascountywa.net/server/rest/services/Parcels/MapServer/0",
    "https://gis.douglascountywa.net/server/rest/services/Parcels/FeatureServer/0",
    "https://gis.douglascountywa.net/server/rest/services/Tax_Parcels/MapServer/0",
  ],
};

/** Detect a field value from an attributes object by matching the key name. */
function pick(
  attrs: Record<string, unknown>,
  include: RegExp,
  exclude?: RegExp,
): unknown {
  for (const [key, val] of Object.entries(attrs)) {
    if (val == null || val === "") continue;
    if (include.test(key) && (!exclude || !exclude.test(key))) return val;
  }
  return null;
}

function toNumber(v: unknown): number | null {
  if (v == null) return null;
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n : null;
}

function toStr(v: unknown): string | null {
  if (v == null) return null;
  const s = String(v).trim();
  return s.length ? s : null;
}

async function queryLayer(url: string, lat: number, lng: number): Promise<Record<string, unknown> | null> {
  const q =
    `${url}/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326` +
    `&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
  const res = await fetch(q, {
    signal: AbortSignal.timeout(7000),
    headers: { accept: "application/json" },
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    features?: { attributes?: Record<string, unknown> }[];
    error?: unknown;
  };
  if (data.error || !data.features?.length) return null;
  return data.features[0].attributes ?? null;
}

export async function lookupParcel(
  lat: number,
  lng: number,
  county: string | null,
): Promise<ParcelData | null> {
  const layers = county ? COUNTY_LAYERS[county] : undefined;
  if (!layers) return null;

  for (const url of layers) {
    try {
      const attrs = await queryLayer(url, lat, lng);
      if (!attrs) continue;

      const ownerName = toStr(
        pick(attrs, /owner|taxpayer/i, /addr|mail|city|state|zip|care|co_owner_addr/i),
      );
      const yearBuilt = toNumber(pick(attrs, /year.?built|yr.?blt|yearbuilt|actyrblt/i));
      const assessedValue = toNumber(
        pick(attrs, /assess|market.?val|total.?val|apprais|taxable.?val/i, /land.?val|year/i),
      );
      const situsAddress = toStr(pick(attrs, /situs|site.?addr|prop.?addr|location.?addr/i, /owner|mail/i));
      const landUse = toStr(pick(attrs, /land.?use|use.?code|prop.?class|property.?type|use.?desc/i));

      return {
        ownerName,
        yearBuilt: yearBuilt && yearBuilt > 1700 && yearBuilt <= new Date().getFullYear() ? yearBuilt : null,
        assessedValue,
        situsAddress,
        landUse,
        source: url,
        raw: attrs,
      };
    } catch {
      // try the next candidate URL
    }
  }
  return null;
}

/** Predicted-need flags from property age (electrical upsell hints). */
export function propertyNeedFlags(yearBuilt: number | null): string[] {
  if (!yearBuilt) return [];
  const flags: string[] = [];
  if (yearBuilt < 1960) flags.push("knob_and_tube_risk");
  if (yearBuilt < 1980) flags.push("panel_upgrade_candidate");
  if (yearBuilt < 1990) flags.push("aging_wiring");
  return flags;
}
