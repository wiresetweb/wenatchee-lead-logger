"use server";

import { redirect } from "next/navigation";
import { createAuthClient } from "./supabase/server-auth";

export async function signOutAdminAction() {
  const supabase = await createAuthClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
