"use client";

import Image from "next/image";
import Navbar from "../layout/navbar";
import MobileHero from "./mobileHero";
import { usePublicWebsiteData } from "@/hooks/useWebsiteData";

const FALLBACK = {
  heading: "Book the Right Car for Every Journey, **Anytime** You Need",
  subheading:
    "Plan your travel effortlessly by selecting your destination, travel date, and preferred vehicle. Discover available cars instantly and start your journey with confidence.",
};

function HighlightedText({ text }: { text: string }) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          const word = part.slice(2, -2);
          return (
            <span key={i} className="bg-[#FEA800] text-black px-1">
              {word}
            </span>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function HeadingLines({ text }: { text: string }) {
  const lines = text.split(/\n|\s*\/\s*/);
  return (
    <>
      {lines.map((line, i) => (
        <span key={i} className="block">
          <HighlightedText text={line} />
        </span>
      ))}
    </>
  );
}

export default function HeroSection() {
  const { data } = usePublicWebsiteData();

  const heading = data?.homepageHeroHeading?.trim() || FALLBACK.heading;
  const subheading =
    data?.homepageHeroSubheading?.trim() || FALLBACK.subheading;

  return (
    <section className="relative w-full min-h-screen overflow-hidden pb-30">
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/home/hero2.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-top-right"
        />
      </div>

      <div className="relative flex flex-col min-h-screen">
        <Navbar transparent />

        <MobileHero />

        <div className="flex-1 items-center max-w-7xl mx-auto w-full px-4 md:px-8 py-12 hidden lg:flex">
          <div className="max-w-[560px] pt-30 pr-2 relative">
            <h1 className="font-sora z-10 font-extrabold text-[#000000] leading-tight text-4xl md:text-5xl lg:text-6xl relative">
              <HeadingLines text={heading} />
            </h1>

            <Image
              src="/home/rectangle.svg"
              alt=""
              width={210}
              height={150}
              className="mt-8 absolute top-28 -left-2 z-0"
            />
            <Image
              src="/home/rectangle.svg"
              alt=""
              width={210}
              height={150}
              className="mt-8 absolute top-20 left-5 z-0"
            />
            <Image
              src="/home/rectangle.svg"
              alt=""
              width={230}
              height={150}
              className="mt-8 absolute bottom-45 right-12 z-0"
            />
            <Image
              src="/home/rectangle.svg"
              alt=""
              width={240}
              height={150}
              className="mt-8 absolute bottom-50 right-1 z-0"
            />

            <p className="mt-6 text-[#000000] font-medium text-[14px] leading-relaxed font-poppins max-w-[462px]">
              {subheading}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
