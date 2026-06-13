# Project Plan — Emerald Lead Co. (Wenatchee Valley)

> Master planning document. Companion docs: [SEO_STRATEGY](SEO_STRATEGY.md),
> [LEAD_ENRICHMENT](LEAD_ENRICHMENT.md), [COMPLIANCE](COMPLIANCE.md),
> [DATA_MODEL](DATA_MODEL.md).

---

## 1. Vision

Build the dominant local home-services lead-gen brand for the **Wenatchee Valley**.
To homeowners we are the easiest, most trustworthy way to get matched with a vetted
local pro — free and no-obligation. To contractors we are the best source of
**high-intent, enriched, scored leads** in the valley.

We start with **electricians** (we already have a buyer), then expand trade-by-trade
on the same infrastructure and SEO footprint.

### Why this can win

- **Local SEO is winnable.** The Wenatchee Valley is a small, under-optimized market.
  A fast, well-structured, content-rich site can outrank thin contractor sites and
  national directories for long-tail local queries.
- **Enrichment is a real moat.** Most lead sellers hand over a name + phone. We hand
  over a *qualified, scored* lead with home value, ownership, and validated contact —
  worth multiples more to a contractor and far stickier.
- **Trade-agnostic = compounding.** Every city/SEO asset we build for electrical is
  reusable for the next trade. One audience, many monetization paths.

---

## 2. Business model

```
Homeowner  ──(free quote request)──►  Our site  ──(enrich + score)──►  Contractor buyer
                                          │                                  │
                                    capture lead                      pays per lead
```

- **Acquisition:** Organic local SEO (primary), then paid search/social as budget allows.
- **Conversion:** High-converting multi-step quote form with strong trust signals.
- **Product:** The *enriched, scored lead* is the product we sell.
- **Monetization (v1):** Sell electrical leads to one launch buyer at a discounted
  intro rate. Deliver in real time with full enrichment.
- **Monetization (later):** Multiple buyers per trade, lead routing/auction, exclusive
  vs. shared lead pricing, tiered pricing by lead grade, monthly minimums.

### Unit economics to track from day one
- Cost per lead (CPL) acquired (organic ≈ amortized content cost; paid = ad spend)
- Revenue per lead (RPL) and per *graded* lead (A/B/C)
- Enrichment cost per lead (API calls)
- Gross margin per lead = RPL − CPL − enrichment cost − delivery cost
- Buyer retention / repeat purchase

---

## 3. Brand & naming

- **Parent company:** Emerald Lead Co.
- **Consumer-facing site brand:** trade-agnostic + geo-anchored for SEO and expansion.

### Selected brand ✅
- **Site brand:** **Cascade Home Connect** — `cascadehomeconnect.com` (register + connect to Cloudflare).
- "Connect" reinforces our core positioning — the friendly middleman who *connects*
  homeowners with trusted local pros.
- Regional ("Cascades") and trade-agnostic — expandable beyond the Wenatchee Valley to
  other Cascade/Central-WA markets *and* beyond electrical, without a rebrand.

> **SEO implication:** because the domain doesn't contain "Wenatchee," the geo signal
> has to come from **on-page content and city pages**, not the domain. We lean harder on
> the service×city architecture, local content, and structured data (see SEO_STRATEGY).

Alternates considered (not chosen): Cascade Home Pros (`cascadehomepros.com` — taken),
Wenatchee Valley Pros, Apple Capital Pros, Emerald Valley Pros.

### Visual identity
- **Tone:** friendly, trustworthy, neighborly, fast. Not corporate, not spammy.
- **Color:** emerald green primary (ties to Emerald Lead Co.), warm neutral support,
  high-contrast CTA accent.
- **Type:** clean humanist sans (e.g., Inter / Plus Jakarta Sans).
- **Imagery:** real local/PNW feel; avoid obvious stock when possible.

---

## 4. What the website must do

### For homeowners (consumer side)
1. Instantly communicate: *free, fast, no-obligation, local, vetted pros.*
2. **Lead with the "same-day contact" promise** — "Get matched with a local pro who'll
   reach out **the same day**." Strong, specific trust signal and conversion driver.
   ⚠️ This is an advertised promise, so it's only safe if the buyer is **contractually
   committed** to same-day outreach — see COMPLIANCE §6 for the guardrail (and a fallback
   "next business day" line for leads that arrive late at night).
