/**
 * Public Supabase config for the buyer portal (client + SSR auth).
 *
 * The publishable/anon key is DESIGNED to be exposed in the browser — Row Level
 * Security is what protects data, not key secrecy. We ship sane defaults so the
 * portal works on deploy; override per-environment with NEXT_PUBLIC_* if desired.
 * (The secret service-role key lives only in server env, never here.)
 */

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://btifsnnjuiwpbwvlzstc.supabase.co";

export const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
  "sb_publishable_3tu-8RnLWiXo_YmOOvF9kQ_yGgoLOHf";
