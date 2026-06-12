# Wenatchee Lead Logger

A local **lead-generation platform** for home-service businesses in the Wenatchee
Valley, Washington. Operated by **Emerald Lead Co.**

We position ourselves as a friendly neighborhood matchmaker: homeowners request a
free, no-obligation quote, and we connect them with a trusted local contractor.
Behind the scenes we **enrich** each lead with public-record data (home value,
ownership, demographics, contact validation) and **deliver** high-quality, scored
leads to contractors who buy them.

We launch with the **electrical trade** but the brand and platform are
**trade-agnostic** so we can expand to plumbing, HVAC, roofing, landscaping, and
more across the same service area.

**Site brand:** Cascade Home Connect (`cascadehomeconnect.com`).

---

## Status

🟢 **Phase 0 — Planning.** This repo currently contains the planning docs only.
Build begins in Phase 1 (see roadmap).

## Documentation

| Doc | Purpose |
| --- | --- |
| [`docs/PROJECT_PLAN.md`](docs/PROJECT_PLAN.md) | Master plan: vision, model, stack, architecture, roadmap, KPIs |
| [`docs/SEO_STRATEGY.md`](docs/SEO_STRATEGY.md) | Local SEO playbook, keyword targets, site architecture, content plan |
| [`docs/LEAD_ENRICHMENT.md`](docs/LEAD_ENRICHMENT.md) | Enrichment pipeline, data sources, lead scoring, fraud filtering |
| [`docs/COMPLIANCE.md`](docs/COMPLIANCE.md) | TCPA consent, privacy, FCRA boundaries, disclosures |
| [`docs/DATA_MODEL.md`](docs/DATA_MODEL.md) | Database schema and lead lifecycle |

## Proposed stack (see PROJECT_PLAN for rationale)

- **Frontend / site:** Next.js (App Router) — SSG/ISR for SEO, server actions for forms
- **Backend / data:** Supabase (Postgres + Auth + Storage); Auth powers both the internal
  admin dashboard and the buyer login portal (RLS-scoped to each buyer's leads)
- **Enrichment:** Cloudflare Workers calling free data sources (county assessor + Census ACS) in v1
- **Delivery:** real-time email to the buyer on every lead, plus the buyer portal
- **Hosting:** Cloudflare (Pages/Workers + Turnstile + R2)
- **Analytics:** GA4 + server-side conversion tracking + call tracking

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in when Supabase / Cloudflare are provisioned
npm run dev                  # http://localhost:3000
```

The quote form works without a backend — leads are validated and logged with a warning
until `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` are set, at which point they persist to
the `leads` table.

Scripts: `npm run build`, `npm run lint`, `npm run typecheck`.

## Project structure (Phase 1)

```
src/
  app/                  # routes (App Router)
    page.tsx            # home (hero + embedded quote form)
    how-it-works/  for-contractors/  about/  contact/
    services/  services/[service]/   # services hub + dynamic service pages
    locations/ locations/[city]/     # service-area hub + dynamic city pages
    get-quote/  thank-you/           # conversion flow
    privacy/  terms/                 # legal (compliance disclosures)
    sitemap.ts  robots.ts            # SEO
  components/           # Header, Footer, QuoteForm, sections, ui primitives, JsonLd
  content/              # services.ts, cities.ts (content-driven pages)
  lib/                  # site config, seo helpers, consent (TCPA), leads action, supabase
```

Content lives in `src/content` and brand/contact in `src/lib/site.ts`, so pages and a
future visual redesign stay decoupled from copy and structure.