3. Make requesting a quote frictionless (multi-step form, mobile-first, click-to-call).
4. Build trust (how it works, transparency that we match you with providers).
5. Answer their questions (cost guides, service explainers) → SEO + trust.

### For contractors (buyer side)
1. A clear "For Contractors / Get Leads" page explaining lead quality + enrichment.
2. **Real-time email** on every new lead (their primary alert).
3. **Buyer portal** (login on the site) to view their delivered leads + enrichment and
   track status — built in Phase 3, not "eventually."

### For us (operator)
1. Capture every lead reliably with full attribution (UTM, source, page).
2. Enrich + score automatically in real time.
3. Deliver to buyer(s) instantly and log delivery + revenue.
4. Admin dashboard to monitor leads, quality, deliveries, and revenue.

---

## 5. Architecture overview

```
┌──────────────────────────────────────────────────────────────┐
│  Marketing site (Next.js, SSG/ISR)                            │
│  - Home, How it works, For contractors, About, Legal          │
│  - Service pages (panel upgrade, EV charger, repair, …)       │
│  - City pages (Wenatchee, East Wenatchee, Cashmere, …)        │
│  - Programmatic service×city pages + cost guides / blog       │
│  - Multi-step quote form  ─────────────┐                      │
└────────────────────────────────────────┼──────────────────────┘
                                          │ server action / API
                                          ▼
┌──────────────────────────────────────────────────────────────┐
│  Lead intake API                                              │
│  - validate, anti-spam (Turnstile + honeypot), dedupe         │
│  - persist raw lead → Supabase (leads)                        │
│  - enqueue enrichment                                         │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│  Enrichment worker (serverless / queue)                       │
│  - property data, ownership, value, demographics              │
│  - phone + email validation, line type                        │
│  - lead scoring (A/B/C)  → Supabase (lead_enrichment)         │
└───────────────┬──────────────────────────────────────────────┘
                ▼
┌──────────────────────────────────────────────────────────────┐
│  Delivery                                                     │
│  - real-time EMAIL notification to buyer on every new lead    │
│  - write delivery + price → Supabase (lead_deliveries)        │
└───────────────┬───────────────────────────┬──────────────────┘
                ▼                            ▼
┌───────────────────────────────┐  ┌───────────────────────────┐
│  Buyer portal (site login)    │  │  Admin dashboard          │
│  Next.js + Supabase Auth      │  │  Next.js + Supabase Auth  │
│  - buyer sees ONLY their      │  │  internal only            │
│    delivered leads + enrich   │  │  - all leads, enrichment, │
│    (RLS-scoped)               │  │    scores, deliveries,    │
│  - lead status / contact info │  │    revenue, buyers        │
└───────────────────────────────┘  └───────────────────────────┘
```

**Two authenticated surfaces, one auth system (Supabase Auth, role-based):**
- **Buyer portal** — contractors log in at the site and see only the leads delivered to
  them (enforced by Row Level Security), alongside the email notifications they get in
  real time. This is part of the buyer's core value and a retention hook.
- **Admin dashboard** — internal-only view of everything.

---

## 6. Tech stack & rationale

| Layer | Choice | Why |
| --- | --- | --- |
| Framework | **Next.js (App Router)** | One codebase for SSG SEO pages, dynamic forms, and the admin dashboard. Best-in-class SEO + DX. |
| Data / auth | **Supabase (Postgres)** | Managed Postgres, Row Level Security (scopes buyers to their own leads), Auth for **both admin + buyer portal**, edge functions, free tier. MCP connected. |
| Enrichment compute | **Serverless functions + queue** | Async, retryable enrichment. Supabase Edge Functions or Cloudflare Workers/Queues. |
| Hosting | **Cloudflare** ✅ | Selected. Pages/Workers + Turnstile + R2, all MCP-connected. Unifies site hosting, anti-bot, and enrichment workers on one platform. |
| Anti-bot | **Cloudflare Turnstile** | Free, privacy-friendly CAPTCHA for the form. |
| Analytics | **GA4 + server-side events** | Conversion tracking; add call tracking later. |
| Email | Resend / Postmark | Transactional lead delivery + notifications. |

