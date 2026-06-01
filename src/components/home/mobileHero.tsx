"use client";

import Image from "next/image";

export default function MobileHero() {
  return (
    <div className="relative flex flex-col w-full  lg:hidden pb-20">
      <div className="pl-4 pt-8 pb-4">
        <Image
          src="/home/rectangle.svg"
          alt="Hero Car"
          width={120}
          height={80}
          className="mt-8 absolute -top-1 left-8 z-0"
        />

        <Image
          src="/home/rectangle.svg"
          alt="Hero Car"
          width={120}
          height={80}
          className="mt-8 absolute top-2 left-3 z-1"
        />

        <Image
          src="/home/rectangle.svg"
          alt="Hero Car"
          width={120}
          height={80}
          className="mt-8 absolute top-22 left-12 z-0"
        />

        <Image
          src="/home/rectangle.svg"
          alt="Hero Car"
          width={120}
          height={80}
          className="mt-8 absolute top-25 left-3 z-0"
        />

        <h1 className="relative font-sora font-extrabold text-black leading-[1.2] text-[2.2rem] z-10 sm:text-6xl sm:pt-12">
          Book the Right Car for Every Journey, AnytimeYou Need
        </h1>

        <p className="mt-5 absolute text-black text-sm sm:text-[20px] leading-relaxed font-poppins">
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
