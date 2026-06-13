"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/browser";
import { Button } from "@/components/ui";

function Form({ defaultNext, allowPrefix }: { defaultNext: string; allowPrefix: string }) {
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
    router.push(next && next.startsWith(allowPrefix) ? next : defaultNext);
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

export function AuthLoginForm({
  defaultNext,
  allowPrefix,
}: {
  defaultNext: string;
  allowPrefix: string;
}) {
  return (
    <Suspense fallback={<p className="text-sm text-ink-500">Loading…</p>}>
      <Form defaultNext={defaultNext} allowPrefix={allowPrefix} />
    </Suspense>
  );
}
