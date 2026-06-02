"use client";

import Image from "next/image";

export default function ContactHero() {
  return (
    <section
      className="relative w-full font-sora overflow-hidden bg-[#F5F5F5] h-screen"
      aria-label="Contact hero section"
    >
      {/* Background image */}
      <div className="absolute inset-0 top-0">
        <Image
          src="/contact/about.svg"
          alt="Contact background"
          fill
          priority
          className="object-cover object-[center_30%]"
          sizes="100vw"
        />
      </div>

      {/* Centered text */}
      <div className="absolute inset-0 top-[56%] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-black font-sora font-bold tracking-tight leading-none drop-shadow-md m-0 text-[60px]">
          <span className="relative inline-block mr-3">
            <div className="absolute left-1/7 top-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-20 z-0">
              <Image
                src="/about/rectangle.svg"
                alt=""
                fill
                priority
                className="object-cover"
              />
            </div>
            <span className="relative z-10">Get In</span>
          </span>
          Touch
        </h1>

        <p className="mt-6 text-black font-poppins font-medium text-[16px] max-w-2xl leading-relaxed">
          Have questions about bookings, vehicles, payments, or travel plans?
          Our team is here to help you with everything you need for a smooth and
          hassle-free journey.
        </p>

        {/* <div className="absolute left-1/7 top-80 -translate-x-1/2 -translate-y-1/2 w-120 h-100 z-20">
          <Image
            src="/contact/cloud1.svg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute left-1/2 top-80 -translate-x-1/2 -translate-y-1/2 w-120 h-100 z-20">
          <Image
            src="/contact/cloud2.svg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="absolute -right-20 top-80 -translate-x-1/2 -translate-y-1/2 w-120 h-100 z-20">
          <Image
            src="/contact/cloud3.svg"
            alt=""
            fill
            priority
            className="object-cover"
          />
        </div> */}
      </div>
    </section>
  );
}
