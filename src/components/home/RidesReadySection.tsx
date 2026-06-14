"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Mousewheel } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import VehicleCard from "../vehicles/VehicleCard";
import { useVehicles } from "@/hooks/useVehicle";
import type { ApiVehicle } from "@/lib/api/vehicle.api";
import { usePublicVehicleCategories } from "@/hooks/useVehicleCategories";
import { RIDES_READY_CONTENT } from "@/constants/features/vehicle.constants";
import BookingModal from "../Booking/Bookingmodal ";
import { useBookingStore } from "@/hooks/useBookingStore";
import type { SelectedVehicle } from "../vehicles/Vehicleselectedcard";

const SWIPER_BREAKPOINTS = {
  0: { slidesPerView: 1.2, spaceBetween: 16 },
  480: { slidesPerView: 1.5, spaceBetween: 16 },
  640: { slidesPerView: 2.2, spaceBetween: 20 },
  1024: { slidesPerView: 3.2, spaceBetween: 24 },
  1280: { slidesPerView: 4, spaceBetween: 24 },
};

// ── Skeletons ─────────────────────────────────────────────────────────────────

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

function TabsSkeleton() {
  return (
    <div className="w-full border-b border-gray-200 flex items-center justify-center gap-6 pb-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-6 w-24 rounded-lg" />
      ))}
    </div>
  );
}

// ── Conversion (only used for BookingStore) ───────────────────────────────────

function toSelectedVehicle(v: ApiVehicle): SelectedVehicle {
  return {
    id: v.id,
    name: v.vechileName,
    plateNumber: v.vechileNumber,
    imageUrl: v.vechileImage,
    rating: 0,
    totalTrips: 0,
    startingPrice: v.pricePerDay,
    currency: "Rs",
    features: [
      { label: v.vechileFuelType, icon: "vehicle/fuel.svg" },
      { label: v.vechileGearType, icon: "vehicle/battery.svg" },
      { label: `${v.noOfSeats} Seats`, icon: "vehicle/seat.svg" },
      ...(v.hasAC ? [{ label: "AC", icon: "vehicle/wind.svg" }] : []),
    ],
  };
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function RidesReadySection() {
  const swiperRef = useRef<SwiperType | null>(null);
  const { heading, highlightedWord, description, browseAllLabel } =
    RIDES_READY_CONTENT;

  const { data: categories = [], isLoading: catsLoading } =
    usePublicVehicleCategories();
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const activeCat = activeCategoryId ?? categories[0]?.id ?? null;

  const {
    data: allVehicles = [],
    isLoading,
    isError,
  } = useVehicles({
    categoryId: activeCat ?? undefined,
  });

  const [modalOpen, setModalOpen] = useState(false);
  const [pendingVehicle, setPendingVehicle] = useState<ApiVehicle | null>(null);
  const { setSelectedVehicle } = useBookingStore();

  // Convert to SelectedVehicle only when navigating to booking page
  const handleBeforeNavigate = () => {
    if (pendingVehicle) setSelectedVehicle(toSelectedVehicle(pendingVehicle));
  };

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
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

        {/* Category Tabs */}
        <div className="mb-8">
          {catsLoading ? (
            <TabsSkeleton />
          ) : (
            <div className="w-full border-b border-gray-200 overflow-x-auto scrollbar-none">
              <div className="flex items-center justify-center min-w-max">
                {categories.map((cat) => {
                  const isActive =
                    (activeCategoryId ?? categories[0]?.id) === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setActiveCategoryId(cat.id);
                        swiperRef.current?.slideTo(0);
                      }}
                      className={[
                        "relative flex items-center gap-2 px-6 py-3 text-sm font-semibold font-poppins transition-colors duration-200 whitespace-nowrap",
                        isActive
                          ? "text-gray-900"
                          : "text-gray-400 hover:text-gray-600",
                      ].join(" ")}
                    >
                      {cat.icon && (
                        <Image
                          src={cat.icon}
                          alt={cat.name}
                          width={18}
                          height={18}
                          className={isActive ? "opacity-100" : "opacity-40"}
                          unoptimized
                        />
                      )}
                      {cat.name}
                      {isActive && (
                        <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FEA800] rounded-full" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="text-center py-16 text-gray-400 font-poppins text-sm">
          Failed to load vehicles. Please try again.
        </div>
      )}

      {/* Swiper — vehicle passed as ApiVehicle, no cast needed */}
      {!isLoading && !isError && allVehicles.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Swiper
            modules={[FreeMode, Mousewheel]}
            freeMode
            mousewheel={{ forceToAxis: true }}
            grabCursor
            breakpoints={SWIPER_BREAKPOINTS}
            onSwiper={(s) => (swiperRef.current = s)}
          >
            {allVehicles.map((vehicle) => (
              <SwiperSlide
                key={vehicle.id}
                className="!h-auto flex items-stretch"
              >
                <VehicleCard
                  vehicle={vehicle}
                  onChoose={(v) => {
                    setPendingVehicle(v);
                    setModalOpen(true);
                  }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Empty */}
      {!isLoading && !isError && allVehicles.length === 0 && (
        <div className="text-center py-16 text-gray-400 font-poppins text-sm">
          No vehicles available in this category yet.
        </div>
      )}

      {/* Browse all */}
      <div className="flex justify-center mt-10">
        <Link href="/rides">
          <button className="border border-[#FEA800] text-[#FEA800] text-[16px] font-semibold font-poppins px-8 py-2.5 rounded-full hover:bg-[#FEA800]/10 transition-colors">
            {browseAllLabel}
          </button>
        </Link>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingVehicle(null);
        }}
        onBeforeNavigate={handleBeforeNavigate}
      />
    </section>
  );
}
