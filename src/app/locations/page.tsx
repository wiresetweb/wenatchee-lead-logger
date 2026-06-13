import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { CityGrid, CtaBand } from "@/components/sections";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = pageMeta({
  title: "Service area",
  description: `Cascade Home Connect serves Wenatchee, East Wenatchee, Cashmere, Leavenworth, Chelan, and the surrounding ${SITE.regionShort} communities.`,
  path: "/locations",
});

export default function LocationsHubPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="enchantments"
          alt="An alpine lake in the Enchantments above Leavenworth"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover object-[50%_60%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-ink-950/80 via-ink-950/40 to-ink-950/30" />
        <Container className="flex min-h-[320px] max-w-2xl flex-col items-center justify-end pb-12 pt-24 text-center sm:min-h-[380px]">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            This valley is home
          </h1>
          <p className="mt-4 text-lg text-ink-100">
            From downtown Wenatchee to the trailheads above Leavenworth — we connect
            homeowners across Chelan, Douglas, and Grant counties with pros who live and
            work right here.
          </p>
        </Container>
      </section>
      <CityGrid heading="Communities we serve" />
      <CtaBand />
    </>
  );
}
