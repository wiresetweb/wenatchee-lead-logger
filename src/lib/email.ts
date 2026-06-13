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
  const rows: [string, string][] = [
    ["Name", lead.fullName],
    ["Phone", lead.phone],
    ["Email", lead.email],
    ["City", lead.city],
    ["Service", lead.serviceType],
    ["Timeline", lead.timeline ? (TIMELINE_LABEL[lead.timeline] ?? lead.timeline) : "—"],
    ["Project", lead.projectDetails || "—"],
    ["Occupancy", lead.ownerStatus ?? "Unverified"],
    ["Lead grade", lead.grade ? `${lead.grade} (score ${lead.score ?? "—"})` : "—"],
    ["Area median income (est.)", money(lead.areaIncome)],
  ];

  const subject = `New ${lead.grade ?? ""} lead: ${lead.serviceType} in ${lead.city}`;
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

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
