interface SeoContentProps {
  heading: string;
  paragraphs: string[];
}

/**
 * Server-rendered descriptive content block. Adds genuine, useful text to
 * otherwise image-heavy marketing pages so the content is crawlable and
 * meaningful for both users and search engines.
 */
export default function SeoContent({ heading, paragraphs }: SeoContentProps) {
  return (
    <section className="w-full bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <h2 className="text-2xl md:text-3xl font-bold font-sora text-black mb-5">
          {heading}
        </h2>
        <div className="flex flex-col gap-4 text-[15px] leading-relaxed text-gray-700 font-poppins max-w-4xl">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
