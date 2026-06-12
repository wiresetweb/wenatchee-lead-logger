/**
 * Central site configuration — the single source of truth for brand, contact,
 * navigation, and trade/geo defaults. Keep copy and structural values here so the
 * rest of the app (and a future designer) can reskin without hunting through pages.
 */

export const SITE = {
  name: "Cascade Home Connect",
  shortName: "Cascade Home Connect",
  parentCompany: "Emerald Lead Co.",
  domain: "cascadehomeconnect.com",
  // Canonical base URL. Override per-environment with NEXT_PUBLIC_SITE_URL.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://cascadehomeconnect.com",

  tagline: "Get matched with a trusted local pro — free, no obligation.",
  description:
    "Cascade Home Connect matches Wenatchee Valley homeowners with trusted, local " +
    "service pros. Request a free quote and a local pro reaches out the same day. " +
    "Always free for homeowners.",

  // Placeholder contact details — replace with real provisioned values before launch.
  phone: "(509) 555-0142",
  phoneHref: "tel:+15095550142",
  email: "hello@cascadehomeconnect.com",

  // The region we serve, in human-readable form.
  regionName: "the Wenatchee Valley",
  regionShort: "Wenatchee Valley",
  state: "WA",

  // Same-day contact promise cutoff (local hour, 24h). Leads after this show the
  // "next business day" fallback wording. See docs/COMPLIANCE.md §6.
  sameDayCutoffHour: 17,
} as const;

/** Primary nav shown in the header. */
export const NAV = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Services", href: "/services" },
  { label: "Service area", href: "/locations" },
  { label: "For contractors", href: "/for-contractors" },
  { label: "About", href: "/about" },
] as const;

/** Footer link groups. */
export const FOOTER_NAV = [
  {
    heading: "Company",
    links: [
      { label: "How it works", href: "/how-it-works" },
      { label: "About", href: "/about" },
      { label: "For contractors", href: "/for-contractors" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Popular services",
    links: [
      { label: "Electrical panel upgrade", href: "/services/electrical-panel-upgrade" },
      { label: "EV charger installation", href: "/services/ev-charger-installation" },
      { label: "Electrical repair", href: "/services/electrical-repair" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
] as const;
