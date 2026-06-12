/**
 * Service catalog. Trade-agnostic by design — each service carries a `trade` so we
 * can expand beyond electrical without restructuring. Drives the /services hub,
 * the dynamic /services/[service] pages, the quote form's service picker, and the
 * service×city programmatic pages (Phase 4).
 *
 * Cost ranges are rough local ballparks for content/SEO ("cost guide" intent) and
 * should be validated; they are illustrative, not quotes.
 */

export type Trade = "electrical";

export interface Service {
  slug: string;
  trade: Trade;
  /** Short name for nav/cards. */
  name: string;
  /** Used in the quote form dropdown. */
  formLabel: string;
  /** One-line summary for cards and meta descriptions. */
  summary: string;
  /** Longer intro paragraph for the service page. */
  intro: string;
  /** Bullet points: what's typically involved. */
  whatsInvolved: string[];
  /** Signals a homeowner might need this — doubles as SEO copy. */
  signsYouNeedIt: string[];
  /** Rough installed cost range (USD) for the cost-guide block. */
  costLow: number;
  costHigh: number;
  /** FAQ entries (also emitted as FAQPage schema). */
  faqs: { q: string; a: string }[];
  /** Featured on the homepage grid. */
  featured?: boolean;
}

export const SERVICES: Service[] = [
  {
    slug: "electrical-panel-upgrade",
    trade: "electrical",
    name: "Panel upgrades",
    formLabel: "Electrical panel / breaker box upgrade",
    summary:
      "Upgrade an outdated or overloaded electrical panel to safely power a modern home.",
    intro:
      "An electrical panel upgrade replaces an undersized, outdated, or unsafe breaker " +
      "box — often a jump to 200 amps — so your home can handle today's appliances, EV " +
      "chargers, and added circuits without tripping or overheating.",
    whatsInvolved: [
      "Assessment of your current panel and total electrical load",
      "Permit and utility coordination (Washington L&I)",
      "Installation of a new panel and breakers, typically 100–200 amp",
      "Grounding, labeling, and a final safety inspection",
    ],
    signsYouNeedIt: [
      "Fuse box or a panel with fewer than 100–150 amps",
      "Frequently tripping breakers or flickering lights",
      "Adding an EV charger, hot tub, AC, or a home addition",
      "Federal Pacific / Zinsco or other recalled panels",
    ],
    costLow: 1500,
    costHigh: 4500,
    faqs: [
      {
        q: "How much does an electrical panel upgrade cost in the Wenatchee Valley?",
        a: "Most panel upgrades run roughly $1,500–$4,500 depending on amperage, whether the meter and service entrance are replaced, and local permit fees. Get matched with a local electrician for an exact quote.",
      },
      {
        q: "Do I need a permit to upgrade my electrical panel in Washington?",
        a: "Yes. Electrical work in Washington requires a permit and inspection through L&I (Labor & Industries). A licensed electrician pulls the permit as part of the job.",
      },
      {
        q: "How long does a panel upgrade take?",
        a: "Most residential panel upgrades are completed in a single day, with a short power interruption while the new panel is installed and inspected.",
      },
    ],
    featured: true,
  },
  {
    slug: "ev-charger-installation",
    trade: "electrical",
    name: "EV charger installation",
    formLabel: "EV charger (Level 2) installation",
    summary:
      "Install a Level 2 home charger so your EV charges fully overnight.",
    intro:
      "A Level 2 EV charger installation adds a dedicated 240-volt circuit and charging " +
      "station to your garage or driveway, charging most EVs several times faster than a " +
      "standard outlet — usually a full charge overnight.",
    whatsInvolved: [
      "Load check to confirm your panel can support a 240V circuit",
      "Dedicated circuit and outlet or hardwired charger install",
      "Mounting the charging unit and routing conduit cleanly",
      "Permit, inspection, and testing",
    ],
    signsYouNeedIt: [
      "New or upcoming EV purchase",
      "Slow charging from a standard 120V outlet",
      "Want a clean, permanent garage or exterior install",
    ],
    costLow: 800,
    costHigh: 2500,
    faqs: [
      {
        q: "How much does it cost to install an EV charger at home?",
        a: "A typical Level 2 home charger install runs about $800–$2,500, mostly depending on the distance from your panel and whether a panel upgrade is needed.",
      },
      {
        q: "Will my electrical panel support an EV charger?",
        a: "Many do, but EV chargers add significant load. An electrician checks your panel capacity and recommends an upgrade only if needed.",
      },
    ],
    featured: true,
  },
  {
    slug: "electrical-repair",
    trade: "electrical",
    name: "Electrical repair",
    formLabel: "Electrical repair / troubleshooting",
    summary:
      "Diagnose and fix outlets, switches, flickering lights, and dead circuits.",
    intro:
      "Electrical repair covers the everyday problems — dead outlets, faulty switches, " +
      "flickering lights, tripping breakers, and burning smells — that need a licensed " +
      "pro to diagnose safely and fix to code.",
    whatsInvolved: [
      "Troubleshooting to find the root cause",
      "Repair or replacement of outlets, switches, wiring, or breakers",
      "Safety check of affected circuits",
    ],
    signsYouNeedIt: [
      "Outlets or switches that don't work or feel warm",
      "Flickering or dimming lights",
      "Breakers that trip repeatedly",
      "Buzzing sounds or a burning smell near wiring",
    ],
    costLow: 150,
    costHigh: 800,
    faqs: [
      {
        q: "How much does an electrician charge for a repair?",
        a: "Small repairs commonly run $150–$800 depending on the issue and parts. Many electricians charge a service-call fee plus labor; you'll get an exact quote when matched.",
      },
      {
        q: "Is a burning smell from an outlet an emergency?",
        a: "Yes — turn off the circuit at the breaker and request a licensed electrician promptly. A burning smell can indicate dangerous overheating.",
      },
    ],
    featured: true,
  },
  {
    slug: "generator-installation",
    trade: "electrical",
    name: "Generator installation",
    formLabel: "Generator (standby/whole-home) installation",
    summary:
      "Install a standby generator to keep your home powered through outages.",
    intro:
      "A standby generator installation wires a permanent backup generator and automatic " +
      "transfer switch into your home so essential circuits — or the whole house — keep " +
      "running automatically when the grid goes down.",
    whatsInvolved: [
      "Sizing the generator to the circuits you want backed up",
      "Automatic transfer switch installation",
      "Electrical and fuel hookups, permit, and inspection",
    ],
    signsYouNeedIt: [
      "Frequent or long power outages",
      "Medical equipment or well pump that needs reliable power",
      "Want automatic backup without manual setup",
    ],
    costLow: 4000,
    costHigh: 12000,
    faqs: [
      {
        q: "How much does a whole-home generator cost installed?",
        a: "Installed standby generators typically run $4,000–$12,000+ depending on size, fuel type, and transfer-switch complexity.",
      },
    ],
  },
  {
    slug: "house-rewiring",
    trade: "electrical",
    name: "Rewiring",
    formLabel: "House rewiring / knob-and-tube replacement",
    summary:
      "Replace old, unsafe wiring — including knob-and-tube and aluminum — with modern wiring.",
    intro:
      "Whole or partial house rewiring replaces aging, unsafe wiring (such as knob-and-tube " +
      "or aluminum) with modern copper wiring, improving safety, insurability, and capacity.",
    whatsInvolved: [
      "Inspection of existing wiring and circuits",
      "Phased replacement of wiring, boxes, and devices",
      "Drywall coordination, permit, and inspection",
    ],
    signsYouNeedIt: [
      "Home built before ~1980 with original wiring",
      "Knob-and-tube or aluminum wiring",
      "Two-prong outlets throughout the home",
      "Insurance requiring a wiring update",
    ],
    costLow: 3000,
    costHigh: 15000,
    faqs: [
      {
        q: "How much does it cost to rewire a house?",
        a: "Rewiring commonly runs $3,000–$15,000+ depending on home size, access, and whether it's a partial or full rewire.",
      },
    ],
  },
  {
    slug: "lighting-installation",
    trade: "electrical",
    name: "Lighting & fixtures",
    formLabel: "Lighting / ceiling fan installation",
    summary:
      "Install recessed lighting, fixtures, and ceiling fans cleanly and safely.",
    intro:
      "Lighting installation covers recessed (can) lights, new fixtures, under-cabinet " +
      "lighting, and ceiling fans — including the wiring, switches, and boxes to support them.",
    whatsInvolved: [
      "Fixture and switch placement and wiring",
      "New boxes and circuits where needed",
      "Cleanup and testing",
    ],
    signsYouNeedIt: [
      "Dark rooms that need recessed lighting",
      "Replacing fixtures or adding a ceiling fan",
      "Adding switches or dimmers",
    ],
    costLow: 150,
    costHigh: 3000,
    faqs: [
      {
        q: "How much does it cost to install recessed lighting?",
        a: "Recessed lighting often runs about $150–$300 per fixture installed, with the per-light cost dropping as more are installed at once.",
      },
    ],
  },
];

export const TRADES: Record<Trade, { label: string; noun: string; pro: string }> = {
  electrical: { label: "Electrical", noun: "electrical work", pro: "electrician" },
};

export function getService(slug: string): Service | undefined {
  return SERVICES.find((s) => s.slug === slug);
}

export const FEATURED_SERVICES = SERVICES.filter((s) => s.featured);
