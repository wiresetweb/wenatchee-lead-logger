import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";
import { ServiceGrid, CtaBand } from "@/components/sections";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = pageMeta({
  title: "Electrical services",
  description: `Browse the electrical services we connect ${SITE.regionShort} homeowners with — panel upgrades, EV chargers, repairs, generators, rewiring, and more.`,
  path: "/services",
});

export default function ServicesHubPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden bg-ink-900">
        <Photo
          name="doorknob-install"
          alt="A pro's hands at work with a compact driver"
          priority
          sizes="100vw"
          className="absolute inset-0 -z-10 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-ink-950/70 to-ink-950/80" />
        <Container className="max-w-2xl py-16 text-center sm:py-20">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-5xl">
            Whatever the job, we know the pro
          </h1>
          <p className="mt-4 text-lg text-ink-100">
            Quick repair or whole-home rewire — pick your project and we&apos;ll match you
            with a local electrician in {SITE.regionShort} who does it every day.
          </p>
        </Container>
      </section>
      <ServiceGrid heading="All services" />
      <CtaBand />
    </>
  );
}
