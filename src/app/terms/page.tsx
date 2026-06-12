import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";

export const metadata: Metadata = pageMeta({
  title: "Terms of service",
  description: `The terms that govern your use of ${SITE.name}.`,
  path: "/terms",
});

// NOTE: Plain-language draft for development. Have an attorney review before launch
// (see docs/COMPLIANCE.md §3).
const updated = "June 12, 2026";

export default function TermsPage() {
  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        Terms of Service
      </h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: {updated}</p>

      <div className="mt-8 space-y-6 text-ink-700 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-900 [&_a]:text-brand-700 [&_a]:underline">
        <p>
          These Terms of Service (&quot;Terms&quot;) govern your use of {SITE.domain} (the
          &quot;Site&quot;), operated by {SITE.parentCompany}. By using the Site, you agree to
          these Terms.
        </p>

        <h2>Our service</h2>
        <p>
          {SITE.name} is a free referral service that connects homeowners with independent,
          third-party service providers. We are not a contractor, we do not perform any work,
          and we are not a party to any agreement you enter into with a service provider.
        </p>

        <h2>No guarantee; your responsibility</h2>
        <p>
          We do not guarantee the quality, licensing, insurance, pricing, availability, or
          outcome of any service provider&apos;s work. You are responsible for evaluating any
          provider before hiring them, including verifying licensing and insurance, and for any
          agreement you make with them. Any dispute about the work is between you and the
          provider.
        </p>

        <h2>Information you provide</h2>
        <p>
          You agree that the information you submit is accurate and that you are authorized to
          provide it and to consent to be contacted as described in our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {SITE.parentCompany} is not liable for any
          indirect, incidental, or consequential damages arising from your use of the Site or
          from your dealings with any service provider. The Site is provided &quot;as is&quot;
          without warranties of any kind.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these Terms from time to time. Continued use of the Site after changes
          take effect constitutes acceptance of the updated Terms.
        </p>

        <h2>Contact</h2>
        <p>
          Questions? Email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>
      </div>
    </Container>
  );
}
