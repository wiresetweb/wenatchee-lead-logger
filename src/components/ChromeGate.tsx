"use client";

/** Hides the public marketing chrome (header/footer) on portal routes. */
import { usePathname } from "next/navigation";

export function ChromeGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname.startsWith("/portal")) return null;
  return <>{children}</>;
}
