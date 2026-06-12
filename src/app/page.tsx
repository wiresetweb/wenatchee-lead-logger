import { SITE } from "@/lib/site";
import { FEATURED_SERVICES } from "@/content/services";
import { FEATURED_CITIES } from "@/content/cities";
import { Container, ButtonLink, Badge } from "@/components/ui";
import {
  TrustBar,
  HowItWorksSteps,
  ServiceGrid,
  CityGrid,
  CtaBand,
} from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white">
        <Container className="grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
          <div>
            <Badge>
              Free for homeowners · {SITE.regionShort}, {SITE.state}
            </Badge>
            <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Get matched with a{" "}
              <span className="text-brand-600">trusted local electrician</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-ink-600">
              Tell us what you need and we&apos;ll connect you with a vetted local pro in{" "}
              {SITE.regionName}. A pro reaches out the same day — and it&apos;s always free,
              with no obligation.
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
            <QuoteForm />
          </div>
        </Container>
      </section>

      <TrustBar />
      <HowItWorksSteps />
      <ServiceGrid
        services={FEATURED_SERVICES}
        heading="What can we help you with?"
        subhead="We connect Wenatchee Valley homeowners with local electricians for jobs big and small."
      />
      <CityGrid cities={FEATURED_CITIES} />
      <CtaBand />
    </>
  );
}
