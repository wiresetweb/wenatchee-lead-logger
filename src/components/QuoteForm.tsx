"use client";

/**
 * Multi-step quote form — the core conversion surface.
 * Step 1: service + timeline · Step 2: project + address · Step 3: contact + consent.
 *
 * Captures UTM/landing attribution (client-side, no Suspense needed), shows the
 * same-day-vs-next-business-day promise, includes a honeypot, and submits via the
 * `submitLead` server action. See docs/COMPLIANCE.md and docs/DATA_MODEL.md.
 */

import { useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SERVICES } from "@/content/services";
import { submitLead, type LeadInput } from "@/lib/leads";
import { CONSENT_TEXT, sameDayContactLine } from "@/lib/consent";
import { Button } from "@/components/ui";

type Values = {
  serviceType: string;
  timeline: "asap" | "this_month" | "researching" | "";
  projectDetails: string;
  addressLine1: string;
  city: string;
  postalCode: string;
  fullName: string;
  phone: string;
  email: string;
  consent: boolean;
  company: string; // honeypot
};

const initial: Values = {
  serviceType: "",
  timeline: "",
  projectDetails: "",
  addressLine1: "",
  city: "",
  postalCode: "",
  fullName: "",
  phone: "",
  email: "",
  consent: false,
  company: "",
};

// Which step a given field lives on, so we can jump back to server-side errors.
const FIELD_STEP: Record<string, number> = {
  serviceType: 1,
  timeline: 1,
  projectDetails: 2,
  addressLine1: 2,
  city: 2,
  postalCode: 2,
  fullName: 3,
  phone: 3,
  email: 3,
  consent: 3,
};

