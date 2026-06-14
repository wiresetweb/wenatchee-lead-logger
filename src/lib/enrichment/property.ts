/**
 * County parcel lookup via public ArcGIS REST services (free). Given the lead's
 * geocoded coordinates, we do a point-in-polygon query against the county's parcel
 * layer and pull the owner of record + property attributes.
 *
 * Field names vary by county, so we DON'T hardcode them — we request all fields and
 * detect the owner / year-built / value / land-use fields by matching attribute keys.
 * Every failure degrades gracefully to null, and the lookup records a diagnostics trail
 * (each URL tried, HTTP status, feature count) plus a probe of the server catalog when
 * nothing matches — so a real lead reveals the correct endpoints when we can't test
 * these hosts locally (sandbox egress is restricted).
 *
 * Sources: Chelan County Assessor parcels (maps.wenatcheewa.gov), Douglas County GIS
 * (gis.douglascountywa.gov). Owner names are public records for taxation.
 */

export interface ParcelAttempt {
  url: string;
  status?: number;
  features?: number;
  services?: string[];
  folders?: string[];
  error?: string;
}

export interface ParcelData {
  ownerName: string | null;
  /** Owner's tax-mailing address — when it differs from the property, the owner is
   *  likely absentee (a landlord/investor). */
  mailingAddress: string | null;
  yearBuilt: number | null;
  assessedValue: number | null;
  situsAddress: string | null;
  landUse: string | null;
  /** Last recorded sale, for new-homeowner / tenure signals. */
  saleDate: string | null;
  salePrice: number | null;
  // Property size details (job-size signal for buyers).
  sqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  stories: number | null;
  heating: string | null;
  cooling: string | null;
  /** Which endpoint answered (null if none did). */
  source: string | null;
  raw: Record<string, unknown> | null;
  /** Diagnostics trail for tuning against real leads. */
  attempts: ParcelAttempt[];
}

/** Candidate parcel layer URLs per county, tried in order until one returns a feature. */
const COUNTY_LAYERS: Record<string, string[]> = {
  Chelan: [
    "https://maps.wenatcheewa.gov/server/rest/services/Parcels/FeatureServer/0",
  ],
  // Douglas County migrated gis.douglascountywa.net → gis.douglascountywa.gov (the old
  // host is dead). The public "Parcels" service is token-gated; the open parcel data is
  // exposed via Parcel_Sales_Export_Tool (discovered from the live server catalog).
  Douglas: [
    "https://gis.douglascountywa.gov/server/rest/services/Parcel_Sales_Export_Tool/MapServer/0",
    "https://gis.douglascountywa.gov/server/rest/services/Parcel_Sales_Export_Tool/FeatureServer/0",
  ],
};

