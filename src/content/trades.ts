/**
 * Trades the platform covers. The brand is trade-agnostic; we launch with electrical
 * and add trades over time. The homepage is a trade selector that routes visitors to
 * the right trade hub. Non-live trades get a lightweight "coming soon" page (noindex)
 * so we don't ship thin content for services we can't yet fulfill.
 */

export type TradeStatus = "live" | "coming_soon";

export interface Trade {
  slug: string;
  /** Display name, e.g. "Electrical". */
  name: string;
  /** The pro noun, e.g. "electrician". */
  pro: string;
  /** Plural pro noun, e.g. "electricians". */
  proPlural: string;
  status: TradeStatus;
  /** Destination when the card is clicked. */
  href: string;
  /** Short card tagline. */
  tagline: string;
  /** Icon key (see ICONS in components). */
  icon: string;
  /** Examples of jobs, for the card + coming-soon page. */
  examples: string[];
}

export const TRADES: Trade[] = [
  {
    slug: "electrical",
    name: "Electrical",
    pro: "electrician",
    proPlural: "electricians",
    status: "live",
    href: "/electricians",
    tagline: "Panel upgrades, EV chargers, repairs & more",
    icon: "bolt",
    examples: ["Panel upgrades", "EV chargers", "Repairs", "Rewiring", "Lighting"],
  },
  {
    slug: "plumbing",
    name: "Plumbing",
    pro: "plumber",
    proPlural: "plumbers",
    status: "coming_soon",
    href: "/trades/plumbing",
    tagline: "Leaks, water heaters, repipes & drains",
    icon: "drop",
    examples: ["Water heaters", "Leak repair", "Drain cleaning", "Repipes", "Fixtures"],
  },
  {
    slug: "hvac",
    name: "Heating & Cooling",
    pro: "HVAC pro",
    proPlural: "HVAC pros",
    status: "coming_soon",
    href: "/trades/hvac",
    tagline: "Furnaces, AC, heat pumps & mini-splits",
    icon: "thermometer",
    examples: ["AC install", "Furnace repair", "Heat pumps", "Mini-splits", "Maintenance"],
  },
  {
    slug: "roofing",
    name: "Roofing",
    pro: "roofer",
    proPlural: "roofers",
    status: "coming_soon",
    href: "/trades/roofing",
    tagline: "Repairs, replacements & inspections",
    icon: "home",
    examples: ["Roof repair", "Replacement", "Inspections", "Gutters", "Storm damage"],
  },
  {
    slug: "landscaping",
    name: "Landscaping",
    pro: "landscaper",
    proPlural: "landscapers",
    status: "coming_soon",
    href: "/trades/landscaping",
    tagline: "Design, cleanup, irrigation & hardscapes",
    icon: "leaf",
    examples: ["Yard cleanup", "Irrigation", "Hardscapes", "Design", "Maintenance"],
  },
];

export function getTrade(slug: string): Trade | undefined {
  return TRADES.find((t) => t.slug === slug);
}

export const LIVE_TRADES = TRADES.filter((t) => t.status === "live");
export const COMING_SOON_TRADES = TRADES.filter((t) => t.status === "coming_soon");
