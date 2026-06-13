"use client";

/**
 * Sticky bottom CTA bar on mobile — the single biggest conversion surface for
 * local-service sites. Hidden on routes where it would compete with the form.
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SITE } from "@/lib/site";

const HIDDEN_ON = ["/get-quote", "/thank-you"];

export function MobileCtaBar() {
  const pathname = usePathname();
  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-ink-200 bg-white/95 p-3 backdrop-blur lg:hidden [padding-bottom:max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="mx-auto flex max-w-md gap-3">
        <a
          href={SITE.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-ink-300 px-4 py-3 text-sm font-semibold text-ink-800"
        >
          <PhoneIcon /> Call now
        </a>
        <Link
          href="/get-quote"
          className="flex flex-[1.4] items-center justify-center rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm"
        >
          Get my free quote →
        </Link>
      </div>
    </div>
  );
}

function PhoneIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
