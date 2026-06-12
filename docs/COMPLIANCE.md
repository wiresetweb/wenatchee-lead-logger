# Compliance & Trust

> Building consent, privacy, and honest disclosure in from day one. This protects the
> business, keeps buyers safe, and *raises* lead quality (consented, transparent leads
> convert better and churn less). Companion to [PROJECT_PLAN.md](PROJECT_PLAN.md).
>
> ⚠️ **Not legal advice.** Before launch, have a qualified attorney review consent
> language, the privacy policy, terms, and the lead-sharing model. The notes below are
> the practical guardrails to design around.

---

## 1. The model, stated honestly

We are a **free matching/referral service**: homeowners submit a request for a quote, and
we connect them with independent local contractors who may contact them. We are **not** the
contractor and don't perform the work. We share the homeowner's request (and enrichment)
with one or more service providers. The site copy must make this clear — "friendly
neighborhood middleman" framing is fine, but the *how-it-works* page must not mislead the
visitor about what happens to their information.

Why this matters: deceptive lead-gen practices draw FTC/state-AG attention. Honest framing
is both lower-risk and better for trust/conversion.

---

## 2. TCPA — consent to contact (critical)

Because contractors (or we) may **call or text** leads, possibly with autodialers/prerecorded
messages, we need **prior express written consent**.

Requirements to bake into the quote form:
- A clear consent statement near the submit button, e.g.:
  > "By submitting, I agree that Emerald Lead Co. and the service provider(s) it connects me
  > with may call and text me (including via automated technology and prerecorded messages)
  > at the number provided about my request, even if it's on a Do-Not-Call list. Consent is
  > not a condition of purchase. Message/data rates may apply. See our Privacy Policy and Terms."
- **Store the exact consent text, timestamp, IP, and page URL** with every lead
  (see DATA_MODEL `leads.consent_text`, `consent_at`, `ip`). This is the proof if challenged.
- Provide clear **opt-out** (STOP for texts, unsubscribe).
- Maintain an internal **Do-Not-Call / suppression list** and honor it.

> **Regulatory note:** the FCC's "one-to-one consent" rule (which would have required
> separate consent per identified seller) was vacated by the courts in early 2025, so the
> prior TCPA consent standard applies — but **clearly identifying who may contact the
> consumer remains best practice** and lowers risk. Re-confirm the current rule at build
> time, as this area changes.

---

## 3. Privacy

- **Privacy Policy** must disclose: what we collect (contact + project info, plus
  automatically collected analytics/IP/UTM), that we **enrich** data from third-party/public
  sources, that we **share** the request and enrichment with service providers/buyers, how
  long we retain it, and how to request access/deletion.
- **Terms of Service** for site use and the nature of the referral relationship.
- Cookie/analytics disclosure (GA4). Add a consent banner if/when serving relevant regions.
- **State law:** Washington has no general CCPA-style consumer privacy statute as of this
  writing (the "My Health My Data Act" covers *health* data — keep electrical/home data out
  of that scope). Still, follow privacy best practices; we may serve or expand to regulated
  states later. Re-check WA law at launch.

---

## 4. FCRA — the enrichment boundary (important)

Enrichment data (property value, modeled income, demographics) is used **only for marketing
and matching** — connecting a homeowner with a contractor. It must **never** be used, or
sold for use, to make decisions about a consumer's eligibility for **credit, insurance,
employment, or housing**. Doing so would turn our data into a "consumer report" and trigger
the Fair Credit Reporting Act (FCRA), with serious obligations and liability.

Guardrails:
- Buyer agreements state leads/enrichment are for **marketing/solicitation only**, not for
  FCRA-regulated eligibility decisions.
- **Modeled/estimated income is labeled "estimated"** everywhere — never presented as
  verified income. (It's statistically modeled, not a credit pull.)
- Don't append or sell data from sources whose terms prohibit resale or restrict to FCRA use.
- Vet each data vendor's ToS for resale/marketing-use permissions before integrating.

---

## 5. Data security

- PII (name, address, phone, email, enrichment) stored in Postgres with **Row Level
  Security**; admin dashboard behind auth; least-privilege keys.
- Enrichment **vendor API keys server-side only** — never in client code.
- Encrypt in transit (HTTPS) and at rest (managed by Supabase).
- Limit retention to what's needed; define a retention/deletion policy.
- Log access to lead data in the admin tooling.

---

## 6. Reviews & claims

- **No fabricated reviews, testimonials, or "as seen on" badges.** FTC actively pursues
  fake reviews (and the 2024 rule allows civil penalties). Collect genuine reviews over time.
- Don't claim contractors are "licensed/insured/vetted" unless we actually verify it — if we
  advertise vetting, we must do the vetting and keep records.
- Don't imply we *are* the contractor or guarantee work quality we don't control.

---

## 7. Pre-launch compliance checklist

- [ ] Attorney review of consent language, Privacy Policy, Terms, buyer agreement
- [ ] TCPA consent text on form; consent text + timestamp + IP stored per lead
- [ ] Opt-out / STOP handling + internal suppression list
- [ ] Honest "how it works" disclosure of the referral + data-sharing model
- [ ] Privacy Policy + Terms published and linked in footer + on the form
- [ ] Enrichment labeled "estimated"; marketing-use-only buyer terms (FCRA boundary)
- [ ] Data vendor ToS checked for resale/marketing-use rights
- [ ] RLS + server-side keys + HTTPS; retention policy defined
- [ ] No fabricated reviews; verify any "vetted/licensed" claims we make
