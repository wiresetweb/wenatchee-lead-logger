"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    const next = params.get("next");
    router.push(next && next.startsWith("/portal") ? next : "/portal");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-800">Email</span>
        <input
          type="email"
          autoComplete="email"
          className="form-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-ink-800">Password</span>
        <input
          type="password"
          autoComplete="current-password"
          className="form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>
      {error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}

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
          <Suspense fallback={<p className="text-sm text-ink-500">Loading…</p>}>
            <LoginForm />
          </Suspense>
        </div>
        <p className="mt-5 text-center text-xs text-ink-500">
          Need access? Contact us to get set up as a partner.
        </p>
      </div>
    </div>
  );
}
