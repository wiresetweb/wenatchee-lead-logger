import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { GUIDES } from "@/content/guides";
import { fmtMoney } from "@/lib/local";
import { Container } from "@/components/ui";
import { CtaBand } from "@/components/sections";

export const metadata: Metadata = pageMeta({
  title: "Electrical cost guides",
  description: `Honest, local cost guides for electrical work in ${SITE.regionShort} — panel upgrades, EV chargers, rewiring, generators, and more.`,
  path: "/guides",
});

export default function GuidesHubPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Electrical cost guides
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            Real, local price ranges for common electrical projects in {SITE.regionName} —
            so you know what to expect before you get a quote.
          </p>
        </Container>
      </section>

      <Container className="py-12">
        <div className="grid gap-5 sm:grid-cols-2">
          {GUIDES.map((g) => (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="group rounded-2xl border border-ink-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-brand-300 hover:shadow-lg"
            >
              <p className="text-sm font-semibold text-brand-700">
                {fmtMoney(g.costLow)} – {fmtMoney(g.costHigh)}
              </p>
              <h2 className="mt-1 font-display text-lg font-bold text-ink-900 group-hover:text-brand-700">
                {g.title}
              </h2>
              <p className="mt-2 text-sm text-ink-600">{g.summary}</p>
            </Link>
          ))}
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
