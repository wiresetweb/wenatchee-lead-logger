import { AuthLoginForm } from "@/components/AuthLoginForm";

export default function PortalLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink-50 px-5 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <div className="font-display text-xl font-bold tracking-tight text-ink-900">
            Cascade <span className="text-brand-600">Home Connect</span>
          </div>
          <p className="mt-1 text-sm text-ink-500">Contractor portal</p>
        </div>
        <div className="rounded-2xl border border-ink-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="mb-5 font-display text-xl font-bold text-ink-900">Sign in</h1>
          <AuthLoginForm defaultNext="/portal" allowPrefix="/portal" />
        </div>
        <p className="mt-5 text-center text-xs text-ink-500">
          Need access? Contact us to get set up as a partner.
        </p>
      </div>
    </div>
  );
}
