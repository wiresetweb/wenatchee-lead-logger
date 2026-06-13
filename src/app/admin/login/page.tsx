import { AuthLoginForm } from "@/components/AuthLoginForm";

export const metadata = { robots: { index: false, follow: false } };

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-900 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-display text-xl font-bold tracking-tight text-white">
            Cascade <span className="text-brand-400">Home Connect</span>
          </div>
          <p className="mt-1 text-sm text-ink-400">Admin</p>
        </div>
        <div className="rounded-2xl border border-ink-700 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-5 font-display text-xl font-bold text-ink-900">Admin sign in</h1>
          <AuthLoginForm defaultNext="/admin" allowPrefix="/admin" />
        </div>
      </div>
    </div>
  );
}
