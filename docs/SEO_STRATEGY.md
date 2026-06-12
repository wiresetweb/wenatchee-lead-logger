# SEO Strategy — Local Domination Playbook

> Goal: rank first for high-intent home-services searches in the Wenatchee Valley,
> starting with electrical. Companion to [PROJECT_PLAN.md](PROJECT_PLAN.md).
>
> ⚠️ **Validate volumes/difficulty with a keyword tool before finalizing priorities.**
> (Semrush MCP is *not* in the current plan — use Google Keyword Planner, the Semrush
> web UI, or Ahrefs to confirm the estimates below. Numbers here are informed estimates,
> not measured.)

---

## 1. The local SEO thesis

Wenatchee is a small metro (~35k city, ~120k valley). Most local contractor sites are
thin, slow, and rarely optimized; national directories (Angi, Thumbtack, Yelp) rank but
convert poorly and feel impersonal. A **fast, content-rich, tightly-structured local
site** can win the long tail of "service + city" and "cost/how-to" queries that carry
the highest commercial intent.

Three pillars:
1. **Architecture** — a clean service × city matrix, fully internally linked.
2. **Content** — cost guides, FAQs, and explainers that match real searcher intent.
3. **Trust/technical** — fast, mobile-first, structured data, genuine E-E-A-T.

> **Brand note:** the domain is `cascadehomeconnect.com` (no city in it), so **all geo signal
> must come from on-page content, city pages, titles/metadata, and structured data** — the
> service×city architecture below does that heavy lifting.

---

## 2. Service area (geo targets)

**Hub:** Wenatchee. **Spokes:** East Wenatchee, Cashmere, Leavenworth, Chelan, Manson,
Entiat, Malaga, Rock Island, Quincy, Wenatchee Valley (region term). Counties: Chelan,
Douglas.

Each spoke gets a city page once the hub pages are solid. Prioritize by population +
search volume: Wenatchee → East Wenatchee → Cashmere → Leavenworth → Chelan → rest.

---

## 3. Keyword map (electrical launch)

> Buckets by intent. **Validate volume/difficulty before building.**

### Core "near me" / city head terms (high intent, moderate volume)
- electrician wenatchee / electrician near me / electrician east wenatchee
- electrical contractor wenatchee / wenatchee electrician
- emergency electrician wenatchee / 24 hour electrician

### Service terms (commercial — map to service pages)
- electrical panel upgrade / 200 amp panel upgrade / breaker box replacement
- EV charger installation (Tesla / level 2 charger installation)
- generator installation (standby / whole-home generator)
- electrical repair / troubleshooting / outlet repair
- house rewiring / knob and tube replacement / aluminum wiring
- lighting installation / recessed lighting / ceiling fan installation
- hot tub & spa wiring / pool wiring
- EV / solar-adjacent electrical, subpanels, surge protection

### Cost-intent (high-converting long tail — map to cost guides)
- electrician cost wenatchee / electrician hourly rate
- cost to upgrade electrical panel / 200 amp panel cost
- cost to install EV charger / level 2 charger installation cost
- cost to rewire a house / whole house rewire cost
- generator installation cost

### Informational / FAQ (top-of-funnel + schema FAQ)
- do I need a permit for electrical work in washington (L&I permits)
- signs you need an electrical panel upgrade
- how to choose a licensed electrician
- is knob and tube wiring dangerous
- how many amps does my home need

> **Lead magnet insight:** "cost" queries convert best for lead gen — the searcher is
> mid-decision. Prioritize cost guides early; each should end with a quote-request CTA.

---

## 4. Site architecture & URL scheme

```
/                                  Home
/how-it-works
/for-contractors                   (buyer-side landing)
/about
/contact
/privacy   /terms

/services/                         Services hub
/services/electrical-panel-upgrade
/services/ev-charger-installation
/services/electrical-repair
/services/generator-installation
/services/house-rewiring
/services/lighting-installation

/locations/                        Locations hub
/locations/wenatchee
/locations/east-wenatchee
/locations/cashmere
/locations/leavenworth
/locations/chelan

/electrician/{city}                Programmatic service×city (Phase 4)
  e.g. /electrician/wenatchee, /electrician/east-wenatchee

/guides/                           Cost guides & how-tos
/guides/electrical-panel-upgrade-cost-wenatchee
/guides/ev-charger-installation-cost
/guides/cost-to-rewire-a-house
```

**Internal linking:** every service page links to relevant city pages and cost guides;
every city page links to all services; guides link to the matching service + quote form.
Build a deliberate hub-and-spoke link graph — it's the single biggest on-site ranking lever.

> When we expand trades, the pattern repeats: `/{trade}/{city}` and `/services/{trade}/...`.
> Keep the brand trade-agnostic so this scales cleanly.

---

## 5. On-page template (every money page)

- **Title:** `{Service} in {City}, WA | Free Quotes from Local Pros`
- **H1:** matches intent, includes service + city.
- **Above the fold:** value prop + quote-form CTA (or embedded short form) + click-to-call.
- **Body:** what's involved, local context, cost range (link to guide), why use us, trust.
- **FAQ block:** 4–8 Q&As with `FAQPage` schema.
- **Internal links:** related services, nearby cities, relevant guide.
- **CTA repeats:** top, mid, bottom + sticky mobile bar.

---

## 6. Technical SEO checklist

- [ ] Core Web Vitals green (LCP < 2.5s, INP < 200ms, CLS < 0.1) — SSG/static where possible
- [ ] Mobile-first, accessible (most local searches are mobile)
- [ ] Clean canonical URLs, no duplicate/thin pages, proper canonicals
- [ ] `sitemap.xml` + `robots.txt`, auto-generated
- [ ] Structured data: `LocalBusiness`/`Service`, `FAQPage`, `BreadcrumbList`, `Organization`
- [ ] Open Graph / Twitter cards for shares
- [ ] Descriptive `<title>`/meta per page, no duplicates
- [ ] Image alt text, lazy loading, modern formats (AVIF/WebP)
- [ ] HTTPS, fast TTFB (edge hosting)
- [ ] Analytics + Search Console verified; submit sitemap

---

## 7. Off-site & local presence

- **Google Business Profile** (service-area business). Note: GBP requires a real business
  entity and policy compliance; as a lead-gen/referral service we present honestly as a
  matching service. Verify eligibility before relying on map-pack rankings.
- **Local citations / NAP consistency** (consistent Name/Address/Phone across directories).
- **Reviews:** collect genuine reviews over time. **Never fabricate** (compliance + risk).
- **Backlinks:** local partnerships, chamber of commerce, local press, genuinely useful
  guides that earn links. Quality > quantity.

---

## 8. Content production plan

| Priority | Asset | Type |
| --- | --- | --- |
| P0 | Home, How it works, For contractors | Conversion |
| P0 | Top 5 electrical service pages | Money |
| P0 | Wenatchee + East Wenatchee city pages | Money |
| P1 | Panel upgrade / EV charger / rewire **cost guides** | High-intent SEO |
| P1 | Remaining city pages (Cashmere, Leavenworth, Chelan) | Money |
| P2 | FAQ/informational articles (permits, signs you need X) | Top-funnel |
| P2 | Programmatic `/electrician/{city}` pages | Scale |

> Each money page and guide ends with a quote-request CTA. Cost guides are the highest-ROI
> content for lead gen — build them early.

---

## 9. Measurement

Search Console (queries, impressions, CTR, position), GA4 (organic sessions → form
completions), rank tracking for the core keyword set, and indexed-page count. Review
monthly; double down on pages gaining impressions but low CTR (improve titles) and pages
ranking 5–15 (improve content/links to push to page 1).
