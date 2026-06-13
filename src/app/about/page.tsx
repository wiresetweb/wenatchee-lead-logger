import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Lead } from "@/components/ui";
import { CtaBand } from "@/components/sections";
import { Photo } from "@/components/Photo";

export const metadata: Metadata = pageMeta({
  title: "About",
  description: `Cascade Home Connect is a ${SITE.regionShort} service that connects local homeowners with trusted home-service pros. Learn who we are.`,
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white py-12 sm:py-16">
        <Container className="max-w-2xl text-center">
          <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
            About Cascade Home Connect
          </h1>
          <p className="mt-3 text-lg text-ink-600">
            The friendly local way to find a trusted pro in {SITE.regionName}.
          </p>
        </Container>
      </section>

      <Container className="grid max-w-5xl items-start gap-12 py-14 sm:py-20 lg:grid-cols-[1fr_1.4fr]">
        <Photo
          name="pavers"
          alt="Craftsmen setting stone pavers by hand"
          sizes="(min-width: 1024px) 35vw, 100vw"
          className="hidden aspect-[3/4] w-full rounded-3xl object-cover shadow-xl lg:block"
        />
        <div>
        <H2>Our story</H2>
        <Lead className="mt-4">
          Finding a reliable contractor in the Wenatchee Valley shouldn&apos;t mean cold-calling
          a list of strangers and hoping someone calls back. We built Cascade Home Connect to
          make it simple: tell us what you need, and we&apos;ll connect you with a trusted local
          pro who serves your area.
        </Lead>
        <Lead className="mt-4">
          We&apos;re part of {SITE.parentCompany}, and our focus is the communities of the
          Wenatchee Valley — Wenatchee, East Wenatchee, Cashmere, Leavenworth, Chelan, and the
          towns around them. We start with electrical work and are expanding to more home
          services over time.
        </Lead>
        <Lead className="mt-4">
          Our service is always free for homeowners, and there&apos;s never any obligation. We
          believe a good match is good for everyone — you get a fair quote without the hassle,
          and great local pros get connected with customers who need them.
        </Lead>
        </div>
      </Container>

      <CtaBand />
    </>
  );
}
