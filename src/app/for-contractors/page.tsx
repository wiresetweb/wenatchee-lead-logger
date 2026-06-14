import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container, Section, H2, Lead, Card, ButtonLink } from "@/components/ui";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = pageMeta({
  title: "For contractors — get local leads",
  description: `Grow your business with enriched, exclusive home-service leads in ${SITE.regionShort}. Real-time email + a dashboard, delivered the moment a homeowner requests a quote.`,
  path: "/for-contractors",
});

const benefits = [
  {
    title: "Enriched, not just a name",
    body: "Every lead is enhanced with property and homeowner details — like home value, ownership, and property age — so you know who you're calling before you pick up the phone.",
  },
  {
    title: "Real-time delivery",
    body: "Leads hit your inbox the instant a homeowner submits — and they're waiting in your dashboard too. Speed-to-lead wins jobs.",
  },
  {
    title: "Local and relevant",
    body: "We focus on the Wenatchee Valley. Every lead is a homeowner in your service area asking for your kind of work.",
  },
  {
    title: "Your own dashboard",
    body: "Log in any time to see every lead we've sent you, with full details and status — no spreadsheets to manage.",
  },
];

export default function ForContractorsPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="toolbag"
          alt="An electrician's loaded tool bag beside the work van"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-30"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-ink-950/90 via-ink-950/70 to-transparent" />
        <Container className="py-16 sm:py-24">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-300">
              For contractors
            </p>
            <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Leads that show up knowing who you&apos;re calling
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink-200">
              Stop chasing tire-kickers from national directories. Get high-intent homeowners
              in {SITE.regionName} — delivered to your inbox and dashboard the moment they ask
              for a quote, with the homeowner and property details that help you win the job.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/contact" size="lg">
                Become a partner
              </ButtonLink>
              {SITE.phoneEnabled && (
                <a
                  href={SITE.phoneHref}
                  className="inline-flex items-center font-semibold text-white hover:text-brand-200"
                >
                  or call {SITE.phone}
                </a>
              )}
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <div className="mx-auto max-w-2xl text-center">
          <H2>Why partner with us</H2>
          <Lead className="mt-3">
            We do the marketing and qualifying. You do what you do best — the work.
          </Lead>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {benefits.map((b) => (
            <Card key={b.title}>
              <h3 className="font-display text-lg font-bold text-ink-900">{b.title}</h3>
              <p className="mt-2 text-ink-600">{b.body}</p>
            </Card>
          ))}
        </div>
      </Section>

      {/* Intro offer — see docs/LEAD_ENRICHMENT.md §3 (5–10 free intro leads). */}
      <Section className="bg-brand-50">
        <div className="mx-auto max-w-3xl text-center">
          <H2>Try your first leads on us</H2>
          <Lead className="mt-3">
            We&apos;re onboarding a limited number of electrical contractors in the Wenatchee
            Valley. New partners get their first several leads free, so you can see the quality
            before you spend a dollar. After that, leads are offered at a simple per-lead rate
            with no long-term contract.
          </Lead>
          <div className="mt-8">
            <ButtonLink href="/contact" size="lg">
              Get started
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
