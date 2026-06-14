import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta, itemListSchema, breadcrumbSchema } from "@/lib/seo";
import { POSTS_BY_DATE } from "@/content/blog";
import { Container } from "@/components/ui";
import { CtaBand, Breadcrumbs } from "@/components/sections";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: `Electrical Advice for ${SITE.regionShort} Homeowners`,
  description: `Local electrical advice for ${SITE.regionShort} homeowners — permits, panel upgrades, hiring tips, EV chargers, generator sizing, and more, written for our corner of Washington.`,
  path: "/blog",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Blog", path: "/blog" },
];

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const [featured, ...rest] = POSTS_BY_DATE;

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          itemListSchema({
            name: `Electrical advice for ${SITE.regionShort} homeowners`,
            items: POSTS_BY_DATE.map((p) => ({ name: p.title, path: `/blog/${p.slug}` })),
          }),
        ]}
      />

      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container>
          <Breadcrumbs items={crumbs} />
          <div className="mx-auto mt-6 max-w-2xl text-center">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              Electrical advice for {SITE.regionShort} homeowners
            </h1>
            <p className="mt-3 text-lg text-ink-600">
              Straight answers on electrical work, permits, costs, and hiring — written for
              our corner of Washington.
            </p>
          </div>
        </Container>
      </section>

      <Container className="py-12">
        {featured && (
          <Link
            href={`/blog/${featured.slug}`}
            className="group mb-8 block rounded-3xl border border-ink-200 bg-white p-8 shadow-sm transition-all hover:border-brand-300 hover:shadow-lg"
          >
            <p className="text-sm font-semibold text-brand-700">
              {featured.category} · {featured.readMins} min read
            </p>
            <h2 className="mt-2 font-display text-2xl font-bold text-ink-900 group-hover:text-brand-700 sm:text-3xl">
              {featured.title}
            </h2>
            <p className="mt-3 max-w-3xl text-ink-600">{featured.excerpt}</p>
            <p className="mt-4 text-sm text-ink-400">{fmtDate(featured.date)}</p>
          </Link>
        )}

        <div className="grid gap-5 sm:grid-cols-2">
          {rest.map((p) => (
            <Link
              key={p.slug}
              href={`/blog/${p.slug}`}
              className="group flex flex-col rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-brand-700">
                {p.category} · {p.readMins} min
              </p>
              <h3 className="mt-2 font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">
                {p.title}
              </h3>
              <p className="mt-2 flex-1 text-sm text-ink-600">{p.excerpt}</p>
              <p className="mt-4 text-xs text-ink-400">{fmtDate(p.date)}</p>
            </Link>
          ))}
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
