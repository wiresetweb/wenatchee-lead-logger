import Link from "next/link";
import { FOOTER_NAV, SITE } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-ink-200 bg-ink-50">
      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="font-display text-lg font-bold tracking-tight text-ink-900">
              Cascade <span className="text-brand-600">Home Connect</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-ink-600">
              The friendly local way to get matched with a trusted home-service pro in{" "}
              {SITE.regionName}. Always free for homeowners.
            </p>
            <p className="mt-4 text-sm font-medium text-ink-700">
              <a href={SITE.phoneHref} className="hover:text-brand-700">
                {SITE.phone}
              </a>
            </p>
          </div>

          {FOOTER_NAV.map((group) => (
            <div key={group.heading}>
              <h3 className="text-sm font-semibold text-ink-900">{group.heading}</h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-ink-600 hover:text-brand-700"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-ink-200 pt-6 text-xs text-ink-500">
          <p>
            Cascade Home Connect is a free referral service operated by {SITE.parentCompany}.
            We are not a contractor and do not perform work; we connect homeowners with
            independent local service providers who may contact you about your request.
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} {SITE.parentCompany}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
