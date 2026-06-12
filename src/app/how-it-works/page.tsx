import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Lead } from "@/components/ui";
import { HowItWorksSteps, TrustBar, CtaBand } from "@/components/sections";

export const metadata: Metadata = pageMeta({
  title: "How it works",
  description: `Cascade Home Connect is a free service that matches ${SITE.regionShort} homeowners with trusted local pros. Here's exactly how it works — and how we make money.`,
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            How Cascade Home Connect works
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            We&apos;re the friendly local middleman between you and the right pro. Simple,
            free, and no pressure.
          </p>
        </Container>
      </section>

      <HowItWorksSteps />
      <TrustBar />

      {/* Transparency — required for honest framing (see docs/COMPLIANCE.md §1). */}
      <Container className="max-w-3xl py-14 sm:py-20">
        <H2>How we make money (the honest version)</H2>
        <Lead className="mt-4">
          Cascade Home Connect is always 100% free for homeowners — you&apos;ll never pay us
          a cent. We&apos;re a referral service: when you request a quote, we connect you with
          one or more independent local service providers who may contact you about your
          project, and those providers pay us for the introduction.
        </Lead>
        <Lead className="mt-4">
          We&apos;re not a contractor and we don&apos;t do the work ourselves. We focus on
          matching you with a trustworthy local pro quickly — so you can get a fair quote
          without the hassle of calling around. You&apos;re always free to choose whether to
          hire anyone.
        </Lead>

        <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
          <h3 className="font-display text-lg font-bold text-ink-900">Our promise</h3>
          <ul className="mt-4 space-y-3 text-ink-700">
            <li className="flex gap-3">
              <span className="text-brand-600">✓</span> Free for homeowners — always.
            </li>
            <li className="flex gap-3">
              <span className="text-brand-600">✓</span> We connect you with local, vetted pros.
            </li>
            <li className="flex gap-3">
              <span className="text-brand-600">✓</span> A pro reaches out the same day (next
              business day for evening requests).
            </li>
            <li className="flex gap-3">
              <span className="text-brand-600">✓</span> No obligation — the choice is yours.
            </li>
          </ul>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