> **Alternative considered:** Astro for the pure-content marketing site (excellent SEO,
> very fast). Rejected for v1 because we need integrated forms + an admin dashboard;
> Next.js does all three. Revisit if the content layer grows huge.
>
> **Cloudflare deployment note:** deploy Next.js via `@opennextjs/cloudflare` (OpenNext)
> on Workers, or run the marketing site as a static export on Pages with enrichment/intake
> as separate Workers. Decide the exact split in Phase 1 — both keep us fully on Cloudflare.

---

## 7. Lead enrichment (summary)

The buyer-side value driver. Full detail in [LEAD_ENRICHMENT.md](LEAD_ENRICHMENT.md).

Inputs we capture: name, address, phone, email, service type, project details, timeline,
budget signal, UTM/source.

We append:
- **Property:** assessed/estimated value, year built, sqft, lot, owner-occupied vs renter,
  estimated equity.
- **Person/area:** estimated household income (modeled), area demographics (Census ACS).
- **Contact quality:** phone line type (mobile/landline/VoIP), validity, email deliverability.
- **Intent/fraud:** timeline + budget from form, IP-to-address sanity, disposable-email
  and duplicate detection.

Output: a **lead score / grade (A/B/C)** plus a structured enrichment record delivered
with the lead. Homeowner status + property age are especially predictive for electrical
work (old homes → panel upgrades, rewiring).

---

## 8. SEO strategy (summary)

The growth engine. Full detail in [SEO_STRATEGY.md](SEO_STRATEGY.md).

- **Site architecture:** service pages × city pages, programmatically expanded, all
  internally linked, with cost guides and FAQ content for high-intent long-tail.
- **Target geography:** Wenatchee (hub) + East Wenatchee, Cashmere, Leavenworth, Chelan,
  Manson, Entiat, Malaga, Rock Island, Quincy, Wenatchee Valley region.
- **Technical:** fast LCP, mobile-first, clean URLs, sitemap/robots, canonicals,
  structured data (LocalBusiness/Service, FAQPage, BreadcrumbList).
- **E-E-A-T & trust:** transparent "how it works," real contact info, honest framing as a
  matching service, genuine reviews only.
- **Validate with Semrush** (MCP connected) for real volumes/difficulty before committing
  page priorities.

---

## 9. Compliance (summary)

Built in from day one — it protects the business *and* raises lead quality/buyer trust.
Full detail in [COMPLIANCE.md](COMPLIANCE.md).

- **TCPA express written consent** at the form (clear language that we share info with
  service providers who may call/text, including via autodialer; checkbox + timestamp +
  consent text stored with the lead).
- **Transparency:** "How it works" clearly states we are a free matching/referral service
  that connects homeowners with independent contractors and shares their request with them.
- **Privacy Policy + Terms** covering data collection, enrichment, and sharing with pros.
- **FCRA boundary:** enrichment data is for **marketing/matching only**, never for credit,
  insurance, employment, or housing eligibility decisions. Modeled income is labeled as
  *estimated*, never represented as verified.
- **Same-day contact claim:** only advertised because the buyer commits to it via the
  buyer agreement (SLA); otherwise it would be a deceptive claim. See COMPLIANCE §6.
- **Opt-out / DNC** handling and PII security.

---

## 10. Roadmap

### Phase 0 — Foundation (this) ✅
Planning docs, brand direction, stack decision, repo set up.

### Phase 1 — Marketing site MVP
- Next.js scaffold, design system, layout/nav/footer.
- Pages: Home, How it works, For contractors, About, Contact, Privacy, Terms.
- Electrical service pages (top 5–6 services) + top 3–4 city pages.
- Multi-step quote form → Supabase `leads` with consent capture + Turnstile + UTM.
- Analytics + basic conversion tracking. Sitemap, robots, schema, metadata.
- Deploy to staging.

