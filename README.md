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
- **Backend / data:** Supabase (Postgres + Auth + Storage)
- **Enrichment:** serverless functions calling property / contact / demographic APIs
- **Hosting:** Cloudflare or Vercel
- **Analytics:** GA4 + server-side conversion tracking + call tracking

## Quick start

> Not yet scaffolded. Phase 1 will add the Next.js app, env setup, and run scripts.