/** Detect a field value from an attributes object by matching the key name. */
function pick(attrs: Record<string, unknown>, include: RegExp, exclude?: RegExp): unknown {
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

async function queryLayer(
  url: string,
  lat: number,
  lng: number,
  attempt: ParcelAttempt,
): Promise<Record<string, unknown> | null> {
  const q =
    `${url}/query?geometry=${lng},${lat}&geometryType=esriGeometryPoint&inSR=4326` +
    `&spatialRel=esriSpatialRelIntersects&outFields=*&returnGeometry=false&f=json`;
  const res = await fetch(q, { signal: AbortSignal.timeout(7000), headers: { accept: "application/json" } });
  attempt.status = res.status;
  if (!res.ok) return null;
  const data = (await res.json()) as {
    features?: { attributes?: Record<string, unknown> }[];
    error?: { message?: string };
  };
  if (data.error) attempt.error = data.error.message ?? "arcgis error";
  attempt.features = data.features?.length ?? 0;
  if (data.error || !data.features?.length) return null;
  return data.features[0].attributes ?? null;
}

/** Map a parcel-feature attributes object to ParcelData (field names vary by county, so
 *  we detect them by key pattern). Shared by configured + discovered layer hits. */
function buildFromAttrs(
  attrs: Record<string, unknown>,
  url: string,
  attempts: ParcelAttempt[],
): ParcelData {
  const ownerName = toStr(pick(attrs, /owner|taxpayer/i, /addr|mail|city|state|zip|care|co_owner_addr/i));
  const yb = toNumber(pick(attrs, /year.?built|yr.?blt|yearbuilt|actyrblt/i));
  const bath = toNumber(pick(attrs, /bath|bthrm|\bba\b|full.?bath/i, /half|garage/i));
  return {
    ownerName,
    mailingAddress: toStr(pick(attrs, /mail|owner.?addr|tax.?addr|care.?of/i, /name|city|state|zip|country/i)),
    yearBuilt: yb && yb > 1700 && yb <= new Date().getFullYear() ? yb : null,
    assessedValue: toNumber(pick(attrs, /assess|market.?val|total.?val|apprais|taxable.?val/i, /land.?val|year/i)),
    situsAddress: toStr(pick(attrs, /situs|site.?addr|prop.?addr|location.?addr/i, /owner|mail/i)),
    landUse: toStr(pick(attrs, /land.?use|use.?code|prop.?class|property.?type|use.?desc/i)),
    saleDate: toStr(pick(attrs, /sale.?date|saledt|deed.?date|rec.?date|transfer.?date|doc.?date|last.?sale/i, /price|amt|val/i)),
    salePrice: toNumber(pick(attrs, /sale.?price|sale.?amt|saleamt|sale.?val|consideration|deed.?price/i, /date|year/i)),
    sqft: toNumber(pick(attrs, /sq.?ft|sqft|square.?feet|living.?area|finished.?area|bldg.?area|heated.?area|gross.?area|\bgla\b/i, /lot|land|unfinished|base|garage/i)),
    bedrooms: toNumber(pick(attrs, /bed|bdrm|\bbr\b|nbr.?bed/i, /bath/i)),
    bathrooms: bath,
    stories: toNumber(pick(attrs, /stor(y|ies)|num.?floor|nbr.?stor|floors/i, /sqft|area/i)),
    heating: toStr(pick(attrs, /heat/i, /water.?heat|sqft|area/i)),
    cooling: toStr(pick(attrs, /cool|air.?cond|central.?air|\bac\b/i, /account|tract/i)),
    source: url,
    raw: attrs,
    attempts,
  };
}

/** Fetch + parse JSON, returning null on any failure (network, !ok, parse). */
async function fetchJson(url: string): Promise<unknown | null> {
  try {
    const r = await fetch(url, { signal: AbortSignal.timeout(7000), headers: { accept: "application/json" } });
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}

/**
 * Probe the ArcGIS server catalog (root + folders) for diagnostics AND derive candidate
 * parcel layer URLs — any service whose name mentions "parcel" on a Map/FeatureServer,
 * enumerating each service's layers to find the real parcel layer id. This self-heals
 * when a county renames or restructures its parcel service (as Douglas did).
 */
async function discover(base: string): Promise<{ attempt: ParcelAttempt; candidates: string[] }> {
  const url = `${base}?f=json`;
  const attempt: ParcelAttempt = { url };
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(7000), headers: { accept: "application/json" } });
    attempt.status = res.status;
    if (!res.ok) return { attempt, candidates: [] };
    const data = (await res.json()) as {
      services?: { name?: string; type?: string }[];
      folders?: string[];
    };
    const folders = data.folders ?? [];
    // Pull each folder's service list too (parcels often live in a folder), in parallel.
    const folderLists = await Promise.all(
      folders.slice(0, 8).map(async (f) => {
        try {
          const r = await fetch(`${base}/${encodeURIComponent(f)}?f=json`, {
            signal: AbortSignal.timeout(7000),
            headers: { accept: "application/json" },
          });
          if (!r.ok) return [] as { name?: string; type?: string }[];
          const d = (await r.json()) as { services?: { name?: string; type?: string }[] };
          return d.services ?? [];
        } catch {
          return [] as { name?: string; type?: string }[];
        }
      }),
    );
    const all = [...(data.services ?? []), ...folderLists.flat()];
    attempt.services = all.map((s) => `${s.name}/${s.type}`).slice(0, 60);
    attempt.folders = folders.slice(0, 40);

    // Parcel-ish services, then enumerate each service's actual layers (the parcel layer
    // is often NOT id 0) and build precise layer URLs — preferring layers named "parcel".
    const parcelSvcs = all
      .filter((s) => s.name && /parcel/i.test(s.name) && /(MapServer|FeatureServer)/i.test(s.type ?? ""))
      .slice(0, 4);
    const enumed = await Promise.all(
      parcelSvcs.map(async (s) => {
        const svcUrl = `${base}/${s.name}/${s.type}`;
        const meta = (await fetchJson(`${svcUrl}?f=json`)) as { layers?: { id?: number; name?: string }[] } | null;
        const layers = meta?.layers ?? [];
        // Record the layer list in diagnostics so a miss still reveals the right layer.
        const summary = `${s.name}/${s.type} layers=[${layers.map((L) => `${L.id}:${L.name}`).slice(0, 12).join(", ")}]`;
        if (!layers.length) return { urls: [`${svcUrl}/0`], summary };
        const named = layers.filter((L) => /parcel|tax|property|sales|owner|assess/i.test(L.name ?? ""));
        const urls = (named.length ? named : layers).slice(0, 6).map((L) => `${svcUrl}/${L.id ?? 0}`);
        return { urls, summary };
      }),
    );
    const candidates = [...new Set(enumed.flatMap((e) => e.urls))];
    attempt.services = [...(attempt.services ?? []), ...enumed.map((e) => e.summary)];
    return { attempt, candidates };
  } catch (e) {
    attempt.error = e instanceof Error ? e.message : String(e);
    return { attempt, candidates: [] };
  }
}

