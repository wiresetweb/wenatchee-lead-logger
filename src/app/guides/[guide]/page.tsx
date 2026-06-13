import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { GUIDES, getGuide } from "@/content/guides";
import { getService } from "@/content/services";
import { FEATURED_CITIES } from "@/content/cities";
import { fmtMoney } from "@/lib/local";
import { pageMeta, faqSchema, breadcrumbSchema } from "@/lib/seo";
import { Container, H2, ButtonLink } from "@/components/ui";
import { Breadcrumbs, CtaBand } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ guide: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ guide: string }>;
}): Promise<Metadata> {
  const { guide } = await params;
  const g = getGuide(guide);
  if (!g) return {};
  return pageMeta({ title: g.title, description: g.summary, path: `/guides/${g.slug}` });
}

export default async function GuidePage({
  params,
}: {
  params: Promise<{ guide: string }>;
}) {
  const { guide } = await params;
  const g = getGuide(guide);
  if (!g) notFound();

  const service = g.serviceSlug ? getService(g.serviceSlug) : undefined;
  const path = `/guides/${g.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Guides", path: "/guides" },
    { name: g.title, path },
  ];

  return (
    <>
      <JsonLd data={[faqSchema(g.faqs), breadcrumbSchema(crumbs)]} />

      <section className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-12 sm:py-16">
          <Breadcrumbs items={crumbs} />
          <h1 className="mt-6 max-w-3xl font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            {g.title}
          </h1>
          <p className="mt-3 text-sm text-ink-500">Updated {g.updated}</p>
          <p className="mt-4 font-display text-3xl font-bold text-brand-700">
            {fmtMoney(g.costLow)} – {fmtMoney(g.costHigh)}
          </p>
        </Container>
      </section>

      <Container className="max-w-3xl py-12">
        <div className="space-y-4 text-lg leading-relaxed text-ink-700">
          {g.intro.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        {/* Cost breakdown */}
        <div className="mt-10">
          <H2 className="!text-2xl">Cost breakdown</H2>
          <div className="mt-4 overflow-hidden rounded-2xl border border-ink-200">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-ink-100">
                {g.breakdown.map((row) => (
                  <tr key={row.item}>
                    <td className="px-4 py-3 text-ink-700">{row.item}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink-900">
                      {row.range}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            Ranges are local estimates for the Wenatchee Valley and vary by home and scope.
          </p>
        </div>

        {/* Factors */}
        <div className="mt-10">
          <H2 className="!text-2xl">What affects the price</H2>
          <div className="mt-4 space-y-4">
            {g.factors.map((f) => (
              <div key={f.factor} className="rounded-2xl border border-ink-200 bg-white p-5">
                <h3 className="font-display font-bold text-ink-900">{f.factor}</h3>
                <p className="mt-1 text-ink-600">{f.detail}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-2xl bg-brand-700 p-6 text-center sm:p-8">
          <h2 className="font-display text-xl font-bold text-white">
            Want an exact price for your home?
          </h2>
          <p className="mt-2 text-brand-100">
            Get matched with a trusted local electrician for a free, no-obligation quote.
          </p>
          <div className="mt-5">
            <ButtonLink href="/get-quote" size="lg" variant="secondary">
              Get my free quote
            </ButtonLink>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-12">
          <H2 className="!text-2xl">FAQs</H2>
          <dl className="mt-6 space-y-5">
            {g.faqs.map((f) => (
              <div key={f.q} className="rounded-2xl border border-ink-200 bg-white p-6">
                <dt className="font-display text-lg font-bold text-ink-900">{f.q}</dt>
                <dd className="mt-2 leading-relaxed text-ink-600">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* Cross-links */}
        {service && (
          <p className="mt-10 text-sm text-ink-600">
            Learn more about{" "}
            <Link href={`/services/${service.slug}`} className="text-brand-700 hover:underline">
              {service.name.toLowerCase()}
            </Link>
            , or get a quote in{" "}
            {FEATURED_CITIES.slice(0, 4).map((c, i, arr) => (
              <span key={c.slug}>
                <Link
                  href={`/services/${service.slug}/${c.slug}`}
                  className="text-brand-700 hover:underline"
                >
                  {c.name}
                </Link>
                {i < arr.length - 1 ? ", " : ""}
              </span>
            ))}
            .
          </p>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
