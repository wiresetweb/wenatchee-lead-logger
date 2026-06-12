import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { CityGrid, CtaBand } from "@/components/sections";

export const metadata: Metadata = pageMeta({
  title: "Service area",
  description: `Cascade Home Connect serves Wenatchee, East Wenatchee, Cashmere, Leavenworth, Chelan, and the surrounding ${SITE.regionShort} communities.`,
  path: "/locations",
});

export default function LocationsHubPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            Where we work
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            Based in Wenatchee, we connect homeowners across the valley — in Chelan, Douglas,
            and Grant counties — with trusted local pros.
          </p>
        </Container>
      </section>
      <CityGrid heading="Communities we serve" />
      <CtaBand />
    </>
  );
}