export function QuoteForm({ defaultService = "" }: { defaultService?: string }) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [values, setValues] = useState<Values>({ ...initial, serviceType: defaultService });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Same-day promise depends on the current time, which can differ between server and
  // client. useSyncExternalStore renders "" on the server and the real line on the
  // client — no hydration mismatch, no setState-in-effect.
  const promise = useSyncExternalStore(
    () => () => {},
    () => sameDayContactLine(),
    () => "",
  );

  function set<K extends keyof Values>(key: K, val: Values[K]) {
    setValues((v) => ({ ...v, [key]: val }));
    setErrors((e) => {
      if (!e[key as string]) return e;
      const rest = { ...e };
      delete rest[key as string];
      return rest;
    });
  }

  /** Read UTM + landing attribution from the URL at submit time (client only). */
  function readAttribution(): Partial<LeadInput> {
    if (typeof window === "undefined") return {};
    const params = new URLSearchParams(window.location.search);
    return {
      utmSource: params.get("utm_source") ?? undefined,
      utmMedium: params.get("utm_medium") ?? undefined,
      utmCampaign: params.get("utm_campaign") ?? undefined,
      utmTerm: params.get("utm_term") ?? undefined,
      utmContent: params.get("utm_content") ?? undefined,
      landingPage: window.location.pathname + window.location.search,
    };
  }

  function validateStep(s: number): boolean {
    const e: Record<string, string> = {};
    if (s === 1 && !values.serviceType) e.serviceType = "Please choose a service.";
    if (s === 2 && values.city.trim().length < 2) e.city = "Please enter your city.";
    if (s === 3) {
      if (values.fullName.trim().length < 2) e.fullName = "Please enter your name.";
      if (values.phone.replace(/\D/g, "").length < 7) e.phone = "Enter a valid phone number.";
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(values.email)) e.email = "Enter a valid email.";
      if (!values.consent) e.consent = "Consent is required to continue.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(3, s + 1));
  }
  function back() {
    setStep((s) => Math.max(1, s - 1));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validateStep(3)) return;
    setSubmitting(true);
    try {
      const result = await submitLead({
        serviceType: values.serviceType,
        trade: "electrical",
        projectDetails: values.projectDetails,
        timeline: values.timeline || undefined,
        fullName: values.fullName,
        phone: values.phone,
        email: values.email,
        addressLine1: values.addressLine1,
        city: values.city,
        postalCode: values.postalCode,
        consent: values.consent as true,
        company: values.company,
        ...readAttribution(),
      });
      if (result.ok) {
        router.push("/thank-you");
        return;
      }
      if (result.errors) {
        setErrors(result.errors);
        const firstField = Object.keys(result.errors)[0];
        if (firstField && FIELD_STEP[firstField]) setStep(FIELD_STEP[firstField]);
      } else if (result.message) {
        setErrors({ form: result.message });
      }
    } catch {
      setErrors({ form: "Something went wrong. Please try again or call us." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-md sm:p-8">
      {/* Progress */}
      <div className="mb-6 flex items-center gap-2" aria-hidden>
        {[1, 2, 3].map((s) => (
          <div
            key={s}
            className={`h-1.5 flex-1 rounded-full ${s <= step ? "bg-brand-600" : "bg-ink-200"}`}
          />
        ))}
      </div>
      <p className="mb-1 text-sm font-medium text-brand-700">Step {step} of 3</p>

      <form onSubmit={onSubmit} noValidate>
        {/* Honeypot: visually hidden, off-screen, not announced. */}
        <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              value={values.company}
              onChange={(e) => set("company", e.target.value)}
            />
          </label>
        </div>

        {step === 1 && (
          <fieldset>
            <legend className="font-display text-xl font-bold text-ink-900">
              What do you need help with?
            </legend>
            <div className="mt-4 space-y-4">
              <Field label="Service" error={errors.serviceType}>
                <select
                  className="form-input"
                  value={values.serviceType}
                  onChange={(e) => set("serviceType", e.target.value)}
                >
                  <option value="">Choose a service…</option>
                  {SERVICES.map((s) => (
                    <option key={s.slug} value={s.formLabel}>
                      {s.formLabel}
                    </option>
                  ))}
                  <option value="Other electrical work">Other electrical work</option>
                </select>
              </Field>
              <Field label="When do you need it done?" error={errors.timeline}>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { v: "asap", l: "As soon as possible" },
                    { v: "this_month", l: "Within a month" },
                    { v: "researching", l: "Just researching" },
                  ].map((opt) => (
                    <button
                      type="button"
                      key={opt.v}
                      onClick={() => set("timeline", opt.v as Values["timeline"])}
                      className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors ${
                        values.timeline === opt.v
                          ? "border-brand-600 bg-brand-50 text-brand-700"
                          : "border-ink-200 text-ink-700 hover:border-brand-300"
                      }`}
                    >
                      {opt.l}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="font-display text-xl font-bold text-ink-900">
              Tell us about the project
            </legend>
            <div className="mt-4 space-y-4">
              <Field label="Project details (optional)" error={errors.projectDetails}>
                <textarea
                  className="form-input"
                  rows={3}
                  placeholder="e.g. Panel keeps tripping; want to add an EV charger."
                  value={values.projectDetails}
                  onChange={(e) => set("projectDetails", e.target.value)}
                />
              </Field>
              <Field label="Street address (optional)" error={errors.addressLine1}>
                <input
                  className="form-input"
                  autoComplete="address-line1"
                  value={values.addressLine1}
                  onChange={(e) => set("addressLine1", e.target.value)}
                />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="City" error={errors.city}>
                  <input
                    className="form-input"
                    autoComplete="address-level2"
                    value={values.city}
                    onChange={(e) => set("city", e.target.value)}
                  />
                </Field>
                <Field label="ZIP" error={errors.postalCode}>
                  <input
                    className="form-input"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={values.postalCode}
                    onChange={(e) => set("postalCode", e.target.value)}
                  />
                </Field>
              </div>
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="font-display text-xl font-bold text-ink-900">
              Where should your free quote go?
            </legend>
            <div className="mt-4 space-y-4">
              <Field label="Full name" error={errors.fullName}>
                <input
                  className="form-input"
                  autoComplete="name"
                  value={values.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                />
              </Field>
              <Field label="Phone" error={errors.phone}>
                <input
                  className="form-input"
                  type="tel"
                  autoComplete="tel"
                  value={values.phone}
                  onChange={(e) => set("phone", e.target.value)}
                />
              </Field>
              <Field label="Email" error={errors.email}>
                <input
                  className="form-input"
                  type="email"
                  autoComplete="email"
                  value={values.email}
                  onChange={(e) => set("email", e.target.value)}
                />
              </Field>

              <label className="flex items-start gap-3 rounded-lg bg-ink-50 p-3 text-xs leading-relaxed text-ink-600">
                <input
                  type="checkbox"
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-ink-300 text-brand-600 focus:ring-brand-600"
                  checked={values.consent}
                  onChange={(e) => set("consent", e.target.checked)}
                />
                <span>
                  {CONSENT_TEXT.replace(
                    "See the Privacy Policy and Terms.",
                    "",
                  )}
                  See our{" "}
                  <Link href="/privacy" className="font-medium text-brand-700 underline">
                    Privacy Policy
                  </Link>{" "}
                  and{" "}
                  <Link href="/terms" className="font-medium text-brand-700 underline">
                    Terms
                  </Link>
                  .
                </span>
              </label>
              {errors.consent && <p className="text-sm text-red-600">{errors.consent}</p>}
            </div>
          </fieldset>
        )}

        {errors.form && (
          <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{errors.form}</p>
        )}

        <div className="mt-6 flex items-center justify-between gap-3">
          {step > 1 ? (
            <Button type="button" variant="ghost" onClick={back}>
              ← Back
            </Button>
          ) : (
            <span />
          )}
          {step < 3 ? (
            <Button type="button" size="lg" onClick={next}>
              Continue →
            </Button>
          ) : (
            <Button type="submit" size="lg" disabled={submitting}>
              {submitting ? "Sending…" : "Get my free quote"}
            </Button>
          )}
        </div>

        {promise && (
          <p className="mt-4 text-center text-sm font-medium text-brand-700">{promise}</p>
        )}
      </form>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-ink-800">{label}</span>
      {children}
      {error && <span className="mt-1 block text-sm text-red-600">{error}</span>}
    </label>
  );
}
