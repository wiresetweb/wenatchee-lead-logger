import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { FEATURED_SERVICES } from "@/content/services";
import { FEATURED_CITIES } from "@/content/cities";
import { GUIDES } from "@/content/guides";
import { pageMeta, serviceSchema, breadcrumbSchema } from "@/lib/seo";
import { fmtMoney } from "@/lib/local";
import { Container, ButtonLink, Badge, H2, Lead } from "@/components/ui";
import {
  TrustBar,
  HowItWorksSteps,
  ServiceGrid,
  CityGrid,
  CtaBand,
  Breadcrumbs,
} from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";
import { JsonLd } from "@/components/JsonLd";

export const metadata: Metadata = pageMeta({
  title: "Electricians in the Wenatchee Valley — Free Quotes, Same-Day Callback",
  description:
    "Get matched with a trusted, licensed local electrician in Wenatchee, East Wenatchee, Cashmere, Leavenworth & Chelan. Free quotes, same-day callback, no obligation.",
  path: "/electricians",
});

const crumbs = [
  { name: "Home", path: "/" },
  { name: "Electricians", path: "/electricians" },
];

export default function ElectriciansHubPage() {
  return (
    <>
      <JsonLd
        data={[
          serviceSchema({
            name: "Electrician matching service",
            description:
              "Free service matching Wenatchee Valley homeowners with trusted local electricians.",
            path: "/electricians",
          }),
          breadcrumbSchema(crumbs),
        ]}
      />

      {/* Hero with embedded quote form */}
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <Container className="py-10 sm:py-14">
          <Breadcrumbs items={crumbs} />
          <div className="mt-6 grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <Badge>
                Licensed local electricians · {SITE.regionShort}, {SITE.state}
              </Badge>
              <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                Get matched with a{" "}
                <span className="text-brand-600">trusted local electrician</span>
              </h1>
              <p className="mt-5 max-w-xl text-lg text-ink-600">
                From a flickering light to a full panel upgrade, we connect you with a
                vetted electrician who serves {SITE.regionName} — usually with a same-day
                callback. Always free, no obligation.
              </p>
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <ButtonLink href="/get-quote" size="lg">
                  Get my free quote
                </ButtonLink>
                <a
                  href={SITE.phoneHref}
                  className="text-base font-semibold text-ink-800 hover:text-brand-700"
                >
                  or call {SITE.phone}
                </a>
              </div>
            </div>
            <div className="lg:pl-6">
              <QuoteForm trade="electrical" />
            </div>
          </div>
        </Container>
      </section>

      <TrustBar />
      <ServiceGrid
        services={FEATURED_SERVICES}
        heading="Electrical services we connect you with"
        subhead="Big job or small fix — we'll match you with a local electrician who does exactly this, every day."
      />

      {/* Cost guides teaser */}
      <section className="bg-ink-50 py-14 sm:py-20">
        <Container>
          <div className="mx-auto max-w-2xl text-center">
            <H2>Know the cost before you call</H2>
            <Lead className="mt-3">
              Honest, local price ranges so there are no surprises.
            </Lead>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GUIDES.map((g) => (
              <Link
                key={g.slug}
                href={`/guides/${g.slug}`}
                className="group rounded-2xl border border-ink-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
              >
                <p className="text-sm font-semibold text-brand-700">
                  {fmtMoney(g.costLow)}–{fmtMoney(g.costHigh)}
                </p>
                <h3 className="mt-1 font-display text-base font-bold text-ink-900 group-hover:text-brand-700">
                  {g.title.replace(" in the Wenatchee Valley (2026)", "")}
                </h3>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <HowItWorksSteps />
      <CityGrid cities={FEATURED_CITIES} heading="Electricians across the Wenatchee Valley" />
      <CtaBand heading="Ready to get matched with a local electrician?" />
    </>
  );
}
