import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { pageMeta } from "@/lib/seo";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  ...pageMeta({
    title: "Privacy policy",
    description: `How Cascade Home Connect collects, uses, enriches, and shares the information you provide.`,
    path: "/privacy",
  }),
};

// NOTE: Plain-language draft for development. Have an attorney review before launch
// (see docs/COMPLIANCE.md §3).
const updated = "June 12, 2026";

export default function PrivacyPage() {
  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
        Privacy Policy
      </h1>
      <p className="mt-2 text-sm text-ink-500">Last updated: {updated}</p>

      <div className="mt-8 space-y-6 text-ink-700 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-ink-900 [&_a]:text-brand-700 [&_a]:underline">
        <p>
          This Privacy Policy explains how {SITE.name}, operated by {SITE.parentCompany}{" "}
          (&quot;we,&quot; &quot;us&quot;), collects, uses, and shares information when you use{" "}
          {SITE.domain} (the &quot;Site&quot;). By using the Site or submitting a request, you
          agree to this policy.
        </p>

        <h2>Who we are</h2>
        <p>
          {SITE.name} is a free referral service that connects homeowners with independent,
          local service providers. We are not a contractor and do not perform the work.
        </p>

        <h2>Information we collect</h2>
        <p>
          When you request a quote, we collect the information you provide — such as your name,
          phone number, email, address or city, and details about your project. We also
          automatically collect technical information such as your IP address, browser/user
          agent, the pages you visit, and marketing attribution (for example, UTM parameters)
          through analytics and similar technologies.
        </p>

        <h2>How we use information</h2>
        <p>
          We use your information to match you with one or more service providers, to operate
          and improve the Site, and to communicate with you about your request. To help
          providers serve you better, we may enrich your request with information from
          third-party and public sources — for example, estimated property characteristics and
          area demographics. Any such estimates are modeled and provided for marketing and
          matching purposes only.
        </p>

        <h2>How we share information</h2>
        <p>
          When you submit a request, we share it — along with any enrichment — with one or more
          independent service providers who may contact you about your project. We may also
          share information with service vendors who help us operate the Site. We do not sell
          your information for purposes unrelated to connecting you with a service provider.
        </p>

        <h2>Communications and consent</h2>
        <p>
          By submitting a request, you consent to be contacted by us and by the service
          provider(s) we match you with, by phone, text, and email (including via automated
          technology and prerecorded messages), at the contact information you provide, even if
          it is listed on a Do-Not-Call registry. Consent is not a condition of any purchase.
          You can opt out at any time by replying STOP to texts, unsubscribing from emails, or
          contacting us at{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
        </p>

        <h2>Not a consumer report</h2>
        <p>
          Information provided through the Site, including any enrichment, is for marketing and
          matching purposes only. It may not be used to determine eligibility for credit,
          insurance, employment, housing, or any other purpose governed by the Fair Credit
          Reporting Act (FCRA).
        </p>

        <h2>Your choices</h2>
        <p>
          You may request access to, correction of, or deletion of your information by
          contacting us at <a href={`mailto:${SITE.email}`}>{SITE.email}</a>. We retain
          information only as long as needed for the purposes described here.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email{" "}
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or see our{" "}
          <Link href="/terms">Terms of Service</Link>.
        </p>
      </div>
    </Container>
  );
}
