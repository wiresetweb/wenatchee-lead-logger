import type { Metadata } from "next";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container, H2, Lead, Card, ButtonLink } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "Contact",
  description: `Get in touch with Cascade Home Connect — homeowners requesting a quote and contractors interested in partnering.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <Container className="max-w-4xl py-14 sm:py-20">
      <div className="text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Get in touch
        </h1>
        <Lead className="mx-auto mt-3 max-w-xl">
          Whether you&apos;re a homeowner looking for a quote or a contractor who wants leads,
          we&apos;d love to hear from you.
        </Lead>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <H2 className="!text-2xl">Homeowners</H2>
          <p className="mt-3 text-ink-600">
            The fastest way to get help is to request a free quote — it takes under a minute
            and we&apos;ll match you with a local pro the same day.
          </p>
          <div className="mt-6">
            <ButtonLink href="/get-quote">Get a free quote</ButtonLink>
          </div>
        </Card>

        <Card>
          <H2 className="!text-2xl">Contractors</H2>
          <p className="mt-3 text-ink-600">
            Interested in receiving local, enriched leads? Reach out and we&apos;ll get you set
            up — your first leads are on us.
          </p>
          <div className="mt-6 space-y-2 text-ink-800">
            <p>
              <span className="font-semibold">Email:</span>{" "}
              <a href={`mailto:${SITE.email}`} className="text-brand-700 hover:underline">
                {SITE.email}
              </a>
            </p>
            <p>
              <span className="font-semibold">Phone:</span>{" "}
              <a href={SITE.phoneHref} className="text-brand-700 hover:underline">
                {SITE.phone}
              </a>
            </p>
          </div>
        </Card>
      </div>
    </Container>
  );
}
