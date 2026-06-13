"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createAuthClient } from "./supabase/server-auth";
import { getAdminServiceClient } from "./admin";

export async function signOutAdminAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/**
 * Permanently delete a lead and its child rows (enrichment + deliveries first, so it
 * works whether or not the FKs cascade). Admin-only — re-checks the allowlist via the
 * service client, never trusting the caller.
 */
export async function deleteLeadAction(id: string): Promise<{ ok: boolean; error?: string }> {
  if (!id) return { ok: false, error: "Missing lead id." };
  const supabase = await getAdminServiceClient();
  if (!supabase) return { ok: false, error: "Not authorized." };

  await supabase.from("lead_deliveries").delete().eq("lead_id", id);
  await supabase.from("lead_enrichment").delete().eq("lead_id", id);
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/leads");
  revalidatePath("/admin");
  return { ok: true };
}
