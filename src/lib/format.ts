/** Locale-aware display formatters (presentation only — kept at the edge, not in the API). */

export function formatPrice(cents: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

export function formatTourDate(iso: string, timezone: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(d);
}

export function formatTourTime(iso: string, timezone: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  }).format(d);
}

export function formatTourDateTimeShort(iso: string, timezone: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const date = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    timeZone: timezone,
  }).format(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
    timeZone: timezone,
  }).format(d);
  return `${date} at ${time}`;
}

export function formatTimeUntil(iso: string): string {
  const diff = new Date(iso).getTime() - Date.now();
  if (diff <= 0) return "Starting soon";
  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 60) return `Starts in ${minutes} minute${minutes === 1 ? "" : "s"}`;
  const hours = Math.floor(minutes / 60);
  return `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;
}

/**
 * Render an ISO-8601 timestamp (e.g. Core MeResponse.createdAt, stored UTC) as month + year
 * with the month spelled out: "2026-06-21T15:50:43Z" → "June 2026". Used for the member card's
 * "Member since" line. The locale lives here (the client), so the API stays locale-neutral.
 */
export function formatMonthYear(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(d);
}
