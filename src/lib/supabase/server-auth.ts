import "server-only";

/**
 * Cookie-based Supabase client for Server Components / actions in the buyer portal.
 * Runs as the LOGGED-IN buyer user, so all reads are RLS-scoped to their own leads
 * (see docs/DATA_MODEL.md §4). Distinct from supabase/server.ts, which uses the
 * service-role key for lead intake/enrichment.
 */
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./config";

export async function createAuthClient() {
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Called from a Server Component (read-only cookies) — the middleware
          // refreshes the session cookie instead, so this is safe to ignore.
        }
      },
    },
  });
}
