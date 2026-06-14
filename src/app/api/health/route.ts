import { NextResponse } from "next/server";
import { getServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

/**
 * Diagnostic endpoint: confirms the server can reach Supabase with the configured
 * service-role credentials. Returns NO secrets — only presence/length and a sanitized
 * result — so it's safe to hit in the browser to debug env/connection issues.
 *   GET /api/health
 */
export async function GET() {
  const rawUrl = process.env.SUPABASE_URL;
  const rawKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  // Presence-only (never the value): lets us confirm which env vars survived a deploy.
  // Cloudflare wipes plain-text dashboard Variables on every `wrangler deploy` — only
  // Secrets and wrangler.jsonc `vars` persist. A `false` here after a deploy means that
  // var was a plain-text Variable and needs to be re-added as a Secret (or to `vars`).
  const present = (v: string | undefined) => Boolean(v && v.trim());

  const env = {
    SUPABASE_URL_present: Boolean(rawUrl),
    SUPABASE_URL_length: rawUrl?.length ?? 0,
    SUPABASE_URL_hasWhitespace: rawUrl ? rawUrl !== rawUrl.trim() : false,
    SERVICE_KEY_present: Boolean(rawKey),
    SERVICE_KEY_length: rawKey?.length ?? 0,
    SERVICE_KEY_hasWhitespace: rawKey ? rawKey !== rawKey.trim() : false,
    // Feature config — presence only.
    MAPBOX_TOKEN_present: present(process.env.MAPBOX_TOKEN),
    RESEND_API_KEY_present: present(process.env.RESEND_API_KEY),
    EMAIL_FROM_present: present(process.env.EMAIL_FROM),
    OWNER_NOTIFY_EMAIL: process.env.OWNER_NOTIFY_EMAIL?.trim() || null,
    TURNSTILE_SECRET_present: present(process.env.TURNSTILE_SECRET_KEY),
    TWILIO_present: present(process.env.TWILIO_ACCOUNT_SID) && present(process.env.TWILIO_AUTH_TOKEN),
  };

  const supabase = getServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { ok: false, db: "client_not_configured", env },
      { status: 200 },
    );
  }

  try {
    const { error } = await supabase
      .from("leads")
      .select("id", { count: "exact", head: true });
    if (error) {
      return NextResponse.json({ ok: false, db: "query_error", error: error.message, env });
    }
    return NextResponse.json({ ok: true, db: "connected", env });
  } catch (err) {
    return NextResponse.json({
      ok: false,
      db: "threw",
      error: err instanceof Error ? `${err.name}: ${err.message}` : String(err),
      env,
    });
  }
}
