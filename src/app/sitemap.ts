import type { MetadataRoute } from "next";
import { getArticleSlugs } from "@/lib/server/articles";

const BASE_URL = "https://www.lokpriyataxi.com.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const routes: {
    path: string;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1 },
    { path: "/rides", changeFrequency: "daily", priority: 0.9 },
    { path: "/articles", changeFrequency: "daily", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.8 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
    { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Published articles.
  const slugs = await getArticleSlugs();
  const articleEntries: MetadataRoute.Sitemap = slugs.map((s) => ({
    url: `${BASE_URL}/articles/${s.slug}`,
    lastModified: s.updatedAt ? new Date(s.updatedAt) : now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticEntries, ...articleEntries];
}
