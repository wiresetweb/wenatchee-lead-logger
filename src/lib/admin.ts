import "server-only";

/**
 * Admin access control. An admin is a Supabase-authenticated user whose email is in
 * the ADMIN_EMAILS allowlist (comma-separated). Fails CLOSED: if the env is unset or
 * the user isn't listed, access is denied. Admin pages then read via the service-role
 * client (bypasses RLS) to see everything — but only after this gate passes.
 */
import type { SupabaseClient } from "@supabase/supabase-js";
import { createAuthClient } from "./supabase/server-auth";
import { getServiceClient } from "./supabase/server";

export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export async function getAdminEmail(): Promise<string | null> {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const email = user?.email?.toLowerCase();
  if (!email) return null;
  return adminEmails().includes(email) ? email : null;
}

/**
 * Returns the service-role client for admin pages, but only after confirming the
 * caller is an allowlisted admin. Returns null when not an admin (layout shows the
 * denied screen) or when the service-role key isn't configured.
 */
export async function getAdminServiceClient(): Promise<SupabaseClient | null> {
  const email = await getAdminEmail();
  if (!email) return null;
  return getServiceClient();
}
