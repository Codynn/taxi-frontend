"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Car,
} from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";

import VehicleTabs from "../vehicles/VehicleTabs";
import RideCollectionVehicleCard from "./RideCollectionVehicleCard";
import RideFilterPanel from "./RideFilterPanel";
import BookingModal from "../Booking/Bookingmodal ";

import { useVehicles } from "@/hooks/useVehicle";
import type { ApiVehicle, VehicleCategory } from "@/hooks/useVehicle";
import type { SelectedVehicle } from "../vehicles/Vehicleselectedcard";
import { useBookingStore } from "@/hooks/useBookingStore";
import type { BookingFormState } from "@/types/booking.types";

// ── Map API vehicle → SelectedVehicle ─────────────────────────────────────
function toSelectedVehicle(v: ApiVehicle): SelectedVehicle {
  return {
    id: v.id,                          // ← real DB id, never stale
    name: v.vechileName,
    plateNumber: v.vechileNumber,
    imageUrl: v.vechileImage,
    rating: 0,
    totalTrips: 0,
    startingPrice: v.pricePerDay,      // ← use real price
    currency: "Rs",
    features: [
      { label: v.vechileFuelType, icon: "vehicle/electric.svg" },
      { label: `${v.noOfSeats} Seats`, icon: "vehicle/seat.svg" },
      ...(v.hasAC ? [{ label: "AC", icon: "vehicle/ac.svg" }] : []),
    ],
  };
}

// ── Map BookingFormState → BookingModalData ────────────────────────────────
function toModalData(state: BookingFormState) {
  return {
    pickUpLocation:  state.destination.from  ?? "",
    dropOffLocation: state.destination.to    ?? "",
    pickUpDate:  state.dateRange.pickup  ? new Date(state.dateRange.pickup).toISOString()  : new Date().toISOString(),
    returnDate:  state.dateRange.return  ? new Date(state.dateRange.return).toISOString()  : undefined,
    bookingType: (state.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY") as "ROUND_TRIP" | "ONE_WAY",
    tripType: (
      state.tripTab === "long"   ? "LONG_TRIP"   :
      state.tripTab === "short"  ? "SHORT_TRIP"  : "CUSTOM_TRIP"
    ) as "LONG_TRIP" | "SHORT_TRIP" | "CUSTOM_TRIP",
    driverRequired: state.driverType === "with-driver",
  };
}

// ── Tabs config ────────────────────────────────────────────────────────────
const VEHICLE_TABS = [
  { value: "CAR"          as VehicleCategory, label: "Cars",          icon: "vehicle/car.svg"  },
  { value: "AUTO_RICKSHAW"as VehicleCategory, label: "Auto Rickshaw", icon: "vehicle/auto.svg" },
  { value: "BIKE_SCOOTER" as VehicleCategory, label: "Bike & Scooters",icon: "vehicle/bike.svg"},
];

const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended"        },
  { value: "price-low",   label: "Price: Low to High" },
  { value: "price-high",  label: "Price: High to Low" },
];

const ITEMS_PER_PAGE = 6;

// ── Skeleton ───────────────────────────────────────────────────────────────
function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:hidden p-4 gap-3">
        <Skeleton className="w-full h-[200px] rounded-xl" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-14 w-full rounded-xl" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
      <div className="hidden lg:flex p-4 gap-4">
        <Skeleton className="w-[290px] h-[180px] rounded-xl shrink-0" />
        <div className="flex flex-col flex-1 gap-3 py-2">
          <div className="flex justify-between">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-14 w-full rounded-xl" />
          <div className="flex justify-between items-center mt-auto">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-10 w-36 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export default function RideCollectionSection() {
  const router = useRouter();

  const [activeTab, setActiveTab]   = useState<VehicleCategory>("CAR");
  const [sortBy, setSortBy]         = useState("recommended");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen]   = useState(false);

  // The vehicle the user clicked "Book Now" on — held locally until modal confirms
  const [pendingVehicle, setPendingVehicle] = useState<SelectedVehicle | null>(null);

  const { setSelectedVehicle, setModalData } = useBookingStore();
  const { data: allVehicles = [], isLoading, isError } = useVehicles();

  // ── Filtering + sorting ──
  const filtered = allVehicles
    .filter((v) => v.category === activeTab)
    .sort((a, b) => {
      if (sortBy === "price-low")  return a.pricePerDay - b.pricePerDay;
      if (sortBy === "price-high") return b.pricePerDay - a.pricePerDay;
      return 0;
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3)
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  };

  // ── "Book Now" clicked on a vehicle card ──
  const handleVehicleChoose = (apiVehicle: ApiVehicle) => {
    setPendingVehicle(toSelectedVehicle(apiVehicle));
    setModalOpen(true);
  };

  // ── BookingModal confirmed (Search Ride clicked) ──
  const handleSearch = (state: BookingFormState) => {
    if (!pendingVehicle) return;

    // Persist both pieces to the store
    setSelectedVehicle(pendingVehicle);
    setModalData(toModalData(state));

    setModalOpen(false);
    router.push("/complete-booking");
  };

  return (
    <section className="bg-white py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row items-center justify-between mb-6 gap-4">
          <h2 className="text-[22px] md:text-[28px] font-semibold font-sora text-black">
            Our Ride Collection
          </h2>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-[13px] text-black font-poppins hidden sm:block">Sort By:</span>
              <Select value={sortBy} onValueChange={(val) => { if (val) setSortBy(val); }}>
                <SelectTrigger className="h-9 text-[13px] font-poppins border-gray-200 rounded-lg min-w-[150px] focus:ring-0 focus:ring-offset-0">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value} className="text-[13px] font-poppins cursor-pointer">
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
              <SheetContent side="bottom" className="h-full w-full rounded-t-3xl p-0 flex flex-col">
                <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-black" />
                    <h3 className="text-[15px] font-semibold font-poppins text-black">Filters</h3>
                  </div>
                  <SheetClose />
                </div>
                <div className="p-5 overflow-y-auto">
                  <RideFilterPanel hideHeader />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <VehicleTabs
            tabs={VEHICLE_TABS}
            active={activeTab}
            onChange={(v) => { setActiveTab(v); setCurrentPage(1); }}
          />
        </div>

        {/* Body */}
        <div className="flex gap-6 items-start">
          {/* Desktop filter */}
          <div className="hidden lg:block w-[260px] shrink-0 sticky top-6">
            <RideFilterPanel />
          </div>

          {/* Cards */}
          <div className="flex-1 min-w-0">
            {isLoading && (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => <VehicleCardSkeleton key={i} />)}
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Car className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-[14px] text-gray-500 font-poppins">
                  Failed to load vehicles. Please try again.
                </p>
              </div>
            )}

            {!isLoading && !isError && paginated.length === 0 && (
              <div className="text-center py-16 text-gray-400 font-poppins text-sm">
                No vehicles available in this category yet.
              </div>
            )}

            {!isLoading && !isError && paginated.length > 0 && (
              <div className="flex flex-col gap-4">
                {paginated.map((vehicle) => (
                  <RideCollectionVehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    onChoose={() => handleVehicleChoose(vehicle)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoading && filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-start gap-1.5 mt-10">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={24} />
                </button>

                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-[#2E2E2E] text-sm font-poppins">
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
                          : "text-[#2E2E2E] hover:text-black",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  ),
                )}

                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Booking Modal — opened after vehicle chosen */}
      <BookingModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setPendingVehicle(null);
        }}
        onSearch={handleSearch}
      />
    </section>
  );
}