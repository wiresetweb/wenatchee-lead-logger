import { SITE } from "@/lib/site";
import { FEATURED_CITIES } from "@/content/cities";
import { Container, ButtonLink } from "@/components/ui";
import { TrustBar, HowItWorksSteps, CityGrid, CtaBand } from "@/components/sections";
import { TradeSelector } from "@/components/TradeSelector";
import { Photo } from "@/components/Photo";

export default function HomePage() {
  return (
    <>
      {/* Hero — brand-level, trade-agnostic */}
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="hero-wenatchee"
          alt="Golden hills of the Wenatchee Valley at dusk"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_35%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/85 via-ink-900/65 to-brand-950/40" />

        <Container className="py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="rise-in rise-in-1 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-sm font-medium text-brand-100 ring-1 ring-inset ring-white/25 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-400" />
              Your local pro, minus the hassle · {SITE.regionShort}, {SITE.state}
            </span>
            <h1 className="rise-in rise-in-2 mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl">
              Find a trusted local pro
              <br />
              <span className="text-brand-300">without the phone tag.</span>
            </h1>
            <p className="rise-in rise-in-3 mt-6 max-w-xl text-lg leading-relaxed text-ink-100 sm:text-xl">
              Tell us what you need and we&apos;ll match you with a vetted local pro in the
              Wenatchee Valley — who actually calls you back, usually the same day. Always
              free for homeowners.
            </p>
            <div className="rise-in rise-in-4 mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="#choose" size="lg" className="shadow-lg shadow-brand-950/40">
                Choose what you need
              </ButtonLink>
              {SITE.phoneEnabled && (
                <a
                  href={SITE.phoneHref}
                  className="text-base font-semibold text-white underline-offset-4 hover:underline"
                >
                  or call {SITE.phone}
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      <TrustBar />
      <TradeSelector />
      <HowItWorksSteps />
      <CityGrid cities={FEATURED_CITIES} />
      <CtaBand
        heading="One quick form. The right local pro."
        body="Choose your service and get a free, no-obligation quote — usually with a same-day callback."
      />
    </>
  );
}
