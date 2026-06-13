import Link from "next/link";
import { TRADES } from "@/content/trades";
import { Container, H2, Lead } from "@/components/ui";

const ICONS: Record<string, string> = {
  bolt: "M13 2L4.5 13.5h6L9.5 22 19 10h-6l1-8z",
  drop: "M12 3s6 6.5 6 11a6 6 0 11-12 0c0-4.5 6-11 6-11z",
  thermometer: "M14 14.76V5a2 2 0 10-4 0v9.76a4 4 0 104 0z",
  home: "M3 11l9-8 9 8M5 10v10h14V10",
  leaf: "M4 20c0-8 6-14 16-14 0 10-6 16-16 14zm0 0c2-4 5-7 9-9",
};

export function TradeSelector({
  heading = "What do you need help with?",
  subhead = "Pick a service and we'll match you with a trusted local pro. More trades are on the way.",
}: {
  heading?: string;
  subhead?: string;
}) {
  return (
    <section id="choose" className="bg-white py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <H2>{heading}</H2>
          <Lead className="mt-3">{subhead}</Lead>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TRADES.map((t) => {
            const live = t.status === "live";
            return (
              <Link
                key={t.slug}
                href={t.href}
                className={`group relative flex flex-col rounded-2xl border p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg ${
                  live
                    ? "border-brand-200 bg-white hover:border-brand-400"
                    : "border-ink-200 bg-ink-50/60 hover:border-ink-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl ${
                      live
                        ? "bg-brand-600 text-white"
                        : "bg-ink-200 text-ink-500"
                    }`}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d={ICONS[t.icon] ?? ICONS.bolt}
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  {live ? (
                    <span className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 ring-1 ring-inset ring-brand-200">
                      Available now
                    </span>
                  ) : (
                    <span className="rounded-full bg-ink-100 px-2.5 py-1 text-xs font-semibold text-ink-500">
                      Coming soon
                    </span>
                  )}
                </div>

                <h3
                  className={`mt-4 font-display text-xl font-bold ${
                    live ? "text-ink-900 group-hover:text-brand-700" : "text-ink-700"
                  }`}
                >
                  {t.name}
                </h3>
                <p className="mt-1 text-sm text-ink-600">{t.tagline}</p>

                <span
                  className={`mt-4 inline-flex items-center gap-1 text-sm font-semibold ${
                    live ? "text-brand-700" : "text-ink-400"
                  }`}
                >
                  {live ? "Get a free quote" : "Learn more"}
                  <span className="transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
