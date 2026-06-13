/**
 * Reusable marketing sections composed from the UI primitives. Server components.
 */
import Link from "next/link";
import { SERVICES, type Service } from "@/content/services";
import { CITIES, type City } from "@/content/cities";
import { ButtonLink, Container, H2, Lead, Section } from "@/components/ui";
import { Photo } from "@/components/Photo";

/* ---------------------------------- icons ---------------------------------- */

function Icon({ d, className = "" }: { d: string; className?: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={className}
    >
      <path d={d} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const ICON_PATHS: Record<string, string> = {
  // bolt — panel upgrades
  "electrical-panel-upgrade": "M13 2L4.5 13.5h6L9.5 22 19 10h-6l1-8z",
  // plug — EV charger
  "ev-charger-installation": "M9 2v6m6-6v6M7 8h10v4a5 5 0 01-10 0V8zm5 9v5",
  // wrench — repair
  "electrical-repair":
    "M14.7 6.3a4.5 4.5 0 00-6 5.6L3 17.6V21h3.4l5.7-5.7a4.5 4.5 0 005.6-6L14.5 12 12 9.5l2.7-3.2z",
  // power circle — generator
  "generator-installation": "M12 2v8m5.66-5.66a8 8 0 11-11.32 0",
  // cable — rewiring
  "house-rewiring": "M4 18c4-8 6 8 10 0s2-10 6-6M4 6h3m10 12h3",
  // bulb — lighting
  "lighting-installation": "M9 18h6m-5 3h4m-2-19a7 7 0 014 12.7c-.6.5-1 1.4-1 2.3h-6c0-.9-.4-1.8-1-2.3A7 7 0 0112 2z",
};

const CHECK = "M20 6L9 17l-5-5";

/* -------------------------------- trust bar -------------------------------- */

export function TrustBar() {
  const items = [
    { icon: CHECK, label: "Free for homeowners, forever" },
    { icon: CHECK, label: "Local pros only — no call centers" },
    { icon: CHECK, label: "Same-day callback" },
    { icon: CHECK, label: "Zero pressure, zero spam" },
  ];
  return (
    <div className="border-y border-ink-200 bg-ink-50">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-sm font-medium text-ink-700">
        {items.map((i) => (
          <span key={i.label} className="inline-flex items-center gap-2">
            <Icon d={i.icon} className="h-4 w-4 text-brand-600" /> {i.label}
          </span>
        ))}
      </Container>
    </div>
  );
}

/* ------------------------------- how it works ------------------------------ */

export function HowItWorksSteps() {
  const steps = [
    {
      n: 1,
      title: "Tell us what's up",
      body: "Flickering lights? Dreaming of an EV charger? Answer a few quick taps — under a minute, promise.",
    },
    {
      n: 2,
      title: "We play matchmaker",
      body: "We hand your request to a trusted local pro who does your kind of work and actually covers your neighborhood.",
    },
    {
      n: 3,
      title: "Your pro calls you",
      body: "Usually the same day. Talk it through, get your free quote, and decide on your own time. No pressure from us — ever.",
    },
  ];
  return (
    <Section id="how-it-works">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div className="relative hidden lg:block">
          <Photo
            name="drill-holster"
            alt="A local pro's tool belt, drill at the ready"
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/5] w-full rounded-3xl object-cover shadow-xl"
          />
          <div className="absolute -bottom-5 -right-5 rounded-2xl bg-white p-4 shadow-lg ring-1 ring-ink-200">
            <p className="font-display text-sm font-bold text-ink-900">Vetted local pros</p>
            <p className="text-xs text-ink-500">ready when you are</p>
          </div>
        </div>

        <div>
          <H2>Three steps. Zero phone tag.</H2>
          <Lead className="mt-3">
            We&apos;re your friendly local middle-man: you tell us once, we find the right
            pro, they call you. That&apos;s the whole thing.
          </Lead>
          <div className="mt-10 space-y-6">
            {steps.map((s) => (
              <div key={s.n} className="flex gap-5">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-600 font-display text-lg font-bold text-white shadow-sm">
                  {s.n}
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink-900">{s.title}</h3>
                  <p className="mt-1 text-ink-600">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-9">
            <ButtonLink href="/get-quote" size="lg">
              Start step one →
            </ButtonLink>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ------------------------------- service grid ------------------------------ */

export function ServiceGrid({
  services = SERVICES,
  heading = "Electrical services we connect you with",
  subhead,
}: {
  services?: Service[];
  heading?: string;
  subhead?: string;
}) {
  return (
    <Section className="bg-white">
      <div className="mx-auto max-w-2xl text-center">
        <H2>{heading}</H2>
        {subhead && <Lead className="mt-3">{subhead}</Lead>}
      </div>
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {services.map((s) => (
          <Link
            key={s.slug}
            href={`/services/${s.slug}`}
            className="group rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-inset ring-brand-100 transition-colors group-hover:bg-brand-600 group-hover:text-white">
              <Icon d={ICON_PATHS[s.slug] ?? CHECK} />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">
              {s.name}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.summary}</p>
            <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
              Learn more <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* -------------------------------- city grid -------------------------------- */

export function CityGrid({
  cities = CITIES,
  heading = "Proudly local to the Wenatchee Valley",
}: {
  cities?: City[];
  heading?: string;
}) {
  return (
    <Section className="bg-ink-50">
      <div className="mx-auto max-w-2xl text-center">
        <H2>{heading}</H2>
        <Lead className="mt-3">
          From downtown Wenatchee to the shores of Lake Chelan — if a pro can get a truck
          there, we can match you there.
        </Lead>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/locations/${c.slug}`}
            className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700 hover:shadow-sm"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </Section>
  );
}

/* --------------------------------- CTA band -------------------------------- */

export function CtaBand({
  heading = "Your pro is one minute away",
  body = "Tell us what you need. We'll introduce you to a trusted local pro — free, fast, and zero pressure.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-brand-800 py-16 sm:py-20">
      {/* Soft radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60rem 30rem at 70% 20%, rgba(52,211,153,0.25), transparent 60%), radial-gradient(40rem 20rem at 20% 90%, rgba(6,78,59,0.6), transparent 60%)",
        }}
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-lg text-brand-100">{body}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <ButtonLink href="/get-quote" size="lg" variant="secondary">
              Get my free quote
            </ButtonLink>
          </div>
          <p className="mt-5 text-sm text-brand-200">
            Free for homeowners · Same-day callback before 5pm
          </p>
        </div>
      </Container>
    </section>
  );
}

/* -------------------------------- cost guide ------------------------------- */

export function CostGuide({ low, high, name }: { low: number; high: number; name: string }) {
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;
  return (
    <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
      <h3 className="font-display text-lg font-bold text-ink-900">
        Typical cost in the Wenatchee Valley
      </h3>
      <p className="mt-2 text-3xl font-bold text-brand-700">
        {fmt(low)} – {fmt(high)}
      </p>
      <p className="mt-2 text-sm text-ink-600">
        Ballpark range for {name.toLowerCase()}. Your exact price depends on your home and
        scope — get matched with a local pro for a real quote.
      </p>
    </div>
  );
}

/* ----------------------------------- FAQ ----------------------------------- */

export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <H2 className="text-center">Good questions, straight answers</H2>
      <dl className="mt-8 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-ink-200 bg-white p-6">
            <dt className="font-display text-lg font-bold text-ink-900">{f.q}</dt>
            <dd className="mt-2 leading-relaxed text-ink-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/* -------------------------------- breadcrumbs ------------------------------ */

export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-ink-500">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, i) => (
          <li key={item.path} className="flex items-center gap-1.5">
            {i > 0 && <span aria-hidden>/</span>}
            {i < items.length - 1 ? (
              <Link href={item.path} className="hover:text-brand-700">
                {item.name}
              </Link>
            ) : (
              <span className="text-ink-700">{item.name}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
