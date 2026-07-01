import { QueryClient, dehydrate } from "@tanstack/react-query";

// Server-side prefetch helper for public (marketing) content so it is present
// in the initial SSR HTML. The browser react-query client hydrates from this
// dehydrated state using the same query keys, so no refetch happens on load.

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

async function serverGet<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${BASE}${path}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: T };
    return json.data ?? null;
  } catch {
    return null;
  }
}

export interface PrefetchEntry {
  key: unknown[];
  path: string;
}

/** Prefetch a set of public endpoints and return the dehydrated state. */
export async function prefetchPublic(entries: PrefetchEntry[]) {
  const queryClient = new QueryClient();
  await Promise.all(
    entries.map((e) =>
      queryClient.prefetchQuery({
        queryKey: e.key,
        queryFn: () => serverGet(e.path),
        staleTime: 1000 * 60 * 5,
      }),
    ),
  );
  return dehydrate(queryClient);
}
