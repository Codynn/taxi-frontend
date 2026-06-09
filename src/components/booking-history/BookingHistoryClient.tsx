"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { BookingRecord, BookingStatus, TripTab } from "@/types/booking.types";
import { useMyBookings, ApiBooking } from "@/lib/api/booking.api";
import BookingHistoryHeader from "./BookingHistoryHeader";
import BookingHistoryFilters from "./BookingHistoryFilters";
import BookingHistoryTabs from "./BookingHistoryTabs";
import BookingHistoryPagination from "./BookingHistoryPagination";
import BookingHistoryList from "./BookingHistoryList";

interface ApiVehicleFull {
  id: string;
  vechileName: string;
  vechileImage: string;
  vechileType: string;
  vechileNumber: string;
  vechileFuelType: string;
  vechileGearType: string;
  category: string;
  hasAC: boolean;
  noOfSeats: number;
  pricePerDay: number;
}

interface ApiBookingRaw extends Omit<ApiBooking, "vehicle"> {
  vechicle: ApiVehicleFull;
}

// ── Lookup maps ───────────────────────────────────────────────────────────────
const TRIP_TYPE_MAP: Record<string, TripTab> = {
  LONG_TRIP: "long",
  SHORT_TRIP: "short",
  CUSTOM_TRIP: "custom",
};

const UI_TO_API_TRIP: Record<
  TripTab,
  "LONG_TRIP" | "SHORT_TRIP" | "CUSTOM_TRIP"
> = {
  long: "LONG_TRIP",
  short: "SHORT_TRIP",
  custom: "CUSTOM_TRIP",
};

const STATUS_MAP: Record<string, BookingStatus> = {
  PENDING: "Pending",
  CONFIRMED: "Pending",
  IN_PROGRESS: "Pending",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function calcDays(from: string, to?: string): number {
  if (!from || !to) return 1;
  const diff = new Date(to).getTime() - new Date(from).getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
}

function buildFeatures(v: ApiVehicleFull) {
  const features = [];

  if (v?.vechileFuelType) {
    const fuelIcon =
      v.vechileFuelType.toLowerCase() === "electric"
        ? "vehicle/battery.svg"
        : "vehicle/fuel.svg";
    features.push({ label: v.vechileFuelType, icon: fuelIcon });
  }

  if (v?.vechileGearType) {
    const gearIcon =
      v.vechileGearType.toLowerCase() === "automatic"
        ? "vehicle/battery.svg"
        : "vehicle/settings.svg";
    features.push({ label: v.vechileGearType, icon: gearIcon });
  }

  if (v?.noOfSeats)
    features.push({ label: `${v.noOfSeats} Seats`, icon: "vehicle/seat.svg" });

  if (v?.hasAC) features.push({ label: "AC", icon: "vehicle/wind.svg" });

  return features;
}

function toBookingRecord(b: ApiBookingRaw): BookingRecord {
  const v = b.vechicle;
  const days = calcDays(b.pickUpDate, b.returnDate);
  const paid = (v?.pricePerDay ?? 0) * days;

  return {
    id: b.id,
    bookingNumber: `#${b.id.slice(0, 8).toUpperCase()}`,
    from: b.pickUpLocation,
    to: b.dropOffLocation,
    pickup: formatDate(b.pickUpDate),
    return: b.returnDate ? formatDate(b.returnDate) : "—",
    status: STATUS_MAP[b.status] ?? "Pending",
    currency: "Rs",
    paid,
    tripType: TRIP_TYPE_MAP[b.tripType] ?? "long",
    vehicle: {
      name: v?.vechileName ?? "Unknown Vehicle",
      plateNumber: v?.vechileNumber ?? "",
      image: v?.vechileImage ?? "",
      features: buildFeatures(v),
    },
  };
}

// ── Constants ─────────────────────────────────────────────────────────────────
const ITEMS_PER_PAGE = 6;

// ── Component ─────────────────────────────────────────────────────────────────
export default function BookingHistoryClient() {
  const [activeTab, setActiveTab] = useState<TripTab>("long");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError } = useMyBookings({
    tripType: UI_TO_API_TRIP[activeTab],
    sort: sortBy as "latest" | "oldest",
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  // Transform raw API data → BookingRecord[]
  const allBookings: BookingRecord[] = (
    (data?.data ?? []) as unknown as ApiBookingRaw[]
  ).map(toBookingRecord);

  // Client-side filter by status and search (server already filters by tripType + sort + page)
  const filtered = allBookings.filter((b) => {
    const matchesStatus =
      statusFilter === "All Status" || b.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      b.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const totalPages = data?.pagination?.totalPages ?? 1;

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col gap-6">
        <BookingHistoryHeader />

        <BookingHistoryFilters
          searchQuery={searchQuery}
          onSearchChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={(v) => {
            setSortBy(v);
            setCurrentPage(1);
          }}
        />

        <BookingHistoryTabs
          activeTab={activeTab}
          onChange={(v) => {
            setActiveTab(v);
            setCurrentPage(1);
          }}
        />

        {isLoading && (
          <div className="text-center py-16 text-black font-poppins text-[16px]">
            Loading bookings…
          </div>
        )}

        {isError && (
          <div className="text-center py-16 text-red-500 font-poppins text-[16px]">
            Failed to load bookings. Please try again.
          </div>
        )}

        {!isLoading && !isError && <BookingHistoryList bookings={filtered} />}

        {!isLoading && !isError && filtered.length > 0 && (
          <BookingHistoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}
