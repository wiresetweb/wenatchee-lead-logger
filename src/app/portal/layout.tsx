import Link from "next/link";
import type { Metadata } from "next";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { signOutAction } from "@/lib/portal-actions";

export const metadata: Metadata = {
  title: "Contractor portal",
  robots: { index: false, follow: false },
};

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated (the login page) renders bare — it has its own full-screen UI.
  if (!user) return <>{children}</>;

  const { data: membership } = await supabase
    .from("buyer_users")
    .select("buyers(name)")
    .limit(1)
    .maybeSingle<{ buyers: { name: string } | null }>();
  const buyerName = membership?.buyers?.name ?? user.email ?? "Partner";

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3 sm:px-6">
          <Link href="/portal" className="font-display text-base font-bold tracking-tight text-ink-900">
            Cascade <span className="text-brand-600">Home Connect</span>
            <span className="ml-2 rounded bg-ink-100 px-1.5 py-0.5 text-xs font-medium text-ink-500">
              Portal
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-600 sm:inline">{buyerName}</span>
            <form action={signOutAction}>
              <button
                type="submit"
                className="text-sm font-medium text-ink-600 hover:text-brand-700"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6">{children}</main>
    </div>
  );
}
