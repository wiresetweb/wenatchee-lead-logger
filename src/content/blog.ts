/**
 * Blog content. These are informational, locally-framed articles that target
 * top-of-funnel "questions" searches, build topical authority, and link internally
 * to the money pages (services, cost guides, city pages). See docs/SEO_STRATEGY.md.
 *
 * Content is authored here as typed blocks so it renders consistently and stays
 * decoupled from layout. Keep articles genuinely useful and unique — never thin.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "cta"; text: string; href: string; label: string };

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date. */
  date: string;
  readMins: number;
  category: string;
  body: Block[];
  faqs?: { q: string; a: string }[];
  related: { label: string; href: string }[];
}

export const POSTS: Post[] = [
  {
    slug: "do-you-need-a-permit-for-electrical-work-in-washington",
    title: "Do You Need a Permit for Electrical Work in Washington?",
    excerpt:
      "When Washington requires an electrical permit, what homeowners can legally do themselves, and why a licensed electrician handles it for you.",
    date: "2026-06-13",
    readMins: 5,
    category: "Permits & code",
    body: [
      { type: "p", text: "Short answer: most electrical work in Washington requires a permit and an inspection through the Department of Labor & Industries (L&I). It's not red tape for its own sake — the permit triggers an inspection that confirms the work is safe and to code, which protects your home, your insurance coverage, and the next owner." },
      { type: "h2", text: "What needs a permit?" },
      { type: "p", text: "In general, any new wiring or changes to your electrical system need a permit. That includes the projects Wenatchee Valley homeowners ask about most:" },
      { type: "ul", items: [
        "Upgrading or replacing an electrical panel",
        "Adding a circuit — for an EV charger, hot tub, AC, or a remodel",
        "Rewiring all or part of a home",
        "Installing a standby generator and transfer switch",
        "Moving or adding outlets, switches, or hardwired fixtures",
      ] },
      { type: "p", text: "Simple like-for-like swaps — replacing a light fixture, a switch, or a receptacle on an existing circuit — generally don't require a permit. When in doubt, ask; a licensed electrician will know." },
      { type: "h2", text: "Can I pull my own permit as a homeowner?" },
      { type: "p", text: "Washington does allow homeowners to do electrical work on a single-family home they own and live in, and to pull a homeowner permit. But there's a catch: you have to do the work yourself (you can't hire an unlicensed helper), and you're responsible for it passing inspection. For anything beyond the basics, the safer and often cheaper route is a licensed electrical contractor." },
      { type: "h2", text: "Why this matters for hiring" },
      { type: "p", text: "A licensed electrician pulls the permit and schedules the inspection as part of the job — you don't have to touch the paperwork. If a contractor suggests skipping the permit to save time or money, treat that as a red flag: unpermitted work can cause problems with insurance claims and home sales, and it may have to be redone." },
      { type: "cta", text: "Need licensed electrical work done right?", href: "/electricians", label: "Get matched with a local electrician" },
    ],
    faqs: [
      { q: "Does replacing a light fixture need a permit in Washington?", a: "Generally no — a like-for-like fixture, switch, or outlet swap on an existing circuit doesn't require a permit. New circuits or wiring changes do." },
      { q: "Who pulls the permit, me or the electrician?", a: "A licensed electrical contractor pulls the permit and schedules the L&I inspection as part of the job. You don't have to handle it." },
    ],
    related: [
      { label: "Electrical panel upgrade cost", href: "/guides/electrical-panel-upgrade-cost" },
      { label: "Find a local electrician", href: "/electricians" },
    ],
  },
  {
    slug: "signs-your-home-needs-an-electrical-panel-upgrade",
    title: "7 Signs Your Home Needs an Electrical Panel Upgrade",
    excerpt:
      "Flickering lights, a warm panel, an old fuse box — here's how to tell when it's time to upgrade your electrical panel, especially in older Wenatchee Valley homes.",
    date: "2026-06-13",
    readMins: 6,
    category: "Home electrical",
    body: [
      { type: "p", text: "Your electrical panel is the heart of your home's wiring. When it's undersized or aging, you'll usually get warning signs before anything serious happens. Here are seven worth paying attention to — several are common in older homes around Wenatchee, Cashmere, and Leavenworth." },
      { type: "h2", text: "1. You still have a fuse box" },
      { type: "p", text: "Fuse boxes were standard before the 1960s. They're not automatically dangerous, but they often can't keep up with modern electrical demand, and insurers increasingly want to see them replaced with a modern breaker panel." },
      { type: "h2", text: "2. Breakers trip often" },
      { type: "p", text: "An occasional trip is normal. Breakers that trip regularly — especially when you run a microwave and toaster together, or start up an AC unit — usually mean your panel or circuits are overloaded." },
      { type: "h2", text: "3. Flickering or dimming lights" },
      { type: "p", text: "If lights dim when a large appliance kicks on, your system may be struggling to deliver enough power. That's a classic sign you're near capacity." },
      { type: "h2", text: "4. The panel is warm, buzzing, or smells hot" },
      { type: "p", text: "A panel should be quiet and cool. Warmth, a buzzing sound, or a burning smell are urgent — shut off the main if it's safe to and get a licensed electrician out promptly." },
      { type: "h2", text: "5. You're adding a big load" },
      { type: "p", text: "Adding an EV charger, hot tub, central AC, or a home addition can push an older panel past its limit. It's often the moment people discover they need more capacity — usually a jump to 200 amps." },
      { type: "h2", text: "6. You have a recalled panel" },
      { type: "p", text: "Federal Pacific (FPE) and Zinsco panels have a known history of breakers that fail to trip. If you have one, electricians widely recommend replacement regardless of other symptoms." },
      { type: "h2", text: "7. Reliance on extension cords and power strips" },
      { type: "p", text: "If outlets are scarce and you've got power strips everywhere, that's a sign the home's circuits weren't designed for today's electrical load — an upgrade plus added circuits can fix it." },
      { type: "cta", text: "Think it's time for an upgrade?", href: "/services/electrical-panel-upgrade", label: "Learn about panel upgrades" },
    ],
    faqs: [
      { q: "How much does a panel upgrade cost?", a: "In the Wenatchee Valley, most panel upgrades run about $1,500–$4,500 depending on amperage and whether the meter/service entrance is replaced. See our panel upgrade cost guide for a full breakdown." },
    ],
    related: [
      { label: "Panel upgrade cost guide", href: "/guides/electrical-panel-upgrade-cost" },
      { label: "Panel upgrades", href: "/services/electrical-panel-upgrade" },
    ],
  },
  {
    slug: "how-to-choose-a-licensed-electrician-wenatchee-valley",
    title: "How to Choose a Licensed Electrician in the Wenatchee Valley",
    excerpt:
      "How to verify a Washington electrical license, the questions to ask before you hire, and the red flags that should make you walk away.",
    date: "2026-06-13",
    readMins: 5,
    category: "Hiring guide",
    body: [
      { type: "p", text: "Hiring the right electrician is mostly about doing a few quick checks up front. Here's how to make sure the person working on your home is licensed, insured, and a good fit — without spending your weekend calling around." },
      { type: "h2", text: "Verify the Washington license" },
      { type: "p", text: "Electrical contractors in Washington must be licensed through L&I. You can look up any contractor's license, bond, and insurance status on the L&I 'Verify a Contractor' tool. A legitimate pro will gladly give you their license number." },
      { type: "h2", text: "Confirm insurance and bonding" },
      { type: "p", text: "Licensed electrical contractors carry liability insurance and a bond. This protects you if something goes wrong. Don't take it on faith — it's part of the license record you can verify online." },
      { type: "h2", text: "Ask the right questions" },
      { type: "ul", items: [
        "Are you licensed and insured in Washington? (Get the license number.)",
        "Will you pull the permit and handle the inspection?",
        "Is the quote itemized, and what could change the price?",
        "Who does the actual work — you, an employee, or a subcontractor?",
        "Do you warranty your work?",
      ] },
      { type: "h2", text: "Watch for red flags" },
      { type: "p", text: "A few things should give you pause: pressure to skip the permit, cash-only deals with no paperwork, a large up-front deposit, no verifiable license, or a quote that's dramatically lower than everyone else's. Quality electrical work is worth getting right the first time." },
      { type: "h2", text: "Let us do the legwork" },
      { type: "p", text: "That's exactly the hassle Cascade Home Connect removes. You tell us what you need, and we match you with a trusted local electrician who serves your area — so you skip the cold-calling and get a same-day callback." },
      { type: "cta", text: "Skip the phone tag", href: "/electricians", label: "Get matched with an electrician" },
    ],
    related: [
      { label: "How it works", href: "/how-it-works" },
      { label: "Find an electrician", href: "/electricians" },
    ],
  },
  {
    slug: "is-knob-and-tube-wiring-safe-older-wenatchee-homes",
    title: "Is Knob-and-Tube Wiring Safe? A Guide for Older Wenatchee Homes",
    excerpt:
      "What knob-and-tube wiring is, the real risks in older Wenatchee Valley homes, what it means for insurance, and when to rewire.",
    date: "2026-06-13",
    readMins: 6,
    category: "Home electrical",
    body: [
      { type: "p", text: "Plenty of charming older homes in Wenatchee, Cashmere, and Leavenworth were built with knob-and-tube (K&T) wiring. If you own one — or you're buying one — it's worth understanding what K&T is and when it becomes a problem." },
      { type: "h2", text: "What is knob-and-tube wiring?" },
      { type: "p", text: "K&T was the standard method of wiring homes from roughly the 1880s into the 1940s. It uses ceramic knobs to anchor wires and ceramic tubes to pass them through framing. The wiring itself isn't inherently 'live dangerous' — but it was designed for a very different era of electrical use." },
      { type: "h2", text: "Where the real risks come in" },
      { type: "ul", items: [
        "No ground wire — K&T is a two-wire system, so it can't safely serve modern three-prong appliances and electronics.",
        "Brittle insulation — after decades, the original insulation can crack and crumble, exposing conductors.",
        "Buried in insulation — K&T was designed to dissipate heat in open air. When later owners add blown-in attic insulation over it, it can overheat.",
        "Amateur modifications — many problems come from decades of unpermitted splices and add-ons, not the original wiring.",
      ] },
      { type: "h2", text: "What it means for insurance" },
      { type: "p", text: "This is often the deciding factor. Many insurers won't write or renew a policy on a home with active knob-and-tube wiring, or they charge significantly more. If you're buying, your lender or insurer may require remediation." },
      { type: "h2", text: "Do you have to rewire everything?" },
      { type: "p", text: "Not always. An electrician can assess how much active K&T remains and whether a partial or full rewire makes sense. Many homeowners phase the work, starting with the highest-risk circuits." },
      { type: "cta", text: "Wondering about your home's wiring?", href: "/services/house-rewiring", label: "Learn about rewiring" },
    ],
    faqs: [
      { q: "Does knob-and-tube wiring need to be removed?", a: "Not always entirely, but active K&T is often remediated for safety and insurance reasons. An electrician can assess whether a partial or full rewire is appropriate." },
      { q: "How much does it cost to rewire a house?", a: "In the Wenatchee Valley, rewiring commonly runs $3,000–$15,000+ depending on home size and access. See our rewiring cost guide." },
    ],
    related: [
      { label: "Cost to rewire a house", href: "/guides/cost-to-rewire-a-house" },
      { label: "House rewiring", href: "/services/house-rewiring" },
    ],
  },
  {
    slug: "ev-charger-what-wenatchee-homeowners-should-know",
    title: "Thinking About an EV Charger? What Wenatchee Homeowners Should Know",
    excerpt:
      "Level 1 vs. Level 2, whether your panel can handle it, what installation costs locally, and the permit you'll need.",
    date: "2026-06-13",
    readMins: 5,
    category: "EV & energy",
    body: [
      { type: "p", text: "More Wenatchee Valley homeowners are going electric, and the first question is almost always the same: how do I charge it at home? Here's what you actually need to know before you install a charger." },
      { type: "h2", text: "Level 1 vs. Level 2" },
      { type: "p", text: "Level 1 means plugging into a standard 120-volt outlet. It works, but it's slow — often only adding a few miles of range per hour. Level 2 uses a dedicated 240-volt circuit (like an electric dryer) and charges several times faster, usually filling up overnight. For most households, Level 2 is the way to go." },
      { type: "h2", text: "Can your panel handle it?" },
      { type: "p", text: "An EV charger is a big continuous load. Many panels can accommodate one, but if yours is older, smaller, or already full, you may need a panel upgrade first. A licensed electrician checks your available capacity before recommending anything — you shouldn't be upsold an upgrade you don't need." },
      { type: "h2", text: "What it costs locally" },
      { type: "p", text: "In the Wenatchee Valley, a Level 2 charger install typically runs $800–$2,500. The biggest variable is the distance from your panel to where the charger goes — a charger near the panel is inexpensive, while a long run to a detached garage costs more." },
      { type: "h2", text: "Yes, you'll need a permit" },
      { type: "p", text: "Adding a 240-volt circuit requires a permit and inspection through L&I. A licensed electrician handles that as part of the job, so the install is safe and code-compliant." },
      { type: "cta", text: "Ready to charge at home?", href: "/services/ev-charger-installation", label: "Learn about EV charger installation" },
    ],
    faqs: [
      { q: "Do I need a panel upgrade for an EV charger?", a: "Not always. Many panels can handle a Level 2 charger, but if yours is full or undersized you may need an upgrade. An electrician checks your capacity first." },
      { q: "How much does EV charger installation cost?", a: "Typically $800–$2,500 in the Wenatchee Valley, mostly depending on the distance from your panel. See our EV charger cost guide." },
    ],
    related: [
      { label: "EV charger cost guide", href: "/guides/ev-charger-installation-cost" },
      { label: "EV charger installation", href: "/services/ev-charger-installation" },
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export const POSTS_BY_DATE = [...POSTS].sort((a, b) => (a.date < b.date ? 1 : -1));
