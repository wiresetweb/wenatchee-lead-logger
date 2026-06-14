import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { CITIES, getCity } from "@/content/cities";
import { SERVICES } from "@/content/services";
import { pageMeta, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { Container, Section, H2, Lead, ButtonLink } from "@/components/ui";
import { Breadcrumbs, HowItWorksSteps, CtaBand } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return pageMeta({
    title: `Electrician in ${c.name}, ${SITE.state} — Free Quotes from Local Pros`,
    description: `Get matched with a trusted local electrician in ${c.name}, ${SITE.state}. Free, no-obligation quotes — a local pro reaches out the same day.`,
    path: `/locations/${c.slug}`,
  });
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();

  const path = `/locations/${c.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Service area", path: "/locations" },
    { name: c.name, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: `Electrician in ${c.name}`,
            description: `Local electrician matching service for ${c.name}, ${SITE.state}.`,
            path,
            areaServed: `${c.name}, ${SITE.state}`,
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      <section className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Find a trusted electrician in {c.name}, {SITE.state}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-600">{c.blurb}</p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <ButtonLink href="/get-quote" size="lg">
              Get a free quote
            </ButtonLink>
            {SITE.phoneEnabled && (
              <a href={SITE.phoneHref} className="font-semibold text-ink-800 hover:text-brand-700">
                or call {SITE.phone}
              </a>
            )}
          </div>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <H2>Electrical services in {c.name}</H2>
          <Lead className="mt-3">
            Whatever your project, we&apos;ll match you with a local pro who serves {c.name}{" "}
            and {c.county} County.
          </Lead>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Link
              key={s.slug}
              href={`/services/${s.slug}/${c.slug}`}
              className="group rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md"
            >
              <h3 className="font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">
                {s.name} in {c.name}
              </h3>
              <p className="mt-2 text-sm text-ink-600">{s.summary}</p>
            </Link>
          ))}
        </div>
      </Section>

      <div className="bg-ink-50">
        <HowItWorksSteps />
      </div>

      {/* Nearby cities */}
      <Section>
        <H2 className="text-center !text-2xl">Nearby communities we serve</H2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {CITIES.filter((o) => o.slug !== c.slug).map((o) => (
            <Link
              key={o.slug}
              href={`/locations/${o.slug}`}
              className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
            >
              {o.name}
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand heading={`Ready to get matched in ${c.name}?`} />
    </>
  );
}
