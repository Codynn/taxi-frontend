/** Formats a 24h "HH:mm" string (as produced by `<input type="time">`) into
 * a friendly 12h label, e.g. "14:30" -> "2:30 PM". Returns "" for empty input. */
export function formatTimeLabel(value: string): string {
  if (!value) return "";
  const [h, m] = value.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return "";
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}
