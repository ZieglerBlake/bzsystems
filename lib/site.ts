/* Conversion endpoints — FOUNDING-BRIEF.md §3. */

// TODO: point at the free-verdict funnel once bz-funnel ships (domain TBD).
// Until then the VRC conversion block converts via email.
export const VRC_FUNNEL_URL: string | null = null;

export const VRC_FALLBACK_MAILTO =
  "mailto:blake@bzsystems.io?subject=Free%20vendor%20verdict";

// Sentinel's own domain — unset until it exists. Never invent this URL.
export const SENTINEL_URL = process.env.NEXT_PUBLIC_SENTINEL_URL;

export const CONTACT_MAILTO = "mailto:blake@bzsystems.io";
