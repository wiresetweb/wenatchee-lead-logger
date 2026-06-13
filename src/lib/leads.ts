"use server";

/**
 * Lead intake server action. Called by the multi-step quote form.
 * Responsibilities (see docs/DATA_MODEL.md, COMPLIANCE.md):
 *  - validate input
 *  - capture consent text + timestamp + IP/user-agent (TCPA proof)
 *  - capture UTM/attribution
 *  - persist to Supabase `leads` (when configured) and enqueue enrichment (Phase 2)
 *
 * Gracefully no-ops persistence when Supabase isn't configured yet, so the form is
 * demoable before the backend exists — it logs a warning and still returns success.
 */

import { headers } from "next/headers";
import { z } from "zod";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getServiceClient } from "./supabase/server";
import { CONSENT_TEXT, CONSENT_VERSION } from "./consent";
import { enrichLead } from "./enrichment";
import { verifyTurnstile } from "./turnstile";

const leadSchema = z.object({
  serviceType: z.string().min(1, "Please choose a service."),
  trade: z.string().default("electrical"),
  projectDetails: z.string().max(2000).optional().default(""),
  timeline: z.enum(["asap", "this_month", "researching"]).optional(),
  fullName: z.string().min(2, "Please enter your name.").max(120),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number.")
    .max(20)
    .regex(/[\d().+\-\s]+/, "Please enter a valid phone number."),
  email: z.string().email("Please enter a valid email.").max(160),
  addressLine1: z.string().max(200).optional().default(""),
  city: z.string().min(2, "Please enter your city.").max(80),
  postalCode: z.string().max(12).optional().default(""),
  consent: z.literal(true, { message: "Consent is required to continue." }),
  // Honeypot — must be empty. Bots fill it.
  company: z.string().max(0).optional().default(""),
  // Cloudflare Turnstile token (verified server-side when configured).
  turnstileToken: z.string().optional(),
  // Attribution (hidden fields)
  utmSource: z.string().optional(),
  utmMedium: z.string().optional(),
  utmCampaign: z.string().optional(),
  utmTerm: z.string().optional(),
  utmContent: z.string().optional(),
  landingPage: z.string().optional(),
});

export type LeadInput = z.input<typeof leadSchema>;

export interface LeadResult {
  ok: boolean;
  /** Field-level errors keyed by field name. */
  errors?: Record<string, string>;
  /** General message (e.g. server error). */
  message?: string;
}

function normalizePhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  return raw.trim();
}

export async function submitLead(input: LeadInput): Promise<LeadResult> {
  const parsed = leadSchema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      if (!errors[key]) errors[key] = issue.message;
    }
    return { ok: false, errors };
  }

  const data = parsed.data;

  // Honeypot tripped → silently accept (don't tip off the bot), persist nothing.
  if (data.company && data.company.length > 0) {
    return { ok: true };
  }

  const hdrs = await headers();
  const ip =
    hdrs.get("cf-connecting-ip") ??
    hdrs.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    null;
  const userAgent = hdrs.get("user-agent") ?? null;

  // Anti-bot: verify Turnstile when configured (no-op otherwise).
  const humanVerified = await verifyTurnstile(data.turnstileToken, ip);
  if (!humanVerified) {
    return {
      ok: false,
      errors: { form: "Please complete the verification challenge and try again." },
    };
  }

  const row = {
    status: "new",
    trade: data.trade,
    service_type: data.serviceType,
    project_details: data.projectDetails,
    timeline: data.timeline ?? null,
    full_name: data.fullName,
    phone: normalizePhone(data.phone),
    email: data.email.toLowerCase(),
    address_line1: data.addressLine1,
    city: data.city,
    state: "WA",
    postal_code: data.postalCode,
    consent_text: CONSENT_TEXT,
    consent_version: CONSENT_VERSION,
    consent_at: new Date().toISOString(),
    ip,
    user_agent: userAgent,
    utm_source: data.utmSource ?? null,
    utm_medium: data.utmMedium ?? null,
    utm_campaign: data.utmCampaign ?? null,
    utm_term: data.utmTerm ?? null,
    utm_content: data.utmContent ?? null,
    landing_page: data.landingPage ?? null,
  };

  const supabase = getServiceClient();
  if (!supabase) {
    // Backend not provisioned yet — keep the funnel working and make it loud in logs.
    console.warn(
      "[leads] Supabase not configured; lead NOT persisted. Set SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY. Lead payload:",
      { ...row, email: "[redacted]", phone: "[redacted]" },
    );
    return { ok: true };
  }

  const { data: inserted, error } = await supabase
    .from("leads")
    .insert(row)
    .select("id")
    .single<{ id: string }>();
  if (error || !inserted) {
    console.error("[leads] insert failed:", error?.message);
    return {
      ok: false,
      message: "Something went wrong saving your request. Please try again or call us.",
    };
  }

  // Run enrichment after the response is sent — never blocks the homeowner.
  scheduleBackgroundTask(
    enrichLead(inserted.id).catch((err) =>
      console.error("[enrich] background enrichment failed:", err),
    ),
  );

  // TODO (Phase 3): notify buyer by email + record lead_deliveries.
  return { ok: true };
}

/**
 * Prefer Cloudflare's waitUntil (keeps the worker alive after the response);
 * fall back to fire-and-forget outside the Workers runtime (e.g. `next start`).
 */
function scheduleBackgroundTask(task: Promise<unknown>): void {
  try {
    getCloudflareContext().ctx.waitUntil(task);
  } catch {
    void task;
  }
}
