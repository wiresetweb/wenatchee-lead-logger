# Lead Enrichment — The Buyer-Side Moat

> How we turn a raw quote request into a qualified, scored, contractor-ready lead.
> Companion to [PROJECT_PLAN.md](PROJECT_PLAN.md) and [DATA_MODEL.md](DATA_MODEL.md).

---

## 1. Why enrichment is the moat

A typical lead seller hands a contractor a name and a phone number. Half are renters,
wrong numbers, or tire-kickers. We instead deliver a lead that answers the questions a
contractor actually cares about **before they pick up the phone**:

- Do they **own** the home? (Renters rarely buy major electrical work.)
- Is the home **valuable / high-equity**? (Ability to pay, bigger jobs.)
- Is the home **old**? (Old wiring → panel upgrades, rewires — high-ticket electrical.)
- Is the **contact reachable**? (Valid mobile beats a dead landline or VoIP spam number.)
- How **urgent / serious** is the project? (Timeline + budget from the form.)

That context can multiply a lead's value and dramatically improves contractor ROI, which
is what makes buyers stick and pay more.

---

## 2. Enrichment pipeline

```
raw lead ─► validate & normalize ─► anti-fraud checks ─► append data ─► score ─► store ─► deliver
```

1. **Validate & normalize**
   - USPS-style address standardization; geocode to lat/lng + county.
   - Normalize phone (E.164) and email (lowercase, parse domain).
2. **Anti-fraud / quality gates** (cheap, run first — fail fast)
   - Honeypot field + Cloudflare Turnstile (bot filter at the form).
   - Disposable/role email detection; syntax + MX/deliverability check.
   - Duplicate detection (same phone/email/address in last N days).
   - IP geolocation sanity vs. claimed city (soft signal, not a hard block).
3. **Append data** (parallel API calls — see §3)
   - Property: value, year built, sqft, lot, owner-occupied, equity estimate.
   - Contact: phone line type + carrier + validity; email deliverability.
   - Area/person: modeled household income, Census ACS area demographics.
4. **Score** → A/B/C grade (see §4).
5. **Store** enrichment record (raw JSON + normalized fields) in `lead_enrichment`.
6. **Deliver** enriched lead to buyer in real time (speed-to-lead matters enormously).

> Run enrichment **before delivery** so the buyer receives the enriched record instantly.
> Keep raw API responses for auditing and future re-scoring.

---

## 3. Data sources

> Pick a lean v1 set within budget (see PROJECT_PLAN §12). Costs are per-lookup ballparks
> and change — confirm current pricing. Don't over-build before there's lead volume.

### Property & ownership (highest value for contractors)
| Source | Provides | Notes |
| --- | --- | --- |
| **ATTOM Data / Estated** | Value, year built, sqft, owner-occupied, equity | Solid coverage, developer-friendly API. Good v1 default. |
| **Melissa (Property + Personator)** | Property + identity + demographics in one | Convenient bundle; pay-per-record. |
| **Regrid** | Parcel boundaries + basic attributes | Good for mapping/parcel detail. |
| **County assessor (Chelan / Douglas)** | Authoritative assessed value, owner | Free public record; scraping/manual; good ground truth. |
| CoreLogic | Premium property data | Enterprise pricing; later. |

### Contact validation
| Source | Provides |
| --- | --- |
| **Twilio Lookup** | Phone line type (mobile/landline/VoIP), carrier, caller name |
| **NeverBounce / ZeroBounce** | Email deliverability/validity |

### Person / demographics
| Source | Provides | Notes |
| --- | --- | --- |
| **Census ACS** | Area income, home value, demographics by tract | **Free**, great baseline. |
| **PeopleDataLabs / FullContact** | Person enrichment, additional contacts | Optional; check ToS + compliance. |
| Experian / Acxiom / Melissa | Modeled household income append | "Estimated" only — never represent as verified (see COMPLIANCE). |

> **Income reality check:** true individual income is **not** a public record. What's
> available is *modeled/estimated* household income (demographic append) or area-level
> income (Census). Always label it **estimated** to buyers. This is both honest and
> legally important (see COMPLIANCE — FCRA).

---

## 4. Lead scoring (v1 model)

A transparent, rule-based score (upgrade to ML once we have outcome data). Produce a 0–100
score → grade:

| Signal | Weight | Logic (example) |
| --- | --- | --- |
| Homeowner (owner-occupied) | high | +30 owner, 0 renter/unknown |
| Property value / equity | high | scaled; higher value → more points |
| Property age (electrical) | med | older home → more likely high-ticket work |
| Contact quality | high | valid mobile +20, landline +10, VoIP/invalid −10 |
| Project urgency (timeline) | med | "ASAP/emergency" > "this month" > "researching" |
| Budget signal | med | higher stated budget → more points |
| Service type value | med | panel upgrade/rewire/EV > small repair |
| Fraud flags | gate | disposable email / dup / bot → cap at C or reject |

**Grades:** A = 75–100 (prime), B = 50–74 (solid), C = 25–49 (marginal), reject < 25 or
hard fraud flag. Grades let us tier pricing and let buyers prioritize.

> Weights are starting guesses. **Recalibrate against real buyer feedback** (which leads
> closed) as soon as we have it — closed-loop scoring is the long-term advantage.

---

## 5. Enrichment improvements / ideas (roadmap)

Beyond the basics, ranked by value-for-effort:

1. **Homeowner filter as a headline feature** — owner-occupied is the single most
   predictive field for home-services close rate. Surface it prominently; price renter
   leads lower or suppress them.
2. **Property-age → predicted need flag** — homes built before ~1980 flag likely panel/
   wiring upgrades; pre-1960 flag knob-and-tube risk. A literal upsell hint for the buyer.
3. **Equity / "ability to pay" estimate** — value minus modeled mortgage → financing-
   candidate flag for big jobs.
4. **Speed-to-lead delivery** — enrich + deliver within seconds; contacting a lead in <5
   min vs. 30 min hugely changes contact/close rates. This is a feature buyers will pay for.
5. **Skip-trace for additional contacts** — append secondary phone/email + best-time-to-
   call to raise contact rate (directly lifts buyer ROI). Mind compliance/ToS.
6. **Phone intelligence** — flag VoIP/prepaid (fraud/low-quality), confirm mobile for SMS.
7. **Fraud/duplicate suppression** — protects buyer trust; a few bad leads churn a buyer.
8. **Solar/EV/remodel propensity** — model likely adjacent projects for cross-sell.
9. **Project sizing hints** — sqft + service type → rough job-size band for the estimator.
10. **Closed-loop outcome tracking** — capture which delivered leads closed; feed back into
    scoring. This is the compounding moat — nobody else in this market will have it.

---

## 6. Implementation notes

- Run enrichment as an **async, retryable worker** (queue) so a slow/failed API never
  blocks lead capture. Capture the lead first, enrich immediately after.
- **Cache** property lookups by address; **dedupe** API calls to control cost.
- Store **raw provider JSON** alongside normalized fields for audit + re-scoring.
- Add **per-provider cost logging** so margin per lead is always visible.
- Gracefully degrade: if a provider is down, deliver with partial enrichment + a flag,
  never drop the lead.
- Keep enrichment vendor keys server-side only; never expose in the client.
