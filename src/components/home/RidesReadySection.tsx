"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import VehicleTabs from "../vehicles/VehicleTabs";
import VehicleCard from "../vehicles/VehicleCard";
import { useVehicles } from "@/hooks/useVehicle";
import type { ApiVehicle, VehicleCategory } from "@/lib/api/vehicle.api";
import { RIDES_READY_CONTENT } from "@/constants/features/vehicle.constants";
import BookingModal from "../Booking/Bookingmodal ";

const VEHICLE_TABS = [
  { value: "CAR" as VehicleCategory, label: "Cars", icon: "vehicle/car.svg" },
  {
    value: "AUTO_RICKSHAW" as VehicleCategory,
    label: "Auto Rickshaw",
    icon: "vehicle/auto.svg",
  },
  {
    value: "BIKE_SCOOTER" as VehicleCategory,
    label: "Bike & Scooters",
    icon: "vehicle/bike.svg",
  },
];

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1.2, spaceBetween: 16 },
  480: { slidesPerView: 1.5, spaceBetween: 16 },
  640: { slidesPerView: 2.2, spaceBetween: 20 },
  1024: { slidesPerView: 3.2, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
};

function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-4">
      <Skeleton className="w-full h-[200px] rounded-xl" />
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="flex justify-between items-center">
        <Skeleton className="h-7 w-24" />
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </div>
  );
}

export default function RidesReadySection() {
  const [activeTab, setActiveTab] = useState<VehicleCategory>("CAR");
  const swiperRef = useRef<SwiperType | null>(null);

  const { heading, highlightedWord, description, browseAllLabel } =
    RIDES_READY_CONTENT;

  // ── Real API data ─────────────────────────────────────────────────────
  const { data: allVehicles = [], isLoading, isError } = useVehicles();
  const filtered = allVehicles.filter((v) => v.category === activeTab);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<ApiVehicle | null>(
    null,
  );

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Heading ── */}
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
            className="absolute top-10 left-[44%] z-0 lg:hidden md:hidden block"
            aria-hidden
          />
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={250}
            height={150}
            className="absolute top-10 left-[45%] z-0 lg:hidden hidden sm:block"
            aria-hidden
          />
          <h2 className="relative z-10 mt-2 text-[20px] md:text-[32px] lg:text-[48px] font-semibold font-sora text-[#000000]">
            {heading}
            <span className="px-2 rounded-sm">{highlightedWord}</span>
          </h2>
        </div>

        <p className="relative text-center z-10 text-[14px] lg:text-[16px] text-[#000000]/65 font-poppins max-w-4xl mx-auto leading-relaxed mb-8">
          {description}
        </p>

        {/* ── Tabs ── */}
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

      {/* ── Loading ── */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* ── Error ── */}
      {isError && (
        <div className="text-center py-16 text-gray-400 font-poppins text-sm">
          Failed to load vehicles. Please try again.
        </div>
      )}

      {/* ── Swiper ── */}
      {!isLoading && !isError && filtered.length > 0 && (
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
                <VehicleCard
                  vehicle={vehicle}
                  onChoose={(vehicle) => {
                    setSelectedVehicle(vehicle);
                    setModalOpen(true);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* ── Empty ── */}
      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-poppins text-sm">
          No vehicles available in this category yet.
        </div>
      )}

      {/* ── Browse all ── */}
      <div className="flex justify-center mt-10">
        <Link href="/rides">
          <button className="border border-[#FEA800] text-[#FEA800] text-[16px] font-semibold font-poppins px-8 py-2.5 rounded-full hover:bg-[#FEA800]/10 transition-colors">
            {browseAllLabel}
          </button>
        </Link>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSearch={(state) => {
          console.log("Booking:", selectedVehicle, state);
          setModalOpen(false);
        }}
      />
    </section>
  );
}
