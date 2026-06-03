"use client";

import Image from "next/image";

export default function MobileHero() {
  return (
    <div className="relative flex flex-col w-full lg:hidden pb-20">
      <div className="relative pl-4 pt-25 pb-4">
        <h1 className="relative font-sora font-extrabold max-w-119 text-black leading-[1.5] z-10 text-[35px] sm:pt-12">
          <span className="relative inline-block px-3 py-1 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/rectangle.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 w-full h-full object-fill scale-y-110"
            />
            Book
          </span>{" "}
          the Right Car for Every Journey
          {/* MOVED THE COMMA HERE outside the span tag */},{" "}
          <span className="relative inline-block px-3 py-1 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/rectangle.svg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 -z-10 w-full h-full object-fill scale-y-110"
            />
            Anytime
          </span>{" "}
          You Need
        </h1>

        <p className="mt-5 text-black text-sm sm:text-[20px] leading-relaxed font-poppins max-w-lg">
          Plan your travel effortlessly by selecting your destination, travel
          date, and preferred vehicle. Discover available cars instantly and
          start your journey with confidence.
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
