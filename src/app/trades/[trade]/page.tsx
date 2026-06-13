import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE } from "@/lib/site";
import { COMING_SOON_TRADES, getTrade } from "@/content/trades";
import { Container, ButtonLink } from "@/components/ui";

export function generateStaticParams() {
  return COMING_SOON_TRADES.map((t) => ({ trade: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string }>;
}): Promise<Metadata> {
  const { trade } = await params;
  const t = getTrade(trade);
  if (!t) return {};
  return {
    title: `${t.name} — Coming soon | ${SITE.name}`,
    description: `${t.name} services are coming soon to ${SITE.regionShort}. We're adding ${t.proPlural} to our network of trusted local pros.`,
    // Don't index placeholder pages for services we can't fulfill yet.
    robots: { index: false, follow: true },
  };
}

export default async function ComingSoonTradePage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = await params;
  const t = getTrade(trade);
  if (!t || t.status !== "coming_soon") notFound();

  return (
    <Container className="max-w-2xl py-20 text-center">
      <span className="inline-flex items-center rounded-full bg-ink-100 px-3 py-1 text-sm font-semibold text-ink-500">
        Coming soon
      </span>
      <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        {t.name} in the {SITE.regionShort}
      </h1>
      <p className="mt-4 text-lg text-ink-600">
        We&apos;re expanding! Soon you&apos;ll be able to get matched with trusted local{" "}
        {t.proPlural} for {t.examples.slice(0, 3).join(", ").toLowerCase()}, and more — the
        same free, no-hassle way we connect homeowners with electricians today.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {t.examples.map((e) => (
          <span
            key={e}
            className="rounded-full border border-ink-200 bg-white px-4 py-2 text-sm font-medium text-ink-600"
          >
            {e}
          </span>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-brand-200 bg-brand-50 p-6">
        <p className="font-display text-lg font-bold text-ink-900">
          Need an electrician right now?
        </p>
        <p className="mt-2 text-ink-600">
          Electrical is live today — get matched with a trusted local electrician in minutes.
        </p>
        <div className="mt-5">
          <ButtonLink href="/electricians" size="lg">
            Find an electrician
          </ButtonLink>
        </div>
      </div>

      <p className="mt-8 text-sm text-ink-500">
        Are you a {t.pro} who wants local leads?{" "}
        <a href="/for-contractors" className="font-medium text-brand-700 hover:underline">
          Partner with us
        </a>
        .
      </p>
    </Container>
  );
}
