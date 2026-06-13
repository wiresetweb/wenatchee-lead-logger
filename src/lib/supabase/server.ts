import "server-only";

/**
 * Server-side Supabase client using the service-role key. NEVER import this into a
 * client component — the service role bypasses RLS and must stay server-only.
 *
 * Returns null when env isn't configured yet, so the app (and the quote form) still
 * runs locally before Supabase is provisioned. See docs/DATA_MODEL.md.
 */

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { getCloudflareContext } from "@opennextjs/cloudflare";

/**
 * Read a secret from process.env, falling back to the Cloudflare env binding
 * (OpenNext doesn't always mirror dashboard secrets into process.env). Crucially,
 * `.trim()` the value: a trailing newline/space pasted into the dashboard makes the
 * Supabase request throw an "invalid header/URL" error on the Workers runtime.
 */
function readSecret(name: string): string | undefined {
  let val: string | undefined = process.env[name];
  if (!val) {
    try {
      const env = getCloudflareContext().env as Record<string, string | undefined>;
      val = env?.[name];
    } catch {
      /* not running on the Workers runtime */
    }
  }
  return typeof val === "string" && val.trim() ? val.trim() : undefined;
}

let cached: SupabaseClient | null = null;

export function getServiceClient(): SupabaseClient | null {
  if (cached) return cached;

  const url = readSecret("SUPABASE_URL");
  const serviceKey = readSecret("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !serviceKey) return null;

  cached = createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function isSupabaseConfigured(): boolean {
  return Boolean(readSecret("SUPABASE_URL") && readSecret("SUPABASE_SERVICE_ROLE_KEY"));
}
