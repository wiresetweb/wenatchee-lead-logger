"use client";

import Link from "next/link";
import { useState } from "react";
import { NAV, SITE } from "@/lib/site";
import { ButtonLink } from "@/components/ui";

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label={`${SITE.name} home`}>
      <span
        aria-hidden
        className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 font-display text-lg font-bold text-white"
      >
        C
      </span>
      <span className="font-display text-lg font-bold tracking-tight text-ink-900">
        Cascade <span className="text-brand-600">Home Connect</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink-200 bg-white/90 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-3 sm:px-6 lg:px-8">
        <Logo />

        <div className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-ink-700 transition-colors hover:text-brand-700"
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={SITE.phoneHref}
            className="text-sm font-semibold text-ink-800 hover:text-brand-700"
          >
            {SITE.phone}
          </a>
          <ButtonLink href="/get-quote">Get a free quote</ButtonLink>
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-ink-700 lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div className="border-t border-ink-200 bg-white lg:hidden">
          <div className="space-y-1 px-5 py-4">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-lg px-3 py-2 text-base font-medium text-ink-700 hover:bg-brand-50 hover:text-brand-700"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col gap-3 px-3 pt-3">
              <a href={SITE.phoneHref} className="text-base font-semibold text-ink-800">
                Call {SITE.phone}
              </a>
              <ButtonLink href="/get-quote" size="lg" className="w-full">
                Get a free quote
              </ButtonLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
