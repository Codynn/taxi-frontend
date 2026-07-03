import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import SeoContent from "@/components/shared/SeoContent";
import { createMetadata } from "@/lib/utils/metadata";
import { getPublishedArticles } from "@/lib/server/articles";
import { resolveMediaUrl } from "@/lib/mediaUrl";

export const metadata = createMetadata({
  title: "Travel Articles & Guides — Lokpriya Taxi",
  description:
    "Read travel tips, route guides, and stories about getting around Nepal by car, jeep, and taxi. Practical advice for planning trips with Lokpriya Taxi.",
  path: "/articles",
});

function formatDate(iso?: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function ArticlesPage() {
  const { data: articles } = await getPublishedArticles(1);

  return (
    <main className="relative w-full bg-white min-h-screen">
      <Navbar forceWhite />

      <section className="max-w-7xl mx-auto px-4 md:px-8 pt-28 pb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold font-sora text-black leading-tight">
          Travel Articles &amp; Guides
        </h1>
        <p className="mt-4 text-[16px] text-gray-600 font-poppins max-w-2xl">
          Tips, route guides, and stories to help you travel across Nepal with
          confidence — from city rides to long inter-city journeys.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-8 pb-16">
        {articles.length === 0 ? (
          <p className="text-gray-500 font-poppins py-12">
            No articles have been published yet. Please check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((a) => {
              const cover = resolveMediaUrl(a.coverImage);
              return (
                <Link
                  key={a.id}
                  href={`/articles/${a.slug}`}
                  className="group flex flex-col rounded-2xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cover}
                        alt={a.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 p-5">
                    {a.tags?.length > 0 && (
                      <span className="text-[11px] font-semibold font-poppins text-[#FEA800] uppercase tracking-wide">
                        {a.tags[0]}
                      </span>
                    )}
                    <h2 className="text-[18px] font-bold font-sora text-black leading-snug line-clamp-2">
                      {a.title}
                    </h2>
                    {a.excerpt && (
                      <p className="text-[14px] text-gray-600 font-poppins line-clamp-3">
                        {a.excerpt}
                      </p>
                    )}
                    <p className="text-[12px] text-gray-400 font-poppins mt-1">
                      {[a.authorName, formatDate(a.publishedAt)]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <SeoContent
        heading="Plan Smarter Trips Across Nepal"
        paragraphs={[
          "Our articles are written to help travellers make the most of every journey in Nepal. Whether you are planning a weekend getaway, a pilgrimage, an airport transfer, or a long inter-city drive, you will find practical guidance on routes, travel times, vehicle choices, and what to expect on the road. We share local knowledge so you can travel comfortably and avoid common surprises.",
          "From choosing between a car, jeep, or SUV for hill roads, to understanding one-way versus round-trip fares, these guides break down the details that matter. We cover popular destinations such as Kathmandu, Pokhara, Lumbini, Tulsipur, Dang, Nepalgunj, and Biratnagar, along with seasonal tips for travelling safely throughout the year.",
          "New articles are added regularly. Bookmark this page and check back for fresh guides, or head to our fleet to reserve the right vehicle for your next trip with Lokpriya Taxi.",
        ]}
      />
    </main>
  );
}
