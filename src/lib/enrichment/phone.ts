/**
 * Phone line-type intelligence via Twilio Lookup v2 (paid, ~$0.008/lookup).
 * Activates only when TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN are set; otherwise it's
 * a no-op (returns null) so the free stack keeps working. Flags mobile vs. landline vs.
 * VoIP — VoIP/landline are weaker for same-day contact and a mild fraud signal.
 */

export interface PhoneIntel {
  lineType: string | null; // mobile | landline | voip | ...
  carrier: string | null;
  valid: boolean | null;
}

export async function lookupPhone(phoneE164: string): Promise<PhoneIntel | null> {
  const sid = process.env.TWILIO_ACCOUNT_SID?.trim();
  const token = process.env.TWILIO_AUTH_TOKEN?.trim();
  if (!sid || !token) return null; // not configured — skip

  try {
    const url =
      `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneE164)}` +
      `?Fields=line_type_intelligence`;
    const res = await fetch(url, {
      headers: { authorization: `Basic ${btoa(`${sid}:${token}`)}` },
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      valid?: boolean;
      line_type_intelligence?: { type?: string | null; carrier_name?: string | null };
    };
    return {
      lineType: data.line_type_intelligence?.type ?? null,
      carrier: data.line_type_intelligence?.carrier_name ?? null,
      valid: data.valid ?? null,
    };
  } catch {
    return null;
  }
}
