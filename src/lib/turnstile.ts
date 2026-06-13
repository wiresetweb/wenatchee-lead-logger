import "server-only";

/**
 * Cloudflare Turnstile verification for the quote form. Activates only when
 * TURNSTILE_SECRET_KEY is set, so the form keeps working before keys are configured.
 * Fails OPEN on network errors (don't lose a real lead to a transient hiccup) but
 * CLOSED on an explicit verification failure.
 */
export async function verifyTurnstile(
  token: string | undefined,
  ip: string | null,
): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true; // not configured — skip
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (ip) body.set("remoteip", ip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      body,
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) return true; // service hiccup — fail open
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch {
    return true; // network error — fail open
  }
}
