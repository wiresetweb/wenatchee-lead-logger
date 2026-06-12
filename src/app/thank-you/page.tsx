import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Request received",
    description: "Thanks — your request has been received. A local pro will reach out shortly.",
    path: "/thank-you",
  }),
  // Conversion confirmation pages should not be indexed.
  robots: { index: false, follow: false },
};

export default function ThankYouPage() {
  return (
    <Container className="max-w-2xl py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-100">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M5 12.5l4.5 4.5L19 7"
            stroke="var(--color-brand-600)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        You&apos;re all set!
      </h1>
      <p className="mt-4 text-lg text-ink-600">
        Thanks for your request. We&apos;re matching you with a trusted local pro right now —
        expect to hear from them soon. If you&apos;d like to talk sooner, give us a call.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
        <a href={SITE.phoneHref} className="font-semibold text-brand-700 hover:text-brand-800">
          Call {SITE.phone}
        </a>
      </div>
    </Container>
  );
}
