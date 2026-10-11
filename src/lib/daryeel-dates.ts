// Item dates are stored as display strings such as "12 March 2026" (see daryeel-data.ts).
// These helpers parse them so the UI can show real warranty progress, and convert to and
// from the yyyy-mm-dd value used by native date inputs.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAY_MS = 24 * 60 * 60 * 1000;

/** Days before expiry at which a warranty counts as "ending soon". */
export const WARRANTY_SOON_DAYS = 90;

function makeDate(year: number, monthIndex: number, day: number): Date | null {
  const date = new Date(year, monthIndex, day);
  if (date.getFullYear() !== year || date.getMonth() !== monthIndex || date.getDate() !== day) {
    return null;
  }
  return date;
}

/** Parses "12 March 2026", "2026-03-12" or "12/03/2026". Returns null for anything else. */
export function parseItemDate(value: string): Date | null {
  const text = value.trim();
  if (!text) return null;

  const iso = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (iso) return makeDate(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]));

  const numeric = /^(\d{1,2})\s*[/.-]\s*(\d{1,2})\s*[/.-]\s*(\d{4})$/.exec(text);
  if (numeric) return makeDate(Number(numeric[3]), Number(numeric[2]) - 1, Number(numeric[1]));

  const named = /^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/.exec(text);
  if (named) {
    const month = MONTHS.findIndex((m) => m.toLowerCase().startsWith(named[2]!.toLowerCase()));
    if (month >= 0 && named[2]!.length >= 3)
      return makeDate(Number(named[3]), month, Number(named[1]));
  }
  return null;
}

/** Formats a date the way item dates are stored: "12 March 2026". */
export function formatItemDate(date: Date): string {
  return `${String(date.getDate()).padStart(2, "0")} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

/** Converts a stored item date to a native date input value, or "" if it can't be parsed. */
export function toInputDate(value: string): string {
  const date = parseItemDate(value);
  if (!date) return "";
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
}

export type WarrantyState = "none" | "unknown" | "active" | "soon" | "expired";

export interface WarrantyInfo {
  state: WarrantyState;
  /** Whole days until expiry (negative once expired). Null when the date can't be read. */
  daysLeft: number | null;
  /** Share of the warranty period used, 0–1. Null without a readable purchase date. */
  progress: number | null;
}

export function getWarrantyInfo(
  purchaseDate: string,
  warrantyExpiry: string,
  now: Date = new Date(),
): WarrantyInfo {
  if (!warrantyExpiry.trim()) return { state: "none", daysLeft: null, progress: null };
  const expiry = parseItemDate(warrantyExpiry);
  if (!expiry) return { state: "unknown", daysLeft: null, progress: null };

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const daysLeft = Math.round((expiry.getTime() - today.getTime()) / DAY_MS);
  const start = parseItemDate(purchaseDate);
  let progress: number | null = null;
  if (start && expiry > start) {
    progress = Math.min(
      1,
      Math.max(0, (today.getTime() - start.getTime()) / (expiry.getTime() - start.getTime())),
    );
  }
  const state: WarrantyState =
    daysLeft < 0 ? "expired" : daysLeft <= WARRANTY_SOON_DAYS ? "soon" : "active";
  return { state, daysLeft, progress };
}

/** Human-friendly remaining time, e.g. "5 months left", "12 days left", "Expired 3 days ago". */
export function describeDaysLeft(daysLeft: number): string {
  if (daysLeft < 0) {
    const ago = -daysLeft;
    return ago === 1 ? "Expired yesterday" : `Expired ${ago} days ago`;
  }
  if (daysLeft === 0) return "Expires today";
  if (daysLeft < 60) return `${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  const months = Math.floor(daysLeft / 30);
  return `${months} months left`;
}
