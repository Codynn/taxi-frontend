// Resolve a stored upload URL (relative path or absolute with a possibly stale
// host) against the current API base. Safe to use on server and client.

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export function resolveMediaUrl(stored?: string | null): string | undefined {
  console.log("STORED::", stored);
  if (stored?.startsWith("https://")) return stored;
  if (!stored) return undefined;
  let path = stored;
  if (/^https?:\/\//i.test(stored)) {
    try {
      path = new URL(stored).pathname;
    } catch {
      return stored;
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  return `${BASE}${path}`;
}
