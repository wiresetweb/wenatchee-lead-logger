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

const NEXT_STEPS = [
  {
    title: "We match you (happening now)",
    body: "Your request is on its way to a trusted local pro who covers your area and your kind of project.",
  },
  {
    title: "Your pro calls or texts",
    body: "Usually the same day — typically from a local (509) number. Save yourself the phone tag and pick up!",
  },
  {
    title: "Talk it through, get your quote",
    body: "Describe the project, ask anything, get your free quote. Whether you hire them is 100% up to you.",
  },
];

export default function ThankYouPage() {
  return (
    <Container className="max-w-2xl py-16 sm:py-20">
      <div className="text-center">
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
          Nice — you&apos;re all set!
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          Your request is in. Here&apos;s exactly what happens next:
        </p>
      </div>

      <ol className="mt-10 space-y-5">
        {NEXT_STEPS.map((s, i) => (
          <li
            key={s.title}
            className="flex gap-4 rounded-2xl border border-ink-200 bg-white p-5"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-600 font-display text-base font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-ink-900">{s.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-ink-600">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-10 rounded-2xl bg-ink-50 p-5 text-center text-sm text-ink-600">
        <p>
          📞 <span className="font-semibold text-ink-800">Heads up:</span> answering that
          first call is the fastest path to your quote. If you miss it, no stress — they&apos;ll
          leave a message or text.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/" variant="secondary">
          Back to home
        </ButtonLink>
        {SITE.phoneEnabled && (
          <a href={SITE.phoneHref} className="font-semibold text-brand-700 hover:text-brand-800">
            Questions? Call {SITE.phone}
          </a>
        )}
      </div>
    </Container>
  );
}
