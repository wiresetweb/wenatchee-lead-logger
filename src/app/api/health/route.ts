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

  const env = {
    SUPABASE_URL_present: Boolean(rawUrl),
    SUPABASE_URL_length: rawUrl?.length ?? 0,
    SUPABASE_URL_hasWhitespace: rawUrl ? rawUrl !== rawUrl.trim() : false,
    SERVICE_KEY_present: Boolean(rawKey),
    SERVICE_KEY_length: rawKey?.length ?? 0,
    SERVICE_KEY_hasWhitespace: rawKey ? rawKey !== rawKey.trim() : false,
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
