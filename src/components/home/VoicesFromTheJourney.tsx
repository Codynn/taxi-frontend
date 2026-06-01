"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Autoplay, Keyboard } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

import { TESTIMONIALS } from "@/constants/features/voices.constants";
import TestimonialCard from "../shared/TestimonialCard";

export default function VoicesFromTheJourney() {
  return (
    <section className="bg-white py-12 md:py-16 lg:py-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 mb-10 md:mb-14">
        <div className="flex flex-col items-center text-center">
          <h2 className="font-sora font-semibold text-black text-[24px] sm:text-[28px] lg:text-[48px] leading-tight">
            Stories From{" "}
            <span className="bg-[#FEA800] px-2 rounded-sm">the Road</span>
          </h2>
          <p className="mt-4 text-[16px] text-[#000000]/65 font-poppins max-w-4xl leading-relaxed">
            Hear from travelers who enjoyed seamless bookings, reliable
            vehicles, and comfortable journeys through our trusted platform.
          </p>
        </div>
      </div>

      <div className="max-w-[100vw] mx-auto relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute left-0 top-0 h-full z-10 w-[60px] bg-gradient-to-r from-white/80 to-transparent" />

        {/* Right fade */}
        <div className="pointer-events-none absolute right-0 top-0 h-full z-10 w-[60px] bg-gradient-to-l from-white/80 to-transparent" />

        <Swiper
          modules={[FreeMode, Autoplay, Keyboard]}
          freeMode={{ enabled: true, momentum: true }}
          grabCursor={true}
          centeredSlides={true}
          initialSlide={1}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          keyboard={{
            enabled: true,
            onlyInViewport: true,
          }}
          spaceBetween={12}
          breakpoints={{
            0: { slidesPerView: 1.3, spaceBetween: 12 },
            480: { slidesPerView: 1.6, spaceBetween: 14 },
            640: { slidesPerView: 2.3, spaceBetween: 16 },
            900: { slidesPerView: 2.6, spaceBetween: 16 },
            1024: { slidesPerView: 3.6, spaceBetween: 20 },
            1280: { slidesPerView: 3.6, spaceBetween: 24 },
          }}
        >
          {TESTIMONIALS.map((testimonial) => (
            <SwiperSlide key={testimonial.id} className="!h-auto py-1">
              <TestimonialCard testimonial={testimonial} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
