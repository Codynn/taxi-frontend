"use client";

import Image from "next/image";
import Navbar from "../layout/navbar";
import MobileHero from "./mobileHero";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <div className="absolute inset-0 hidden lg:block">
        <Image
          src="/home/hero2.png"
          alt="Hero Background"
          fill
          priority
          className="object-cover object-top-right"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar transparent />

        <MobileHero />

        <div className="flex-1 items-center max-w-7xl mx-auto w-full px-4 md:px-8 py-12 hidden lg:flex">
          <div className="max-w-[560px] pt-30 pr-2 relative">
            <h1 className="font-sora z-10 font-extrabold text-[#000000] leading-tight text-4xl md:text-5xl lg:text-6xl relative">
              Book the Right <br />
              Car for Every
              <br />
              Journey, Anytime
              <br />
              You Need
            </h1>

            <Image
              src="/home/rectangle.svg"
              alt="Hero Car"
              width={210}
              height={150}
              className="mt-8 absolute top-28 -left-2 z-0"
            />

            <Image
              src="/home/rectangle.svg"
              alt="Hero Car"
              width={210}
              height={150}
              className="mt-8 absolute top-20 left-5 z-0"
            />

            <Image
              src="/home/rectangle.svg"
              alt="Hero Car"
              width={230}
              height={150}
              className="mt-8 absolute bottom-45 right-12 z-0"
            />

            <Image
              src="/home/rectangle.svg"
              alt="Hero Car"
              width={240}
              height={150}
              className="mt-8 absolute bottom-50 right-1 z-0"
            />

            <p className="mt-6 text-[#000000] font-medium text-[14px]  leading-relaxed font-poppins max-w-[462px]">
              Plan your travel effortlessly by selecting your destination,
              travel date, and preferred vehicle. Discover available cars
              instantly and start your journey with confidence.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
