# Data Model & Lead Lifecycle

> Postgres (Supabase) schema for leads, enrichment, buyers, and delivery.
> Companion to [PROJECT_PLAN.md](PROJECT_PLAN.md) and [LEAD_ENRICHMENT.md](LEAD_ENRICHMENT.md).
> This is the design target for Phase 2 — not yet applied.

---

## 1. Lead lifecycle

```
new ──► validated ──► enriched ──► scored ──► delivered ──► (sold / closed)
   └─► rejected (spam/fraud/duplicate)        └─► undeliverable
```

Each transition is timestamped. `status` on `leads` tracks the current state.

---

## 2. Tables

### `leads` — one row per quote request
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| created_at | timestamptz | |
| status | text | new / validated / enriched / scored / delivered / rejected |
| trade | text | `electrical` for launch; future-proofs multi-trade |
| service_type | text | e.g. panel_upgrade, ev_charger, repair |
| project_details | text | free text from form |
| timeline | text | asap / this_month / researching |
| budget_band | text | optional stated budget |
| full_name | text | |
| phone | text | E.164 normalized |
| email | text | |
| address_line1 | text | |
| city | text | |
| state | text | default `WA` |
| postal_code | text | |
| lat / lng | numeric | geocoded |
| county | text | chelan / douglas |
| **consent_text** | text | exact TCPA consent shown (compliance) |
| **consent_at** | timestamptz | when consent given |
| ip | inet | captured at submit |
| user_agent | text | |
| utm_source / utm_medium / utm_campaign / utm_term / utm_content | text | attribution |
| landing_page | text | first page / referrer |
| created_via | text | form id / variant |

### `lead_enrichment` — one row per lead (1:1)
| Column | Type | Notes |
| --- | --- | --- |
| lead_id | uuid FK → leads | unique |
| enriched_at | timestamptz | |
| owner_occupied | boolean | homeowner vs renter (key signal) |
| property_value | numeric | estimated/assessed |
| year_built | int | drives age-based need flag |
| sqft | int | |
| lot_size | numeric | |
| equity_estimate | numeric | value − modeled mortgage |
| est_household_income | numeric | **modeled — label "estimated"** |
| area_median_income | numeric | Census ACS (area-level) |
| phone_line_type | text | mobile / landline / voip |
| phone_valid | boolean | |
| phone_carrier | text | |
| email_valid | boolean | |
| email_disposable | boolean | fraud signal |
| need_flags | jsonb | e.g. ["pre_1980_wiring","panel_upgrade_candidate"] |
| fraud_flags | jsonb | duplicate / ip_mismatch / disposable |
| **lead_score** | int | 0–100 |
| **lead_grade** | text | A / B / C / reject |
| raw | jsonb | raw provider responses (audit + re-scoring) |
| provider_costs | jsonb | per-source cost for margin tracking |

### `buyers` — contractors who purchase leads
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| name | text | |
| trade | text | electrical (launch) |
| contact_name / contact_email / contact_phone | text | |
| service_areas | text[] | cities/zips they cover |
| service_types | text[] | services they want |
| min_grade | text | lowest grade they accept |
| price_per_lead | numeric | intro/discount rate for launch buyer |
| delivery_method | text | email / webhook / csv |
| delivery_target | text | email addr or webhook URL |
| active | boolean | |
| created_at | timestamptz | |

### `lead_deliveries` — record of each lead sent to a buyer
| Column | Type | Notes |
| --- | --- | --- |
| id | uuid PK | |
| lead_id | uuid FK → leads | |
| buyer_id | uuid FK → buyers | |
| delivered_at | timestamptz | |
| price | numeric | what we charged for this lead |
| method | text | email / webhook / csv |
| status | text | sent / failed / accepted / rejected / refunded |
| response | jsonb | webhook response / notes |
| outcome | text | (later) contacted / quoted / won / lost — closed-loop scoring |

### Optional config tables (Phase 4, for programmatic pages)
- `services` (slug, trade, name, description, avg_cost_low/high)
- `cities` (slug, name, county, population, lat/lng)

---

## 3. Routing logic (v1 → later)

- **v1 (one buyer):** every electrical lead at/above the buyer's `min_grade` and in their
  `service_areas` is delivered to the launch buyer; log to `lead_deliveries` with the
  intro price.
- **Later (multi-buyer):** match lead → eligible buyers by trade/area/service/grade, then
  route by priority/round-robin/auction. Support exclusive (one buyer) vs. shared (N buyers)
  pricing.

---

## 4. Security

- **Row Level Security** on all tables; the public site writes only to `leads` (and only via
  a server action / service role, never anon-key client writes of PII).
- Admin dashboard reads via authenticated Supabase Auth (internal users only).
- Enrichment worker uses a service-role key, server-side only.
- See [COMPLIANCE.md](COMPLIANCE.md) §5 for the full data-security posture.
