/**
 * Free-tier email quality checks: disposable-domain detection plus an MX lookup via
 * Cloudflare DNS-over-HTTPS (works in both Workers and Node — plain fetch, no `dns`).
 */

/** Common disposable/throwaway email domains — fraud signal, not a hard block. */
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "10minutemail.com",
  "10minutemail.net",
  "yopmail.com",
  "tempmail.com",
  "temp-mail.org",
  "throwawaymail.com",
  "getnada.com",
  "trashmail.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mintemail.com",
  "mytemp.email",
  "tempinbox.com",
  "spamgourmet.com",
  "mailnesia.com",
]);

export function isDisposableEmail(email: string): boolean {
  const domain = email.split("@")[1]?.toLowerCase();
  return domain ? DISPOSABLE_DOMAINS.has(domain) : false;
}

/** True if the email's domain has MX records (deliverable in principle). */
export async function hasMxRecords(email: string): Promise<boolean | null> {
  const domain = email.split("@")[1]?.toLowerCase();
  if (!domain) return false;
  try {
    const res = await fetch(
      `https://cloudflare-dns.com/dns-query?name=${encodeURIComponent(domain)}&type=MX`,
      { headers: { accept: "application/dns-json" }, signal: AbortSignal.timeout(4000) },
    );
    if (!res.ok) return null; // lookup unavailable — unknown, not invalid
    const data = (await res.json()) as { Status: number; Answer?: unknown[] };
    return data.Status === 0 && Array.isArray(data.Answer) && data.Answer.length > 0;
  } catch {
    return null; // network failure — leave unknown rather than penalize the lead
  }
}
