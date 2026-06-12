/**
 * TCPA consent + the "same-day contact" promise logic.
 * See docs/COMPLIANCE.md §2 (consent) and §6 (same-day guardrail).
 *
 * The exact consent string shown to the user MUST be stored with every lead, so it
 * is exported here as the single source of truth and versioned.
 */

import { SITE } from "./site";

export const CONSENT_VERSION = "2026-06-12";

/** The exact TCPA consent disclosure rendered next to the submit button. */
export const CONSENT_TEXT =
  `By submitting, I agree that ${SITE.parentCompany} and the service provider(s) it ` +
  `connects me with may call, text, and email me (including via automated technology ` +
  `and prerecorded messages) at the number and address provided about my request, even ` +
  `if it is on a Do-Not-Call list. Consent is not a condition of purchase. Message and ` +
  `data rates may apply. I can opt out at any time. See the Privacy Policy and Terms.`;

/**
 * Same-day promise wording. Before the cutoff hour we promise same-day contact;
 * after it we fall back to "next business day" to keep the claim truthful.
 * Pass a Date for testing; defaults to now.
 */
export function sameDayContactLine(now: Date = new Date()): string {
  const beforeCutoff = now.getHours() < SITE.sameDayCutoffHour;
  return beforeCutoff
    ? "A trusted local pro will reach out the same day."
    : "A trusted local pro will reach out the next business day.";
}

/** Short badge variant of the promise. */
export function sameDayBadge(now: Date = new Date()): string {
  return now.getHours() < SITE.sameDayCutoffHour
    ? "Same-day callback"
    : "Next-business-day callback";
}
