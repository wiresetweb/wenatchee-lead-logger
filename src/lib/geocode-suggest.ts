"use server";

/**
 * Address autocomplete for the quote form. Returns structured suggestions so picking one
 * fills street + city + ZIP in one tap — which also sharpens enrichment (a clean address
 * geocodes reliably and improves the owner-name match).
 *
 * Provider strategy (no setup required to work):
 *   - If MAPBOX_TOKEN is set → Mapbox Geocoding v6 (best US residential coverage).
 *   - Otherwise → Photon (OpenStreetMap, keyless public endpoint) as a free default.
 * Both are biased to the Wenatchee / north-central WA service area.
 */

export interface AddressSuggestion {
  id: string;
  /** Human-readable single line for the dropdown row. */
  label: string;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
}

// Service-area bias: Wenatchee city center + a box covering Chelan/Douglas and nearby.
const PROXIMITY = { lon: -120.31, lat: 47.423 };
const BBOX = { minLon: -121.2, minLat: 46.9, maxLon: -119.3, maxLat: 48.4 };

export async function suggestAddresses(query: string): Promise<AddressSuggestion[]> {
  const q = query.trim();
  if (q.length < 4) return [];

  // Prefer Mapbox when a token is set, but fall back to Photon if the token is missing,
  // invalid, restricted, or simply returns nothing — so autocomplete never goes dark
  // (e.g. when a plain-text MAPBOX_TOKEN Variable got wiped by a deploy).
  const token = process.env.MAPBOX_TOKEN;
  if (token) {
    try {
      const m = await mapbox(q, token);
      if (m.length > 0) return m;
    } catch (err) {
      console.warn("[geocode] Mapbox lookup failed; falling back to Photon:", err);
    }
  }
  try {
    return await photon(q);
  } catch {
    return [];
  }
}

async function mapbox(q: string, token: string): Promise<AddressSuggestion[]> {
  const url =
    `https://api.mapbox.com/search/geocode/v6/forward?q=${encodeURIComponent(q)}` +
    `&access_token=${encodeURIComponent(token)}&country=us&types=address&autocomplete=true&limit=6` +
    `&proximity=${PROXIMITY.lon},${PROXIMITY.lat}` +
    `&bbox=${BBOX.minLon},${BBOX.minLat},${BBOX.maxLon},${BBOX.maxLat}`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    features?: {
      id?: string;
      properties?: {
        mapbox_id?: string;
        name?: string;
        place_formatted?: string;
        context?: {
          place?: { name?: string };
          postcode?: { name?: string };
          region?: { region_code?: string };
        };
      };
    }[];
  };
  const out: AddressSuggestion[] = [];
  for (const f of data.features ?? []) {
    const p = f.properties ?? {};
    const addressLine1 = (p.name ?? "").trim();
    const city = p.context?.place?.name ?? "";
    const postalCode = p.context?.postcode?.name ?? "";
    const state = p.context?.region?.region_code ?? "WA";
    if (!addressLine1 || !city) continue;
    out.push({
      id: p.mapbox_id ?? f.id ?? `${addressLine1}-${postalCode}`,
      label: p.place_formatted ?? [addressLine1, city, postalCode].filter(Boolean).join(", "),
      addressLine1,
      city,
      state,
      postalCode,
    });
  }
  return out;
}

async function photon(q: string): Promise<AddressSuggestion[]> {
  const url =
    `https://photon.komoot.io/api?q=${encodeURIComponent(q)}&limit=8` +
    `&lat=${PROXIMITY.lat}&lon=${PROXIMITY.lon}&lang=en`;
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (!res.ok) return [];
  const data = (await res.json()) as {
    features?: {
      properties?: {
        osm_id?: number;
        housenumber?: string;
        street?: string;
        name?: string;
        city?: string;
        district?: string;
        postcode?: string;
        state?: string;
        countrycode?: string;
      };
    }[];
  };
  const out: AddressSuggestion[] = [];
  for (const f of data.features ?? []) {
    const p = f.properties ?? {};
    if (p.countrycode && p.countrycode !== "US") continue;
    const street = [p.housenumber, p.street].filter(Boolean).join(" ").trim();
    const addressLine1 = street || (p.name ?? "");
    const city = p.city ?? p.district ?? "";
    // Only suggest rows that can fill a usable address (need at least a street + city).
    if (!street || !city) continue;
    out.push({
      id: String(p.osm_id ?? `${addressLine1}-${p.postcode ?? ""}`),
      label: [addressLine1, city, p.postcode].filter(Boolean).join(", "),
      addressLine1,
      city,
      state: p.state === "Washington" ? "WA" : p.state ?? "WA",
      postalCode: p.postcode ?? "",
    });
  }
  return out;
}
