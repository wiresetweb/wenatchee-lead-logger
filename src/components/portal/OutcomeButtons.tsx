"use client";

import { useState, useTransition } from "react";
import { updateOutcomeAction } from "@/lib/portal-actions";

const OPTIONS = [
  { value: "contacted", label: "Contacted" },
  { value: "quoted", label: "Quoted" },
  { value: "won", label: "Won" },
  { value: "lost", label: "Lost" },
] as const;

export function OutcomeButtons({
  deliveryId,
  current,
}: {
  deliveryId: string;
  current: string | null;
}) {
  const [selected, setSelected] = useState(current);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function choose(value: (typeof OPTIONS)[number]["value"]) {
    const prev = selected;
    setSelected(value);
    setError("");
    startTransition(async () => {
      const res = await updateOutcomeAction(deliveryId, value);
      if (!res.ok) {
        setSelected(prev);
        setError(res.message ?? "Could not save.");
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {OPTIONS.map((o) => (
          <button
            key={o.value}
            type="button"
            disabled={pending}
            onClick={() => choose(o.value)}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${
              selected === o.value
                ? "border-brand-600 bg-brand-600 text-white"
                : "border-ink-200 bg-white text-ink-700 hover:border-brand-300"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
}
