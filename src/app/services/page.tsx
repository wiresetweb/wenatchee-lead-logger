import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { SERVICES } from "@/content/services";
import { GUIDES } from "@/content/guides";
import { pageMeta, itemListSchema, breadcrumbSchema } from "@/lib/seo";
import { Container } from "@/components/ui";
import { ServiceGrid, CtaBand, Breadcrumbs } from "@/components/sections";
import { Photo } from "@/components/Photo";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: `Electrical Services in ${SITE.regionShort}, ${SITE.state} — Free Quotes`,
  description: `Browse the electrical services we connect ${SITE.regionShort} homeowners with — panel upgrades, EV chargers, electrical repair, generators, rewiring, and lighting. Free quotes with a same-day callback.`,
  path: "/services",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
];

export default function ServicesHubPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema(crumbs),
          itemListSchema({
            name: `Electrical services in ${SITE.regionShort}, ${SITE.state}`,
            items: SERVICES.map((s) => ({ name: s.name, path: `/services/${s.slug}` })),
          }),
        ]}
      />

      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="doorknob-install"
          alt="A licensed electrician's hands at work with a compact driver"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 to-ink-950/80" />
        <Container className="py-16 sm:py-20">
          <Breadcrumbs items={crumbs} tone="light" />
          <div className="mx-auto mt-6 max-w-2xl text-center">
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
              Electrical services in {SITE.regionShort}, {SITE.state}
            </h1>
            <p className="mt-4 text-lg text-ink-100">
              Quick repair or whole-home rewire — pick your project and we&apos;ll match you
              with a licensed local electrician in {SITE.regionName} who does it every day.
              Free quotes, same-day callback, no obligation.
            </p>
          </div>
        </Container>
      </section>

      <ServiceGrid heading="All electrical services" />

      {/* Intro copy + internal links for topical depth and crawl paths. */}
      <section className="border-t border-ink-100 bg-white py-14 sm:py-16">
        <Container className="max-w-3xl">
          <h2 className="font-display text-2xl font-bold text-ink-900">
            One call connects you with the right electrician
          </h2>
          <p className="mt-4 leading-relaxed text-ink-700">
            From {SITE.regionShort} to East Wenatchee, Cashmere, Leavenworth, and Chelan, we
            match homeowners with vetted, licensed electricians for everything from a
            flickering outlet to a 200-amp panel upgrade or a new EV charger circuit. Every
            pro in our network is licensed and insured in Washington, and we only send your
            details to one who actually services your area — so you get a real, same-day
            callback instead of voicemail tag.
          </p>
          <p className="mt-4 leading-relaxed text-ink-700">
            Not sure what a job should cost? Start with our local{" "}
            <Link href="/guides" className="font-semibold text-brand-700 hover:underline">
              electrical cost guides
            </Link>
            , read{" "}
            <Link href="/blog" className="font-semibold text-brand-700 hover:underline">
              hiring and permit advice
            </Link>{" "}
            on the blog, or jump straight to a{" "}
            <Link href="/get-quote" className="font-semibold text-brand-700 hover:underline">
              free quote
            </Link>
            .
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-700 hover:border-brand-300 hover:text-brand-700"
              >
                {g.title.replace(" in the Wenatchee Valley (2026)", "")}
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
