// Bikram Sambat (BS) date helpers.
//
// IMPORTANT: All storage and calculation stays in AD (Gregorian). These helpers
// only convert AD <-> BS for *display* and for rendering the BS calendar grid.
// The booking pipeline continues to use AD `YYYY/MM/DD` strings and ISO dates.

import NepaliDateLib from "nepali-date-converter";

interface NepaliDateInstance {
  getYear(): number;
  getMonth(): number;
  getDate(): number;
  getDay(): number;
  toJsDate(): Date;
}
interface NepaliDateCtor {
  new (date: Date): NepaliDateInstance;
  new (year: number, month: number, day: number): NepaliDateInstance;
}

// The package ships both default and CJS shapes depending on bundler.
const NepaliDate = ((NepaliDateLib as unknown as { default?: NepaliDateCtor })
  .default ?? (NepaliDateLib as unknown as NepaliDateCtor)) as NepaliDateCtor;

export const BS_MONTHS = [
  "Baisakh",
  "Jestha",
  "Asar",
  "Shrawan",
  "Bhadra",
  "Aswin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

export const BS_WEEKDAYS_SHORT = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];

export interface BsParts {
  year: number;
  month: number; // 0-indexed (0 = Baisakh)
  day: number;
  weekday: number; // 0 = Sunday
}

/** Convert an AD Date to its BS parts. */
export function adToBs(date: Date): BsParts {
  const n = new NepaliDate(date);
  return {
    year: n.getYear(),
    month: n.getMonth(),
    day: n.getDate(),
    weekday: n.getDay(),
  };
}

/** Convert BS parts to an AD Date (month is 0-indexed). */
export function bsToAd(year: number, month: number, day: number): Date {
  return new NepaliDate(year, month, day).toJsDate();
}

/** Number of days in a given BS month. */
export function bsMonthDays(year: number, month: number): number {
  const start = bsToAd(year, month, 1).getTime();
  const nextYear = month === 11 ? year + 1 : year;
  const nextMonth = month === 11 ? 0 : month + 1;
  const end = bsToAd(nextYear, nextMonth, 1).getTime();
  return Math.round((end - start) / 86400000);
}

/** Parse the internal AD `YYYY/MM/DD` string into a Date. */
export function adStringToDate(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("/").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

/** Format an AD Date into the internal `YYYY/MM/DD` string. */
export function dateToAdString(date: Date): string {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(
    2,
    "0",
  )}/${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Convert the internal `YYYY/MM/DD` calendar-date string into an ISO string
 * at UTC midnight of that same calendar day.
 *
 * IMPORTANT: don't use `new Date(str).toISOString()` for this — slash-format
 * date strings are parsed as *local* midnight, so `.toISOString()` shifts the
 * instant into the previous day for any timezone ahead of UTC (e.g. Nepal,
 * UTC+5:45). That off-by-one-day then makes a perfectly valid future booking
 * look like it's "in the past" once the backend compares calendar dates.
 * Building the instant directly from UTC components avoids that shift.
 */
export function adStringToUtcIso(str: string): string {
  const [y, m, d] = str.split("/").map(Number);
  if (!y || !m || !d) return "";
  return new Date(Date.UTC(y, m - 1, d)).toISOString();
}

/**
 * Format any AD input (Date, ISO string, or `YYYY/MM/DD`) as a BS display
 * string, e.g. "15 Asar 2083". Returns "" for empty/invalid input.
 */
export function formatBsDate(
  input: Date | string | null | undefined,
): string {
  if (!input) return "";
  let date: Date | null;
  if (input instanceof Date) {
    date = input;
  } else if (input.includes("/")) {
    date = adStringToDate(input);
  } else {
    const parsed = new Date(input);
    date = isNaN(parsed.getTime()) ? null : parsed;
  }
  if (!date || isNaN(date.getTime())) return "";
  const bs = adToBs(date);
  return `${bs.day} ${BS_MONTHS[bs.month]} ${bs.year}`;
}

/** Same as formatBsDate but with a trailing weekday, e.g. "15 Asar 2083, Mon". */
export function formatBsDateLong(
  input: Date | string | null | undefined,
): string {
  if (!input) return "";
  let date: Date | null;
  if (input instanceof Date) date = input;
  else if (input.includes("/")) date = adStringToDate(input);
  else {
    const parsed = new Date(input);
    date = isNaN(parsed.getTime()) ? null : parsed;
  }
  if (!date || isNaN(date.getTime())) return "";
  const bs = adToBs(date);
  const wd = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][bs.weekday];
  return `${bs.day} ${BS_MONTHS[bs.month]} ${bs.year}, ${wd}`;
}
