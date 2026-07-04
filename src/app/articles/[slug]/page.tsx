import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import { getArticleBySlug } from "@/lib/server/articles";
import { resolveMediaUrl } from "@/lib/mediaUrl";

const BASE_URL = "https://www.lokpriyataxi.com.np";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    return { title: "Article not found", robots: { index: false } };
  }

  const title = article.seoTitle?.trim() || article.title;
  const description =
    article.seoDescription?.trim() ||
    article.excerpt?.trim() ||
    "Read the latest travel guide from Lokpriya Taxi.";
  const url = `${BASE_URL}/articles/${article.slug}`;
  const image = resolveMediaUrl(article.coverImage);

  return {
    title,
    description,
    keywords: article.tags,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      publishedTime: article.publishedAt ?? undefined,
      modifiedTime: article.updatedAt,
      tags: article.tags,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) notFound();

  const cover = resolveMediaUrl(article.coverImage);
  const url = `${BASE_URL}/articles/${article.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description:
      article.seoDescription?.trim() || article.excerpt?.trim() || undefined,
    image: cover ? [cover] : undefined,
    datePublished: article.publishedAt ?? undefined,
    dateModified: article.updatedAt,
    author: {
      "@type": article.authorName ? "Person" : "Organization",
      name: article.authorName || "Lokpriya Taxi",
    },
    publisher: {
      "@type": "Organization",
      name: "Lokpriya Taxi Pvt. Ltd.",
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    keywords: article.tags?.join(", ") || undefined,
  };

  return (
    <main className="relative w-full bg-white min-h-screen">
      <Navbar forceWhite />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 md:px-6 pt-28 pb-16">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 text-[14px] font-poppins text-gray-500 hover:text-black mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> All articles
        </Link>

        {article.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {article.tags.map((t) => (
              <span
                key={t}
                className="text-[11px] font-semibold font-poppins text-[#FEA800] uppercase tracking-wide"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <h1 className="text-3xl md:text-5xl font-extrabold font-sora text-black leading-tight">
          {article.title}
        </h1>

        <p className="mt-4 text-[13px] text-gray-400 font-poppins">
          {[article.authorName, formatDate(article.publishedAt)]
            .filter(Boolean)
            .join(" · ")}
        </p>

        {cover && (
          <div className="mt-8 rounded-2xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cover}
              alt={article.title}
              className="w-full h-auto object-cover"
            />
          </div>
        )}

        <div className="article-body mt-8 text-[16px] leading-relaxed text-gray-800 font-poppins">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {article.content}
          </ReactMarkdown>
        </div>
      </article>
    </main>
  );
}
