import "server-only";

/**
 * Transactional email via Resend's HTTP API (no SDK — Workers-friendly `fetch`).
 * Degrades gracefully: if RESEND_API_KEY is unset, it logs and returns false so
 * lead delivery still records correctly. See docs/PROJECT_PLAN.md §6.
 */

import { SITE } from "./site";

interface SendArgs {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? `Cascade Home Connect <leads@${SITE.domain}>`;
  if (!apiKey) {
    console.warn(`[email] RESEND_API_KEY not set; would have emailed ${to}: "${subject}"`);
    return false;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${apiKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html, text }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`[email] send failed (${res.status}):`, await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] send threw:", err);
    return false;
  }
}

export interface LeadEmailData {
  fullName: string;
  phone: string;
  email: string;
  city: string;
  serviceType: string;
  timeline: string | null;
  projectDetails: string | null;
  addressLine1: string | null;
  grade: string | null;
  score: number | null;
  ownerStatus: string | null;
  areaIncome: number | null;
  needFlags: string[];
  newHomeowner?: boolean | null;
  tenureYears?: number | null;
  jobTags?: string[];
  jobValueBand?: string | null;
  urgentSafety?: boolean;
  property?: {
    sqft: number | null;
    bedrooms: number | null;
    bathrooms: number | null;
    stories: number | null;
    heating: string | null;
    cooling: string | null;
  } | null;
}

/** Compact, human one-line summary of property size when any field is present. */
function propertySummary(p: LeadEmailData["property"]): string | null {
  if (!p) return null;
  const bits: string[] = [];
  if (p.sqft) bits.push(`${p.sqft.toLocaleString("en-US")} sqft`);
  if (p.bedrooms) bits.push(`${p.bedrooms} bd`);
  if (p.bathrooms) bits.push(`${p.bathrooms} ba`);
  if (p.stories) bits.push(`${p.stories} story`);
  if (p.heating) bits.push(`heat: ${p.heating}`);
  if (p.cooling) bits.push(`cooling: ${p.cooling}`);
  return bits.length ? bits.join(" · ") : null;
}

const TAG_LABEL: Record<string, string> = {
  panel_upgrade: "Panel upgrade",
  rewire: "Rewire",
  generator: "Generator",
  new_construction: "New construction / addition",
  ev_charger: "EV charger",
  subpanel: "Subpanel",
  hot_tub_circuit: "Hot tub / pool circuit",
  heat_pump_circuit: "Heat pump circuit",
  lighting: "Lighting",
  outlets_switches: "Outlets / switches",
  troubleshoot: "Troubleshooting",
  roof_replacement: "Roof replacement",
  storm_damage: "Storm damage",
  roof_repair: "Roof repair",
};

function tagLabels(tags?: string[]): string {
  if (!tags?.length) return "—";
  return tags.map((t) => TAG_LABEL[t] ?? t.replace(/_/g, " ")).join(", ");
}

const TIMELINE_LABEL: Record<string, string> = {
  asap: "As soon as possible",
  this_month: "Within a month",
  researching: "Researching",
};

