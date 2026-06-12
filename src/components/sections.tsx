/**
 * Reusable marketing sections composed from the UI primitives. Server components.
 */
import Link from "next/link";
import { SERVICES, type Service } from "@/content/services";
import { CITIES, type City } from "@/content/cities";
import { ButtonLink, Card, Container, H2, Lead, Section } from "@/components/ui";

/** Trust signals strip. */
export function TrustBar() {
  const items = [
    "100% free for homeowners",
    "Local, vetted pros",
    "Same-day callback",
    "No obligation",
  ];
  return (
    <div className="border-y border-ink-200 bg-ink-50">
      <Container className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 py-4 text-sm font-medium text-ink-700">
        {items.map((i) => (
          <span key={i} className="inline-flex items-center gap-2">
            <CheckIcon /> {i}
          </span>
        ))}
      </Container>
    </div>
  );
}

/** The 3-step "how it works" explainer. */
export function HowItWorksSteps() {
  const steps = [
    {
      n: 1,
      title: "Tell us what you need",
      body: "Answer a few quick questions about your project. It takes under a minute and it's always free.",
    },
    {
      n: 2,
      title: "We match you locally",
      body: "We connect you with a trusted, local pro who serves your area and handles your type of work.",
    },
    {
      n: 3,
      title: "Get your free quote",
      body: "Your matched pro reaches out — typically the same day — to discuss your project and quote it.",
    },
  ];
  return (
    <Section id="how-it-works">
      <div className="mx-auto max-w-2xl text-center">
        <H2>How it works</H2>
        <Lead className="mt-3">
          We&apos;re the friendly middleman. You tell us what you need; we connect you with
          the right local pro. No cost, no pressure.
        </Lead>
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {steps.map((s) => (
          <Card key={s.n}>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 font-display text-lg font-bold text-white">
              {s.n}
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink-900">{s.title}</h3>
            <p className="mt-2 text-ink-600">{s.body}</p>
          </Card>
        ))}
      </div>
    </Section>
  );
}

/** Grid of service cards. */
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
            className="group rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
          >
            <h3 className="font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">
              {s.name}
            </h3>
            <p className="mt-2 text-sm text-ink-600">{s.summary}</p>
            <span className="mt-4 inline-block text-sm font-semibold text-brand-700">
              Learn more →
            </span>
          </Link>
        ))}
      </div>
    </Section>
  );
}

/** Grid of city links. */
export function CityGrid({
  cities = CITIES,
  heading = "Serving the Wenatchee Valley",
}: {
  cities?: City[];
  heading?: string;
}) {
  return (
    <Section className="bg-ink-50">
      <div className="mx-auto max-w-2xl text-center">
        <H2>{heading}</H2>
        <Lead className="mt-3">
          Based in Wenatchee and serving the surrounding communities of Chelan and Douglas
          counties.
        </Lead>
      </div>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        {cities.map((c) => (
          <Link
            key={c.slug}
            href={`/locations/${c.slug}`}
            className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            {c.name}
          </Link>
        ))}
      </div>
    </Section>
  );
}

/** Full-width call-to-action band. */
export function CtaBand({
  heading = "Ready to get matched with a local pro?",
  body = "Tell us what you need and get a free, no-obligation quote. It takes less than a minute.",
}: {
  heading?: string;
  body?: string;
}) {
  return (
    <Section className="bg-brand-700">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
          {heading}
        </h2>
        <p className="mt-3 text-lg text-brand-50">{body}</p>
        <div className="mt-8">
          <ButtonLink href="/get-quote" size="lg" variant="secondary">
            Get my free quote
          </ButtonLink>
        </div>
      </div>
    </Section>
  );
}

/** Cost-guide callout block for service pages. */
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

/** FAQ accordion-free list (also paired with FAQPage schema by the page). */
export function FaqList({ faqs }: { faqs: { q: string; a: string }[] }) {
  if (!faqs.length) return null;
  return (
    <div className="mx-auto max-w-3xl">
      <H2 className="text-center">Frequently asked questions</H2>
      <dl className="mt-8 space-y-6">
        {faqs.map((f) => (
          <div key={f.q} className="rounded-2xl border border-ink-200 bg-white p-6">
            <dt className="font-display text-lg font-bold text-ink-900">{f.q}</dt>
            <dd className="mt-2 text-ink-600">{f.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

/** Breadcrumb trail (visual; schema emitted separately). */
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

function CheckIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0L3.3 9.7a1 1 0 011.4-1.4l3.3 3.3 6.8-6.8a1 1 0 011.4 0z"
        fill="var(--color-brand-600)"
      />
    </svg>
  );
}
