import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES, getService } from "@/content/services";
import { FEATURED_CITIES } from "@/content/cities";
import {
  pageMeta,
  serviceSchema,
  faqSchema,
  breadcrumbSchema,
} from "@/lib/seo";
import { Container, Section, H2, ButtonLink, Card } from "@/components/ui";
import {
  Breadcrumbs,
  CostGuide,
  FaqList,
  CtaBand,
} from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return SERVICES.map((s) => ({ service: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ service: string }>;
}): Promise<Metadata> {
  const { service } = await params;
  const s = getService(service);
  if (!s) return {};
  return pageMeta({
    title: `${s.name} in ${SITE.regionShort}, ${SITE.state} — Free Quotes`,
    description: s.summary,
    path: `/services/${s.slug}`,
  });
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ service: string }>;
}) {
  const { service } = await params;
  const s = getService(service);
  if (!s) notFound();

  const path = `/services/${s.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: s.name, path },
  ];

  return (
    <>
      <JsonLd
        data={[
          serviceSchema({ name: s.name, description: s.summary, path }),
          faqSchema(s.faqs),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* Hero */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-start">
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                {s.name} in {SITE.regionShort}, {SITE.state}
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-ink-600">{s.intro}</p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/get-quote" size="lg">
                  Get a free quote
                </ButtonLink>
                <a
                  href={SITE.phoneHref}
                  className="font-semibold text-ink-800 hover:text-brand-700"
                >
                  or call {SITE.phone}
                </a>
              </div>
            </div>
            <CostGuide low={s.costLow} high={s.costHigh} name={s.name} />
          </div>
        </Container>
      </section>

      {/* What's involved + signs */}
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
            <H2 className="!text-2xl">Signs you may need this</H2>
            <ul className="mt-4 space-y-3">
              {s.signsYouNeedIt.map((item) => (
                <li key={item} className="flex gap-3 text-ink-700">
                  <span className="mt-1 text-accent-500">●</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-ink-50">
        <FaqList faqs={s.faqs} />
      </Section>

      {/* Other services + cities for internal linking */}
      <Section>
        <H2 className="text-center !text-2xl">Other services</H2>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {SERVICES.filter((o) => o.slug !== s.slug).map((o) => (
            <Link
              key={o.slug}
              href={`/services/${o.slug}`}
              className="rounded-full border border-ink-200 bg-white px-5 py-2.5 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
            >
              {o.name}
            </Link>
          ))}
        </div>
        <p className="mt-10 text-center text-sm text-ink-600">
          Available in{" "}
          {FEATURED_CITIES.map((c, i) => (
            <span key={c.slug}>
              <Link href={`/locations/${c.slug}`} className="text-brand-700 hover:underline">
                {c.name}
              </Link>
              {i < FEATURED_CITIES.length - 1 ? ", " : ""}
            </span>
          ))}{" "}
          and across {SITE.regionName}.
        </p>
      </Section>

      <CtaBand />
    </>
  );
}
