import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { TrustBar } from "@/components/sections";
import { QuoteForm } from "@/components/QuoteForm";

export const metadata: Metadata = pageMeta({
  title: "Get a free quote",
  description: `Request a free, no-obligation quote and get matched with a trusted local pro in ${SITE.regionShort}. Takes under a minute.`,
  path: "/get-quote",
});

export default function GetQuotePage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Get your free quote
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            Answer a few quick questions and we&apos;ll match you with a trusted local pro.
            It&apos;s free, with no obligation.
          </p>
        </Container>
      </section>
      <Container className="max-w-2xl py-10">
        <QuoteForm />
      </Container>
      <TrustBar />
    </>
  );
}
