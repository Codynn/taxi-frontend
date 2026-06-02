"use client";

import Image from "next/image";

export default function ContactHero() {
  return (
    <section
      className="relative w-full font-sora overflow-hidden h-screen"
      aria-label="Trips hero section"
    >
      <div className="absolute inset-0 block">
        <Image
          src="/contact/contactbanner.svg"
          alt="Himalayan mountain landscape"
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
      </div>

      {/* ── Gradient overlay ── */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, rgba(0,0,0,0.0) 50%, rgba(0,0,0,0.15) 100%)",
        }}
        aria-hidden="true"
      />

      <div
        className="
          absolute inset-0 flex flex-col px-5 pt-10
          items-center justify-center
          sm:items-center sm:justify-center sm:px-4 sm:pt-0 sm:-translate-y-[10%]
        "
      >
        <h1
          className="
            text-white leading-none font-sora font-black tracking-[-0.02em] drop-shadow-md m-0
            text-center sm:text-center
          "
        >
          <span
            className="
              block
              text-[3.6rem]
              sm:text-[3rem] md:text-[4.2rem] lg:text-[5.4rem] xl:text-[6.2rem]
            "
          >
            Get in Touch
          </span>
        </h1>
      </div>
    </section>
  );
}