export async function lookupParcel(
  lat: number,
  lng: number,
  county: string | null,
): Promise<ParcelData | null> {
  const layers = county ? COUNTY_LAYERS[county] : undefined;
  if (!layers) return null;

  const attempts: ParcelAttempt[] = [];
  const empty = (): ParcelData => ({
    ownerName: null, mailingAddress: null, yearBuilt: null, assessedValue: null,
    situsAddress: null, landUse: null, saleDate: null, salePrice: null, sqft: null,
    bedrooms: null, bathrooms: null, stories: null, heating: null, cooling: null,
    source: null, raw: null, attempts,
  });

  // Try a list of candidate layer URLs; return the first that yields parcel attributes.
  const tryUrls = async (urls: string[]): Promise<ParcelData | null> => {
    for (const url of urls) {
      const attempt: ParcelAttempt = { url };
      attempts.push(attempt);
      try {
        const attrs = await queryLayer(url, lat, lng, attempt);
        if (attrs) return buildFromAttrs(attrs, url, attempts);
      } catch (e) {
        attempt.error = e instanceof Error ? e.message : String(e);
      }
    }
    return null;
  };

  // 1. Configured layers (fast path).
  const configured = await tryUrls(layers);
  if (configured) return configured;

  // 2. Discovery fallback: scan each server catalog for parcel services and try them.
  // Also records the catalog in diagnostics so a real lead reveals the true service names.
  const bases = [...new Set(layers.map((u) => u.replace(/\/rest\/services\/.*$/, "/rest/services")))];
  for (const base of bases) {
    const { attempt, candidates } = await discover(base);
    attempts.push(attempt);
    const discovered = await tryUrls(candidates.filter((u) => !layers.includes(u)));
    if (discovered) return discovered;
  }

  return empty();
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
