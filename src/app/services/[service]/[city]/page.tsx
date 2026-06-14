import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES, getService } from "@/content/services";
import { CITIES, getCity } from "@/content/cities";
import {
  pageMeta,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import {
  localizedIntro,
  nearbyCities,
  cityCostFaq,
  fmtMoney,
  WA_PERMIT_NOTE,
} from "@/lib/local";
import { Container, Section, H2, ButtonLink, Card } from "@/components/ui";
import { Breadcrumbs, CtaBand } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

/** All service × city combinations, statically generated. */
export function generateStaticParams() {
  return SERVICES.flatMap((s) => CITIES.map((c) => ({ service: s.slug, city: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}): Promise<Metadata> {
  const { service, city } = await params;
  const s = getService(service);
  const c = getCity(city);
  if (!s || !c) return {};
  return pageMeta({
    title: `${s.name} in ${c.name}, ${SITE.state} — Cost & Free Quotes`,
    description: `${s.name} in ${c.name}, ${SITE.state}: typical cost ${fmtMoney(s.costLow)}–${fmtMoney(s.costHigh)}. Get matched with a trusted local electrician — free, same-day callback.`,
    path: `/services/${s.slug}/${c.slug}`,
  });
}

export default async function ServiceCityPage({
  params,
}: {
  params: Promise<{ service: string; city: string }>;
}) {
  const { service, city } = await params;
  const s = getService(service);
  const c = getCity(city);
  if (!s || !c) notFound();

  const path = `/services/${s.slug}/${c.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path: `/services/${s.slug}` },
    { name: c.name, path },
  ];
  const faqs = [cityCostFaq(s, c), ...s.faqs];
  const near = nearbyCities(c);

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `${s.name} in ${c.name}`,
            description: s.summary,
            path,
            areaServed: `${c.name}, ${SITE.state}`,
          }),
          faqSchema(faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {s.name} in {c.name}, {SITE.state}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-ink-600">{localizedIntro(s, c)}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/get-quote" size="lg">
                  Get a free quote
                </ButtonLink>
                {SITE.phoneEnabled && (
                  <a
                    href={SITE.phoneHref}
                    className="font-semibold text-ink-800 hover:text-brand-700"
                  >
                    or call {SITE.phone}
                  </a>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-brand-200 bg-brand-50 p-6">
              <h2 className="font-display text-lg font-bold text-ink-900">
                {s.name} cost in {c.name}
              </h2>
              <p className="mt-2 text-3xl font-bold text-brand-700">
                {fmtMoney(s.costLow)} – {fmtMoney(s.costHigh)}
              </p>
              <p className="mt-2 text-sm text-ink-600">
                Typical range for {c.name} homes. Your exact price depends on your home and
                scope — get a real quote in minutes.
              </p>
            </div>
          </div>
        </Container>
      </section>

      {/* What's involved + why us */}
      <Section>
        <div className="grid gap-8 lg:grid-cols-2">
          <Card>
            <H2 className="!text-2xl">What&apos;s involved</H2>
            <ul className="mt-4 space-y-3">
              {s.whatsInvolved.map((item) => (
                <li key={item} className="flex gap-3 text-ink-700">
                  <span className="mt-1 text-brand-600">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
          <Card>
            <H2 className="!text-2xl">Why {c.name} homeowners use us</H2>
            <ul className="mt-4 space-y-3 text-ink-700">
              <li className="flex gap-3">
                <span className="mt-1 text-brand-600">✓</span>
                Matched with a licensed local electrician who serves {c.name} and{" "}
                {c.county} County
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-brand-600">✓</span>
                Same-day callback — no waiting days for a return call
              </li>
              <li className="flex gap-3">
                <span className="mt-1 text-brand-600">✓</span>
                100% free, no obligation, no pressure
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      {/* Local context */}
      <Section className="bg-ink-50">
        <div className="mx-auto max-w-3xl">
          <H2 className="!text-2xl">Permits &amp; local details for {c.name}</H2>
          <p className="mt-4 text-ink-700">{WA_PERMIT_NOTE}</p>
          <p className="mt-4 text-ink-700">
            {c.name} is part of {c.county} County in the Wenatchee Valley. Our network of
            local pros knows the area, the permitting process, and the kind of homes here —
            so you get accurate quotes and code-compliant work.
          </p>
        </div>
      </Section>

      {/* FAQ */}
      <Section>
        <div className="mx-auto max-w-3xl">
          <H2 className="text-center">
            {s.name} in {c.name}: common questions
          </H2>
          <dl className="mt-8 space-y-6">
            {faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-ink-200 bg-white p-6">
                <dt className="font-display text-lg font-bold text-ink-900">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Section>

      {/* Internal links */}
      <Section className="bg-ink-50">
        <div className="grid gap-10 sm:grid-cols-2">
          <div>
            <h3 className="font-display text-lg font-bold text-ink-900">
              {s.name} in nearby areas
            </h3>
            <ul className="mt-4 space-y-2">
              {near.map((nc) => (
                <li key={nc.slug}>
                  <Link
                    href={`/services/${s.slug}/${nc.slug}`}
                    className="text-brand-700 hover:underline"
                  >
                    {s.name} in {nc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-ink-900">
              Other services in {c.name}
            </h3>
            <ul className="mt-4 space-y-2">
              {SERVICES.filter((o) => o.slug !== s.slug)
                .slice(0, 5)
                .map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/services/${o.slug}/${c.slug}`}
                      className="text-brand-700 hover:underline"
                    >
                      {o.name} in {c.name}
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-sm text-ink-600">
          See all{" "}
          <Link href={`/services/${s.slug}`} className="text-brand-700 hover:underline">
            {s.name.toLowerCase()} info
          </Link>{" "}
          or everything we offer in{" "}
          <Link href={`/locations/${c.slug}`} className="text-brand-700 hover:underline">
            {c.name}
          </Link>
          .
        </p>
      </Section>

      <CtaBand heading={`Get your free ${s.name.toLowerCase()} quote in ${c.name}`} />
    </>
  );
}
