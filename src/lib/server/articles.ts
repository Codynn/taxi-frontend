// Server-side data access for SSR article pages. Fetches are uncached
// (no-store) so the pages are truly server-rendered per request — new,
// edited, or deleted articles reflect on the website immediately.

const BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

export interface ArticleListItem {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  coverImage?: string | null;
  tags: string[];
  authorName?: string | null;
  publishedAt?: string | null;
}

export interface Article extends ArticleListItem {
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  updatedAt: string;
}

export interface ArticlePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export async function getPublishedArticles(
  page = 1,
): Promise<{ data: ArticleListItem[]; pagination: ArticlePagination | null }> {
  try {
    const res = await fetch(
      `${BASE}/articles/published?page=${page}&limit=24`,
      { cache: "no-store" },
    );
    if (!res.ok) return { data: [], pagination: null };
    const json = await res.json();
    return { data: json.data ?? [], pagination: json.pagination ?? null };
  } catch {
    return { data: [], pagination: null };
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const res = await fetch(
      `${BASE}/articles/slug/${encodeURIComponent(slug)}`,
      { cache: "no-store" },
    );
    if (!res.ok) return null;
    const json = await res.json();
    return json.data ?? null;
  } catch {
    return null;
  }
}

export async function getArticleSlugs(): Promise<
  { slug: string; updatedAt: string }[]
> {
  try {
    const res = await fetch(`${BASE}/articles/slugs`, { cache: "no-store" });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
