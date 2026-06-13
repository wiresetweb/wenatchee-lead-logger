"use server";

/** Server actions for the buyer portal: sign out + record lead outcomes. */

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAuthClient } from "./supabase/server-auth";

export async function signOutAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/portal/login");
}

const VALID_OUTCOMES = ["contacted", "quoted", "won", "lost"] as const;
type Outcome = (typeof VALID_OUTCOMES)[number];

/**
 * Buyer marks what happened with a delivered lead. RLS ensures a buyer can only
 * update their own deliveries. Setting "contacted" also stamps contacted_at (used
 * to monitor the same-day SLA — docs/COMPLIANCE.md §6).
 */
export async function updateOutcomeAction(
  deliveryId: string,
  outcome: Outcome,
): Promise<{ ok: boolean; message?: string }> {
  if (!VALID_OUTCOMES.includes(outcome)) {
    return { ok: false, message: "Invalid outcome." };
  }
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, message: "Not signed in." };

  const patch: Record<string, unknown> = { outcome };
  if (outcome === "contacted") patch.contacted_at = new Date().toISOString();

  const { error } = await supabase
    .from("lead_deliveries")
    .update(patch)
    .eq("id", deliveryId);
  if (error) {
    console.error("[portal] outcome update failed:", error.message);
    return { ok: false, message: "Could not save. Please try again." };
  }
  revalidatePath("/portal");
  revalidatePath(`/portal/leads/${deliveryId}`);
  return { ok: true };
}
