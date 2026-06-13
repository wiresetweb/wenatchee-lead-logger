"use client";

/**
 * Typeahead address field for the quote form. As the homeowner types, it queries the
 * `suggestAddresses` server action (debounced) and shows a dropdown; picking a row fills
 * street + city + ZIP at once via onSelect. Falls back to a plain text field if no
 * suggestions come back, so it never blocks manual entry.
 */

import { useEffect, useId, useRef, useState } from "react";
import { suggestAddresses, type AddressSuggestion } from "@/lib/geocode-suggest";

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
}: {
  value: string;
  onChange: (addressLine1: string) => void;
  onSelect: (s: { addressLine1: string; city: string; postalCode: string }) => void;
}) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);
  // Set right after a pick so the value-change effect doesn't immediately re-query.
  const justPicked = useRef(false);
  const boxRef = useRef<HTMLDivElement>(null);
  const listId = useId();

  // Debounced lookup whenever the typed value changes. All state updates happen inside
  // the timeout callback (never synchronously in the effect body).
  useEffect(() => {
    if (justPicked.current) {
      justPicked.current = false;
      return;
    }
    const q = value.trim();
    const t = setTimeout(async () => {
      if (q.length < 4) {
        setSuggestions([]);
        setOpen(false);
        return;
      }
      setLoading(true);
      const results = await suggestAddresses(q);
      setSuggestions(results);
      setActive(-1);
      setOpen(results.length > 0);
      setLoading(false);
    }, 280);
    return () => clearTimeout(t);
  }, [value]);

  // Close on outside click.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  function choose(s: AddressSuggestion) {
    justPicked.current = true;
    onSelect({ addressLine1: s.addressLine1, city: s.city, postalCode: s.postalCode });
    setOpen(false);
    setSuggestions([]);
    setActive(-1);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % suggestions.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(suggestions[active]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <input
        className="form-input"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        value={value}
        placeholder="Start typing your address…"
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
      />
      {loading && (
        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-ink-400">
          …
        </span>
      )}
      {open && suggestions.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-20 mt-1 max-h-64 w-full overflow-auto rounded-xl border border-ink-200 bg-white py-1 shadow-lg"
        >
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onMouseDown={(e) => {
                e.preventDefault();
                choose(s);
              }}
              className={`cursor-pointer px-3 py-2 text-sm ${
                i === active ? "bg-brand-50 text-brand-800" : "text-ink-700"
              }`}
            >
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
