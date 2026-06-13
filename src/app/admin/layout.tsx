import Link from "next/link";
import type { Metadata } from "next";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { adminEmails } from "@/lib/admin";
import { signOutAdminAction } from "@/lib/admin-actions";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/leads", label: "Leads" },
  { href: "/admin/buyers", label: "Buyers" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createAuthClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated (login page) renders bare.
  if (!user) return <>{children}</>;

  const email = user.email?.toLowerCase() ?? "";
  const isAdmin = adminEmails().includes(email);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-50 px-5 text-center">
        <h1 className="font-display text-xl font-bold text-ink-900">Not authorized</h1>
        <p className="max-w-sm text-sm text-ink-600">
          {adminEmails().length === 0
            ? "No admin emails are configured. Set the ADMIN_EMAILS environment variable."
            : `${email} isn't on the admin allowlist.`}
        </p>
        <form action={signOutAdminAction}>
          <button type="submit" className="text-sm font-medium text-brand-700 hover:underline">
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-50">
      <header className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3 sm:px-6">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-display text-base font-bold tracking-tight text-ink-900">
              Cascade <span className="text-brand-600">Admin</span>
            </Link>
            <nav className="flex items-center gap-4">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="text-sm font-medium text-ink-600 hover:text-brand-700"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-500 sm:inline">{email}</span>
            <form action={signOutAdminAction}>
              <button type="submit" className="text-sm font-medium text-ink-600 hover:text-brand-700">
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-8 sm:px-6">{children}</main>
    </div>
  );
}
