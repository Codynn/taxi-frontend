"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  VEHICLES,
  VEHICLE_TABS,
  SORT_OPTIONS,
} from "@/constants/features/vehicle.constants";
import type { Vehicle, VehicleCategory } from "@/types/features/vehicle.types";
import VehicleTabs from "../vehicles/VehicleTabs";
import RideCollectionVehicleCard from "./RideCollectionVehicleCard";
import RideFilterPanel from "./RideFilterPanel";
import BookingModal from "../Booking/Bookingmodal ";

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 20;

export default function RideCollectionSection() {
  const [activeTab, setActiveTab] = useState<VehicleCategory>("cars");
  const [sortBy, setSortBy] = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

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
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Header: title + sort ── */}
        <div className="flex flex-col lg:flex-row  items-center justify-between mb-6 gap-4">
          <h2 className="text-[22px] md:text-[28px] font-semibold font-sora text-black">
            Our Ride Collection
          </h2>

          <div className="flex  items-center  gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-black font-poppins hidden sm:block">
                Sort By:
              </span>
              <Select
                value={sortBy}
                onValueChange={(val) => {
                  if (val !== null) setSortBy(val);
                }}
              >
                <SelectTrigger className="h-9 text-[13px] font-poppins border-gray-200 rounded-lg min-w-[150px] focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem
                      key={opt.value}
                      value={opt.value}
                      className="text-[13px] font-poppins cursor-pointer"
                    >
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Sheet>
              <SheetTrigger>
                <button className="lg:hidden flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 text-[13px] font-poppins hover:bg-gray-50 transition-colors">
                  <SlidersHorizontal className="w-4 h-4" />
                  Filter
                </button>
              </SheetTrigger>

              <SheetContent
                side="bottom"
                className="h-full w-full rounded-t-3xl p-0 flex flex-col"
              >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-black" />
                    <h3 className="text-[15px] font-semibold font-poppins text-black">
                      Filters
                    </h3>
                  </div>

                  <SheetClose>
                    <button className="rounded-full p-1 hover:bg-gray-100 transition-colors">
                      {/* <X className="w-5 h-5 text-black" /> */}
                    </button>
                  </SheetClose>
                </div>

                {/* Filter content — hide the internal header since we have one above */}
                <div className="p-5">
                  <RideFilterPanel hideHeader />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="mb-8">
          <VehicleTabs
            tabs={VEHICLE_TABS}
            active={activeTab}
            onChange={(v) => {
              setActiveTab(v);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* ── Body: filter left + cards right ── */}
        <div className="flex gap-6 items-start">
          {/* Left filter — desktop only */}
          <div className="hidden lg:block w-[260px] shrink-0 sticky top-6">
            <RideFilterPanel />
          </div>

          {/* Right — cards */}
          <div className="flex-1 min-w-0">
            {paginated.length > 0 ? (
              <div className="flex flex-col gap-4">
                {paginated.map((vehicle) => (
                  <RideCollectionVehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onChoose={(v) => {
                      setSelectedVehicle(v);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 text-gray-400 font-poppins text-sm">
                No vehicles available in this category yet.
              </div>
            )}

            {/* ── Pagination ── */}
            {filtered.length > 0 && (
              <div className="flex items-center justify-start gap-1.5 mt-10">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px]  bg-[#f5f5f5] text-black  disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <ChevronLeft size={24} />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`ellipsis-${i}`}
                      className="w-8 h-8 flex items-center justify-center text-[#2E2E2E] text-sm font-poppins"
                    >
                      ...
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page as number)}
                      className={[
                        "w-10 h-10 flex items-center justify-center rounded-[8px] text-[18px] font-poppins transition-colors cursor-pointer",
                        currentPage === page
                          ? "bg-[#FEA800] text-black font-semibold"
                          : "text-[#2E2E2E] hover:border-[#FEA800] hover:text-[#000000]",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  ),
                )}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(TOTAL_PAGES, p + 1))
                  }
                  disabled={currentPage === TOTAL_PAGES}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5]  text-black  disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSearch={(state) => {
          console.log("Booking for:", selectedVehicle?.name, state);
          setModalOpen(false);
        }}
      />
    </section>
  );
}
