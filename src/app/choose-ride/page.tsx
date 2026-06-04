"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

import Navbar from "@/components/layout/navbar";
import VehicleTabs from "@/components/vehicles/VehicleTabs";
import RideCollectionVehicleCard from "@/components/rides/RideCollectionVehicleCard";
import RideFilterPanel from "@/components/rides/RideFilterPanel";
import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import { VEHICLES, VEHICLE_TABS } from "@/constants/features/vehicle.constants";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type { VehicleCategory } from "@/types/features/vehicle.types";
import type { BookingFormState } from "@/types/booking.types";
import { useBookingStore } from "@/hooks/useBookingStore";

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 20;

export default function ChooseRidePage() {
  const router = useRouter();

  const { bookingState, setBookingState, setSelectedVehicle } =
    useBookingStore();

  const [activeTab, setActiveTab] = useState<VehicleCategory>("cars");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = VEHICLES.filter((v) => v.category === activeTab);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = () => {
    if (TOTAL_PAGES <= 7)
      return Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", TOTAL_PAGES];
    if (currentPage >= TOTAL_PAGES - 3)
      return [
        1,
        "...",
        TOTAL_PAGES - 4,
        TOTAL_PAGES - 3,
        TOTAL_PAGES - 2,
        TOTAL_PAGES - 1,
        TOTAL_PAGES,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      TOTAL_PAGES,
    ];
  };

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 mt-20">
        {/* Go Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[16px] font-poppins text-black transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
          Go Back
        </button>

        {/* Summary bar */}
        <BookingSummaryBar state={bookingState} onUpdate={setBookingState} />

        {/* Title */}
        <h2 className="text-[20px] md:text-[24px] font-semibold font-sora text-black text-center">
          Available Rides for Your Trip
        </h2>

        <div className="flex items-center justify-between gap-4">
          <Sheet>
            <SheetTrigger>
              <button className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-poppins hover:bg-gray-50 transition-colors">
                <SlidersHorizontal className="w-4 h-4" />
                Filter
              </button>
            </SheetTrigger>
            <SheetContent
              side="bottom"
              className="h-auto w-full rounded-t-3xl p-0 overflow-y-auto"
            >
              <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-black" />
                  <h3 className="text-[15px] font-semibold font-poppins text-black">
                    Filters
                  </h3>
                </div>
                <SheetClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                  <X className="w-5 h-5 text-black" />
                </SheetClose>
              </div>
              <div className="p-5">
                <RideFilterPanel hideHeader />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Tabs */}
        <VehicleTabs
          tabs={VEHICLE_TABS}
          active={activeTab}
          onChange={(v) => {
            setActiveTab(v);
            setCurrentPage(1);
          }}
        />

        {/* Body: filter + cards */}
        <div className="flex gap-6 items-start">
          {/* Desktop filter */}
          <div className="hidden lg:block w-[240px] shrink-0 sticky top-6">
            <RideFilterPanel />
          </div>

          {/* Cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {paginated.length > 0 ? (
              paginated.map((vehicle) => (
                <RideCollectionVehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onChoose={(selected) => {
                    setSelectedVehicle(selected); // ← zustand
                    router.push("/complete-booking");
                  }}
                />
              ))
            ) : (
              <div className="text-center py-16 text-gray-400 font-poppins text-sm">
                No vehicles available.
              </div>
            )}

            {/* Pagination */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-start gap-1.5 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ‹
                </button>
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`e-${i}`}
                      className="w-8 h-8 flex items-center justify-center text-gray-400 text-sm"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={[
                        "w-10 h-10 flex items-center justify-center rounded-lg text-sm font-poppins transition-colors",
                        currentPage === page
                          ? "bg-[#FEA800] text-white font-semibold"
                          : "text-gray-600 hover:text-black",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
                  }
                  disabled={currentPage === TOTAL_PAGES}
                  className="w-10 h-10 flex items-center justify-center rounded-lg bg-gray-100 text-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
