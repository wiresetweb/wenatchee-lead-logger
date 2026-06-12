import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { ServiceGrid, CtaBand } from "@/components/sections";

export const metadata: Metadata = pageMeta({
  title: "Electrical services",
  description: `Browse the electrical services we connect ${SITE.regionShort} homeowners with — panel upgrades, EV chargers, repairs, generators, rewiring, and more.`,
  path: "/services",
});

export default function ServicesHubPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Electrical services in {SITE.regionShort}
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            We connect you with trusted local electricians for everything from a quick repair
            to a whole-home rewire. Pick a service to learn more, or get a free quote.
          </p>
        </Container>
      </section>
      <ServiceGrid heading="All services" />
      <CtaBand />
    </>
  );
}
