/**
 * Cost guides — high-intent informational content ("how much does X cost").
 * These are the highest-ROI SEO assets for lead gen: the searcher is mid-decision.
 * Each guide is substantive and unique (not templated) and links to the matching
 * service + a quote CTA. See docs/SEO_STRATEGY.md §8.
 */

export interface CostFactor {
  factor: string;
  detail: string;
}

export interface Guide {
  slug: string;
  /** Optional matching service slug for cross-linking. */
  serviceSlug?: string;
  title: string;
  /** Meta description. */
  summary: string;
  costLow: number;
  costHigh: number;
  /** Lead paragraph(s). */
  intro: string[];
  /** Itemized cost breakdown rows. */
  breakdown: { item: string; range: string }[];
  /** What drives the price up or down. */
  factors: CostFactor[];
  faqs: { q: string; a: string }[];
  updated: string;
}

export const GUIDES: Guide[] = [
  {
    slug: "electrical-panel-upgrade-cost",
    serviceSlug: "electrical-panel-upgrade",
    title: "Electrical Panel Upgrade Cost in the Wenatchee Valley (2026)",
    summary:
      "What an electrical panel upgrade costs in Wenatchee & the surrounding valley, what drives the price, and how to get an exact quote.",
    costLow: 1500,
    costHigh: 4500,
    updated: "June 2026",
    intro: [
      "Upgrading your electrical panel is one of the most common — and most worthwhile — electrical projects for valley homeowners, especially in older Wenatchee and Cashmere homes or any home adding an EV charger, hot tub, or AC.",
      "Most panel upgrades in the Wenatchee Valley run between $1,500 and $4,500. Where you land depends mostly on the amperage you need, whether the meter and service entrance are replaced, and local permit fees.",
    ],
    breakdown: [
      { item: "100–150 amp panel replacement", range: "$1,200 – $2,500" },
      { item: "200 amp panel upgrade (most common)", range: "$1,800 – $3,500" },
      { item: "Panel + meter/service entrance replacement", range: "$2,500 – $4,500" },
      { item: "Permit & inspection (L&I)", range: "$100 – $300" },
    ],
    factors: [
      {
        factor: "Amperage",
        detail: "Moving from a 100-amp panel (or an old fuse box) to 200 amps costs more but future-proofs your home for EVs, AC, and additions.",
      },
      {
        factor: "Service entrance & meter",
        detail: "If the weatherhead, mast, or meter base also need replacing, expect the higher end of the range.",
      },
      {
        factor: "Panel location & access",
        detail: "A hard-to-reach panel, or one that needs to be relocated, adds labor.",
      },
      {
        factor: "Recalled panels",
        detail: "Federal Pacific (FPE) and Zinsco panels are a safety hazard and should be replaced — your electrician will flag these.",
      },
    ],
    faqs: [
      {
        q: "Is a panel upgrade worth it?",
        a: "If you have a fuse box, under 150 amps, frequent tripping, or you're adding major loads like an EV charger or AC, yes — it improves safety and capacity and can help with home insurance and resale.",
      },
      {
        q: "How long does a panel upgrade take?",
        a: "Most are completed in a single day, with a short power interruption while the new panel is installed and inspected.",
      },
      {
        q: "Do I need a permit?",
        a: "Yes. Washington requires a permit and inspection through L&I; a licensed electrician handles this as part of the job.",
      },
    ],
  },
  {
    slug: "ev-charger-installation-cost",
    serviceSlug: "ev-charger-installation",
    title: "EV Charger Installation Cost in the Wenatchee Valley (2026)",
    summary:
      "What it costs to install a Level 2 home EV charger in Wenatchee & nearby, the main cost factors, and whether you'll need a panel upgrade.",
    costLow: 800,
    costHigh: 2500,
    updated: "June 2026",
    intro: [
      "A Level 2 home charger charges most EVs several times faster than a standard outlet — usually a full charge overnight. For valley homeowners, installed cost typically runs $800 to $2,500.",
      "The single biggest variable is the distance from your electrical panel to where the charger goes, followed by whether your panel has spare capacity or needs an upgrade.",
    ],
    breakdown: [
      { item: "Level 2 charger (hardware)", range: "$200 – $700" },
      { item: "Dedicated 240V circuit & install (short run)", range: "$400 – $1,200" },
      { item: "Long conduit run / detached garage", range: "$1,000 – $2,000" },
      { item: "Panel upgrade if required (separate)", range: "$1,800 – $3,500" },
    ],
    factors: [
      {
        factor: "Distance from the panel",
        detail: "A charger near the panel is cheap; a long run to a detached garage or across the house adds conduit and labor.",
      },
      {
        factor: "Panel capacity",
        detail: "Many panels can handle a charger, but if yours is full or undersized, a panel upgrade may be needed first.",
      },
      {
        factor: "Hardwired vs. plug-in",
        detail: "A NEMA 14-50 outlet is often cheaper than hardwiring, though hardwired units support higher continuous power.",
      },
    ],
    faqs: [
      {
        q: "Will my panel support an EV charger?",
        a: "Often yes, but EV chargers are a big continuous load. An electrician checks your panel's capacity and recommends an upgrade only if it's actually needed.",
      },
      {
        q: "Can I just use a regular outlet?",
        a: "A standard 120V outlet (Level 1) works but is slow. Most EV owners want a 240V Level 2 charger for overnight charging.",
      },
    ],
  },
  {
    slug: "cost-to-rewire-a-house",
    serviceSlug: "house-rewiring",
    title: "Cost to Rewire a House in the Wenatchee Valley (2026)",
    summary:
      "What whole-house and partial rewiring costs in Wenatchee & the surrounding valley, and what drives the price for older homes.",
    costLow: 3000,
    costHigh: 15000,
    updated: "June 2026",
    intro: [
      "Rewiring replaces aging, unsafe wiring — like knob-and-tube or aluminum — with modern copper. For older homes in Wenatchee, Cashmere, and Leavenworth, it's often a safety and insurability necessity.",
      "Cost depends heavily on home size and access. A partial rewire might be a few thousand dollars; a full rewire of a larger older home can reach $15,000 or more.",
    ],
    breakdown: [
      { item: "Partial rewire (a few circuits)", range: "$2,000 – $6,000" },
      { item: "Full rewire, small home (<1,500 sq ft)", range: "$6,000 – $10,000" },
      { item: "Full rewire, larger/older home", range: "$10,000 – $15,000+" },
      { item: "Drywall repair (if needed)", range: "varies" },
    ],
    factors: [
      {
        factor: "Home size & circuits",
        detail: "More square footage and more circuits mean more wire, boxes, and labor.",
      },
      {
        factor: "Access",
        detail: "Open walls, accessible attics/crawlspaces, and a single story keep costs down; finished walls that must be opened raise them.",
      },
      {
        factor: "Knob-and-tube or aluminum",
        detail: "Removing old knob-and-tube or remediating aluminum wiring adds time but is strongly recommended for safety and insurance.",
      },
    ],
    faqs: [
      {
        q: "How do I know if I need rewiring?",
        a: "Homes built before ~1980 with original wiring, two-prong outlets throughout, knob-and-tube or aluminum wiring, or insurance requiring an update are all signs. A licensed electrician can inspect and advise.",
      },
      {
        q: "Can rewiring be done in phases?",
        a: "Yes — many homeowners do a partial rewire of the most urgent circuits first, then complete the rest over time.",
      },
    ],
  },
  {
    slug: "generator-installation-cost",
    serviceSlug: "generator-installation",
    title: "Whole-Home Generator Cost in the Wenatchee Valley (2026)",
    summary:
      "What a standby generator costs installed in Wenatchee & nearby, including the transfer switch, fuel, and sizing.",
    costLow: 4000,
    costHigh: 12000,
    updated: "June 2026",
    intro: [
      "A standby generator keeps your home powered automatically when the grid goes down — valuable in the valley during winter storms or for homes on a well. Installed cost typically runs $4,000 to $12,000+.",
      "Generator size (in kW), fuel type, and the complexity of the automatic transfer switch are the biggest cost drivers.",
    ],
    breakdown: [
      { item: "Essential-circuits generator + transfer switch", range: "$4,000 – $7,000" },
      { item: "Whole-home standby generator (installed)", range: "$7,000 – $12,000" },
      { item: "Large home / complex install", range: "$12,000+" },
      { item: "Permit & inspection", range: "$150 – $400" },
    ],
    factors: [
      {
        factor: "Generator size (kW)",
        detail: "Backing up essential circuits costs less than powering the entire home, including AC and a well pump.",
      },
      {
        factor: "Fuel type",
        detail: "Natural gas, propane, and diesel each affect cost and require the right hookups.",
      },
      {
        factor: "Transfer switch",
        detail: "An automatic transfer switch (so the generator kicks on by itself) is standard for standby units and adds to the price.",
      },
    ],
    faqs: [
      {
        q: "Standby vs. portable generator — which do I need?",
        a: "A standby generator is permanently installed and starts automatically; a portable is cheaper but manual and limited. For reliable whole-home backup, standby is the way to go.",
      },
    ],
  },
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((g) => g.slug === slug);
}
