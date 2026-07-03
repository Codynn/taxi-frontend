// Server-side data access for SSR article pages. Uses fetch with ISR so the
// blog is statically rendered and revalidated periodically for good SEO.

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
      { next: { revalidate: 300 } },
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
      { next: { revalidate: 300 } },
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
    const res = await fetch(`${BASE}/articles/slugs`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const json = await res.json();
    return json.data ?? [];
  } catch {
    return [];
  }
}
