import { SITE } from "@/lib/site";
import { FEATURED_SERVICES } from "@/content/services";
import { FEATURED_CITIES } from "@/content/cities";
import { Container, ButtonLink } from "@/components/ui";
import {
  TrustBar,
  HowItWorksSteps,
  ServiceGrid,
  CityGrid,
  CtaBand,
} from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";
import { Photo } from "@/components/Photo";

export default function HomePage() {
  return (
    <>
      {/* Hero — full-bleed valley photo, floating quote card */}
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="hero-wenatchee"
          alt="Golden hills of the Wenatchee Valley at dusk"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_35%]"
        />
        {/* Emerald-tinted gradient for text legibility */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-900/65 to-brand-950/40" />
        <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-ink-950/60 to-transparent" />

        <Container className="grid gap-12 py-16 sm:py-20 lg:grid-cols-2 lg:items-center lg:py-24">
          <div>
            <span className="rise-in rise-in-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-inset ring-white/25 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Homegrown in the {SITE.regionShort}
            </span>
            <h1 className="rise-in rise-in-2 mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Skip the phone tag.
              <br />
              <span className="text-brand-300">We&apos;ll find your electrician.</span>
            </h1>
            <p className="rise-in rise-in-3 mt-6 max-w-xl text-lg leading-relaxed text-ink-100 sm:text-xl">
              One quick form. We hand-match you with a trusted local pro who actually
              answers — usually the same day. Free for homeowners, no strings, ever.
            </p>
            <div className="rise-in rise-in-4 mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/get-quote" size="lg" className="shadow-lg shadow-brand-950/40">
                Get my free quote
              </ButtonLink>
              <a
                href={SITE.phoneHref}
                className="text-base font-semibold text-white underline-offset-4 hover:underline"
              >
                or call {SITE.phone}
              </a>
            </div>
            <p className="rise-in rise-in-4 mt-6 text-sm text-ink-300">
              Takes under a minute · No account needed · No spam, promise
            </p>
          </div>

          <div className="rise-in rise-in-3 lg:pl-6">
            <QuoteForm />
          </div>
        </Container>
      </section>

      <TrustBar />
      <HowItWorksSteps />
      <ServiceGrid
        services={FEATURED_SERVICES}
        heading="What needs doing at your place?"
        subhead="Big job or small fix — we'll match you with a local electrician who does exactly this, every day."
      />
      <CityGrid cities={FEATURED_CITIES} />
      <CtaBand />
    </>
  );
}
