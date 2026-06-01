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
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-[48px] font-semibold font-sora text-gray-900 leading-tight">
            {heading}{" "}
            <span className="bg-[#FEA800] px-2 rounded-sm">
              {highlightedWord}
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-500 font-poppins max-w-xl mx-auto">
            {description}
          </p>
        </div>

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