/** Builds + sends the new-lead notification a buyer receives in real time. */
export async function sendBuyerLeadEmail(
  to: string,
  buyerName: string,
  lead: LeadEmailData,
  portalUrl: string,
): Promise<boolean> {
  const money = (n: number | null) =>
    n == null ? "—" : `$${n.toLocaleString("en-US")}`;
  const propSummary = propertySummary(lead.property);
  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", lead.city],
    ["Service", lead.serviceType],
    ["Job type", tagLabels(lead.jobTags)],
    ["Timeline", lead.timeline ? (TIMELINE_LABEL[lead.timeline] ?? lead.timeline) : "—"],
    ["Project", lead.projectDetails || "—"],
    ["Occupancy", lead.ownerStatus ?? "Unverified"],
    ...(lead.newHomeowner ? ([["Homeowner", "New homeowner (bought < 1 yr ago)"]] as [string, string][]) : []),
    ...(lead.tenureYears != null && !lead.newHomeowner
      ? ([["Owned for", `${lead.tenureYears} yr`]] as [string, string][])
      : []),
    ...(propSummary ? ([["Property", propSummary]] as [string, string][]) : []),
    ["Lead grade", lead.grade ? `${lead.grade} (score ${lead.score ?? "—"})` : "—"],
    ["Area median income (est.)", money(lead.areaIncome)],
  ];

  const subject = `${lead.urgentSafety ? "⚠ URGENT — " : ""}New ${lead.grade ?? ""} lead: ${lead.serviceType} in ${lead.city}`;
  const text =
    `New lead for ${buyerName}\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nContact ${lead.fullName.split(" ")[0]} the same day if possible.\n` +
    `View in your portal: ${portalUrl}`;

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px">${k}</td>` +
        `<td style="padding:6px 12px;color:#0f172a;font-size:14px;font-weight:500">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:system-ui,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#059669;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0">
      <strong style="font-size:16px">New lead — ${escapeHtml(lead.city)}</strong>
    </div>
    <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:8px 8px 16px">
      <table style="width:100%;border-collapse:collapse">${tableRows}</table>
      <div style="padding:12px">
        <a href="${portalUrl}" style="display:inline-block;background:#059669;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px">Open in portal</a>
      </div>
      <p style="padding:0 12px;color:#64748b;font-size:12px">Reach out the same day for the best chance to win the job.</p>
    </div>
  </div></body></html>`;

  return sendEmail({ to, subject, html, text });
}

/** Internal heads-up to the site owner/operator for EVERY captured lead — including
 *  rejects and leads no buyer matched — so nothing slips through. Recipient comes from
 *  OWNER_NOTIFY_EMAIL (falls back to the site contact address). */
export async function sendOwnerLeadNotification(
  lead: LeadEmailData,
  adminUrl: string,
): Promise<boolean> {
  const to = process.env.OWNER_NOTIFY_EMAIL || SITE.email;
  if (!to) return false;

  const propSummary = propertySummary(lead.property);
  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", lead.city],
    ["Address", lead.addressLine1 || "—"],
    ["Service", lead.serviceType],
    ["Job type", tagLabels(lead.jobTags)],
    ["Timeline", lead.timeline ? (TIMELINE_LABEL[lead.timeline] ?? lead.timeline) : "—"],
    ["Project", lead.projectDetails || "—"],
    ["Occupancy", lead.ownerStatus ?? "Unverified"],
    ...(propSummary ? ([["Property", propSummary]] as [string, string][]) : []),
    ["Lead grade", lead.grade ? `${lead.grade} (score ${lead.score ?? "—"})` : "—"],
  ];

  const subject = `${lead.urgentSafety ? "⚠ URGENT — " : ""}New lead (${lead.grade ?? "?"}): ${lead.serviceType} — ${lead.fullName}`;
  const text =
    `New lead captured\n\n` +
    rows.map(([k, v]) => `${k}: ${v}`).join("\n") +
    `\n\nView in admin: ${adminUrl}`;

  const tableRows = rows
    .map(
      ([k, v]) =>
        `<tr><td style="padding:6px 12px;color:#64748b;font-size:13px">${k}</td>` +
        `<td style="padding:6px 12px;color:#0f172a;font-size:14px;font-weight:500">${escapeHtml(
          v,
        )}</td></tr>`,
    )
    .join("");
  const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:system-ui,sans-serif">
  <div style="max-width:560px;margin:0 auto;padding:24px">
    <div style="background:#0f172a;color:#fff;padding:16px 20px;border-radius:12px 12px 0 0">
      <strong style="font-size:16px">New lead — ${escapeHtml(lead.serviceType)} (${escapeHtml(lead.grade ?? "?")})</strong>
    </div>
    <div style="background:#fff;border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:8px 8px 16px">
      <table style="width:100%;border-collapse:collapse">${tableRows}</table>
      <div style="padding:12px">
        <a href="${adminUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;font-size:14px">Open in admin</a>
      </div>
    </div>
  </div></body></html>`;

  return sendEmail({ to, subject, html, text });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
