"use client";

import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  VEHICLES,
  VEHICLE_TABS,
  RIDES_READY_CONTENT,
} from "@/constants/features/vehicle.constants";
import type { VehicleCategory } from "@/types/features/vehicle.types";
import VehicleTabs from "../vehicles/VehicleTabs";
import VehicleCard from "../vehicles/VehicleCard";
import Image from "next/image";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1.2, spaceBetween: 16 },
  480: { slidesPerView: 1.5, spaceBetween: 16 },
  640: { slidesPerView: 2.2, spaceBetween: 20 },
  1024: { slidesPerView: 3.2, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
};

export default function RidesReadySection() {
  const [activeTab, setActiveTab] = useState<VehicleCategory>("cars");
  const swiperRef = useRef<SwiperType | null>(null);

  const { heading, highlightedWord, description, browseAllLabel } =
    RIDES_READY_CONTENT;

  const filtered = VEHICLES.filter((v) => v.category === activeTab);

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center pt-10">
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={350}
            height={50}
            className="absolute top-10 left-[60%] -translate-x-1/2 z-0 lg:block hidden"
            aria-hidden
          />

          <Image
            src="/about/rectangle.svg"
            alt=""
            width={150}
            height={150}
            className="absolute top-10 left-[44%]  z-0 lg:hidden md:hidden block"
            aria-hidden
          />

          <Image
            src="/about/rectangle.svg"
            alt=""
            width={250}
            height={150}
            className="absolute top-10 left-[45%]  z-0 lg:hidden hidden sm:block"
            aria-hidden
          />

          <h2 className="relative z-10 mt-2 text-[20px] md:text-[32px] lg:text-[48px] font-semibold font-sora text-[#000000]">
            {heading}
            <span className="px-2 rounded-sm">{highlightedWord}</span>
          </h2>
        </div>
        <p className="relative text-center z-10 text-[14px] lg:text-[16px] text-[#000000]/65 font-poppins max-w-4xl mx-auto leading-relaxed">
          {description}
        </p>

        <div className="flex items-center justify-between mb-8 gap-4">
          <div className="flex-1 min-w-0">
            <VehicleTabs
              tabs={VEHICLE_TABS}
              active={activeTab}
              onChange={(v) => {
                setActiveTab(v);
                swiperRef.current?.slideTo(0);
              }}
            />
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode
            mousewheel={{ forceToAxis: true }}
            grabCursor
            breakpoints={SWIPER_BREAKPOINTS}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
          >
            {filtered.map((vehicle) => (
              <SwiperSlide
                key={vehicle.id}
                className="!h-auto flex items-stretch"
              >
                <VehicleCard vehicle={vehicle} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      ) : (
        <div className="text-center py-16 text-gray-400 font-poppins text-sm">
          No vehicles available in this category yet.
        </div>
      )}

      <div className="flex justify-center mt-10">
        <button className="border border-[#FEA800] text-[#FEA800] text-[16px] font-semibold font-poppins px-8 py-2.5 rounded-full hover:bg-[#FEA800]/10 transition-colors">
          {browseAllLabel}
        </button>
      </div>
    </section>
  );
}
