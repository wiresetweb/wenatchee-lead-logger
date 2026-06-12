/**
 * Service-area cities. Drives the /locations hub, the dynamic /locations/[city]
 * pages, and (Phase 4) the programmatic service×city pages. Ordered by priority
 * (population + search demand). `county` is used for enrichment routing later.
 */

export interface City {
  slug: string;
  name: string;
  county: "Chelan" | "Douglas" | "Grant";
  /** Approximate population — context only. */
  population: number;
  /** Short local-context blurb for the city page (helps E-E-A-T + uniqueness). */
  blurb: string;
  /** Featured on homepage/footer. */
  featured?: boolean;
}

export const CITIES: City[] = [
  {
    slug: "wenatchee",
    name: "Wenatchee",
    county: "Chelan",
    population: 35000,
    blurb:
      "The hub of the valley and the 'Apple Capital of the World.' We connect Wenatchee " +
      "homeowners — from the South End to Sunnyslope — with trusted local pros.",
    featured: true,
  },
  {
    slug: "east-wenatchee",
    name: "East Wenatchee",
    county: "Douglas",
    population: 14000,
    blurb:
      "Just across the Columbia in Douglas County, East Wenatchee homeowners get matched " +
      "with the same vetted local pros serving the greater Wenatchee area.",
    featured: true,
  },
  {
    slug: "cashmere",
    name: "Cashmere",
    county: "Chelan",
    population: 3200,
    blurb:
      "A close-knit community up the valley, Cashmere is well within our pros' service area " +
      "for everything from panel upgrades to lighting.",
    featured: true,
  },
  {
    slug: "leavenworth",
    name: "Leavenworth",
    county: "Chelan",
    population: 2300,
    blurb:
      "From historic homes to vacation rentals, Leavenworth properties have unique electrical " +
      "needs — we match owners with pros who know the area.",
    featured: true,
  },
  {
    slug: "chelan",
    name: "Chelan",
    county: "Chelan",
    population: 4100,
    blurb:
      "Lakeside homes and seasonal properties around Lake Chelan — we connect owners with " +
      "trusted local pros for repairs, upgrades, and installs.",
    featured: true,
  },
  {
    slug: "entiat",
    name: "Entiat",
    county: "Chelan",
    population: 1100,
    blurb:
      "Between Wenatchee and Chelan along the river, Entiat homeowners are covered by our " +
      "network of local pros.",
  },
  {
    slug: "malaga",
    name: "Malaga",
    county: "Chelan",
    population: 1300,
    blurb:
      "Just south of Wenatchee, Malaga is part of our core service area for electrical work.",
  },
  {
    slug: "rock-island",
    name: "Rock Island",
    county: "Douglas",
    population: 1300,
    blurb:
      "Rock Island homeowners in Douglas County get matched with the same trusted pros " +
      "serving the Wenatchee area.",
  },
  {
    slug: "quincy",
    name: "Quincy",
    county: "Grant",
    population: 7800,
    blurb:
      "Out on the Columbia Basin, Quincy is within reach of our valley pros for residential " +
      "electrical projects.",
  },
];

export function getCity(slug: string): City | undefined {
  return CITIES.find((c) => c.slug === slug);
}

export const FEATURED_CITIES = CITIES.filter((c) => c.featured);