### Phase 2 — Enrichment pipeline 🟢 (core shipped)
- ✅ Supabase project `cascade-home-connect` (btifsnnjuiwpbwvlzstc, us-west-1, free tier;
  no pausing needed — mory's site was already inactive). Schema + RLS applied per DATA_MODEL.
- ✅ Enrichment pipeline (free stack): dedupe, disposable-email + MX check (DoH),
  Census geocode → tract/county/lat-lng, ACS append (area median income + home value),
  scoring v1 (A/B/C), runs post-response via Cloudflare `waitUntil`.
- ⬜ Phase 2b: county-assessor property/ownership source (columns ready, source pending).
- ⬜ Live smoke test of external API calls post-deploy (sandbox egress blocked them locally).

### Phase 3 — Delivery + portals 🟢 (buyer side shipped)
- ✅ **Lead routing + delivery** (`src/lib/delivery.ts`): after scoring, matches the lead
  to eligible active buyers (trade/area/service/min-grade), records `lead_deliveries`
  (idempotent), applies intro-free pricing (first 5 leads free), advances status.
- ✅ **Real-time email** to the buyer on every new lead (`src/lib/email.ts`, Resend over
  HTTP; degrades gracefully without a key).
- ✅ **Buyer portal** (`/portal`, Supabase Auth + RLS): login, lead dashboard, lead detail
  with full contact + enrichment, outcome marking (contacted/quoted/won/lost). RLS
  isolation + buyer-scoped updates verified against the live DB.
- ⬜ **Admin dashboard** (internal): all leads, enrichment, scores, deliveries, revenue —
  still to build.
- ⬜ Buyer provisioning UI (for now, create buyers + invite logins via SQL/MCP).
- ⬜ Live login smoke test once a real buyer account exists.

### Phase 4 — SEO scale
- Programmatic service×city pages, cost guides, FAQ/blog content.
- Full structured data, internal linking, Google Business Profile (service-area),
  review collection, local citations/link building.

### Phase 5 — Expand
- Additional trades (plumbing, HVAC, roofing, …) on the same platform.
- Multiple buyers, lead routing/auction, billing/invoicing.
- **Enrichment upgrade** to a paid stack once the profit trigger is hit (see
  [LEAD_ENRICHMENT.md](LEAD_ENRICHMENT.md) §3 / §7).

---

## 11. KPIs

| Category | Metric |
| --- | --- |
| Acquisition | Organic sessions, keyword rankings, indexed pages, GBP views |
| Conversion | Form start rate, completion rate, leads/day, CPL |
| Quality | Enrichment match rate, % A/B/C grade, % homeowner, spam rate |
| Revenue | RPL, gross margin/lead, MRR, buyer retention |
| Delivery | Speed-to-deliver (sec), delivery success rate |

---

## 12. Decisions

### Resolved ✅
1. **Site brand + domain** — **Cascade Home Connect** (`cascadehomeconnect.com`).
2. **Hosting** — **Cloudflare** (Pages/Workers + Turnstile + R2).
3. **Enrichment budget** — **Free sources only for v1** (Census ACS + Chelan/Douglas County
   assessor records + free-tier validation). Upgrade to a paid stack once the profit
   trigger is hit (see below). See [LEAD_ENRICHMENT.md](LEAD_ENRICHMENT.md) §3.
4. **Buyer delivery** — **real-time email on every lead + a buyer login portal** on the site
   to view delivered leads + enrichment. (Built in Phase 3.)
5. **Reviews** — **none yet**; start without and collect genuine reviews over time. No
   fabricated reviews (compliance). Use the same-day-contact promise + transparency as the
   early trust signals instead.
6. **Same-day contact promise** — feature it in messaging; backed by the buyer's SLA
   commitment (COMPLIANCE §6).
7. **Enrichment upgrade trigger** — upgrade to paid enrichment once cumulative **profit ≥
   ~4× monthly run cost** (≈ **$200** against a ~$50/mo stack). Go-to-market tactic: give
   the launch buyer **5–10 free leads first** to prove value, then sell; ~10 paid leads
   should clear the trigger. Tracked in [LEAD_ENRICHMENT.md](LEAD_ENRICHMENT.md) §3.

### Operational notes
- **Domain:** register `cascadehomeconnect.com` and connect it to Cloudflare.
- **Supabase project limits:** if provisioning a new project requires pausing an existing
  one (free-tier active-project limit), **pause "mory's website"** — do not pause any other
  project. (Confirm the exact project name in the Supabase org before pausing.)

### Still open
- **Same-day SLA hours:** cutoff is **5:00 PM local** for now (leads after 5pm show the
  "next business day" wording). May change later.
