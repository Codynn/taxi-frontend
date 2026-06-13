"use client";

import { usePublicWebsiteData } from "@/hooks/useWebsiteData";
import Image from "next/image";

import { Key } from "react";

const FALLBACK = {
  heading: "**Book** the Right Car for Every Journey, **Anytime** You Need",
  subheading:
    "Plan your travel effortlessly by selecting your destination, travel date, and preferred vehicle. Discover available cars instantly and start your journey with confidence.",
};

function MobileHighlightedLine({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const word = part.slice(2, -2);
          return (
            <span key={i} className="relative inline-block px-3 py-1 z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/about/rectangle.svg"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 -z-10 w-full h-full object-fill scale-y-110"
              />
              {word}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

export default function MobileHero() {
  const { data } = usePublicWebsiteData();

  const heading = data?.homepageHeroHeading?.trim() || FALLBACK.heading;
  const subheading =
    data?.homepageHeroSubheading?.trim() || FALLBACK.subheading;

  const lines = heading.split(/\s*\/\s*/);

  return (
    <div className="relative flex flex-col w-full lg:hidden pb-20">
      <div className="relative pl-4 pt-25 pb-4">
        <h1 className="relative font-sora font-extrabold max-w-119 text-black leading-[1.5] z-10 text-[35px] sm:pt-12">
          {lines.length > 1 ? (
            lines.map((line: string, i: Key | null | undefined) => (
              <span key={i} className="block">
                <MobileHighlightedLine text={line} />
              </span>
            ))
          ) : (
            <MobileHighlightedLine text={heading} />
          )}
        </h1>

        <p className="mt-5 text-black text-sm sm:text-[20px] leading-relaxed font-poppins max-w-lg">
          {subheading}
        </p>
      </div>

      <div className="w-full mt-4">
        <Image
          src="/home/hero3.png"
          alt="Taxi Car"
          width={1000}
          height={600}
          className="w-full h-auto object-cover object-center"
          priority
        />
      </div>
    </div>
  );
}
