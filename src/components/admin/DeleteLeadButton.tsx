"use client";

/**
 * Delete-lead control for the admin views. Confirms, calls the admin-only
 * `deleteLeadAction`, then either refreshes the list or navigates away (detail page).
 */

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteLeadAction } from "@/lib/admin-actions";

export function DeleteLeadButton({
  id,
  name,
  redirectTo,
  className,
  label = "Delete",
}: {
  id: string;
  name?: string;
  /** When set, navigate here after deleting (use on the detail page). */
  redirectTo?: string;
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!window.confirm(`Delete ${name ? `“${name}”` : "this lead"}? This can't be undone.`)) {
      return;
    }
    setError(null);
    startTransition(async () => {
      const res = await deleteLeadAction(id);
      if (!res.ok) {
        setError(res.error ?? "Delete failed.");
        return;
      }
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={
          className ??
          "text-sm font-medium text-red-600 hover:text-red-700 disabled:opacity-50"
        }
      >
        {pending ? "Deleting…" : label}
      </button>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </span>
  );
}
