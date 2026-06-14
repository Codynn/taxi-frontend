"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, SlidersHorizontal, X, Car } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import RideCollectionVehicleCard from "@/components/rides/RideCollectionVehicleCard";
import RideFilterPanel, {
  AppliedFilters,
} from "@/components/rides/RideFilterPanel";
import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useVehicles } from "@/hooks/useVehicle";
import type { ApiVehicle } from "@/hooks/useVehicle";
import { usePublicVehicleCategories } from "@/hooks/useVehicleCategories";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { api } from "@/lib/axios";

const PRICE_MAX = 10000;
const ITEMS_PER_PAGE = 6;

const SORT_OPTIONS = [
  {
    value: "recommended",
    label: "Recommended",
    sortBy: "createdAt",
    sortOrder: "desc",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
    sortBy: "pricePerDay",
    sortOrder: "asc",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
    sortBy: "pricePerDay",
    sortOrder: "desc",
  },
  {
    value: "name-asc",
    label: "Name: A to Z",
    sortBy: "vechileName",
    sortOrder: "asc",
  },
] as const;

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

function VehicleCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex flex-col lg:hidden p-4 gap-3">
        <Skeleton className="w-full h-[200px] rounded-xl" />
        <Skeleton className="h-5 w-40" />
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

function TabsSkeleton() {
  return (
    <div className="w-full border-b border-gray-200 flex items-center justify-center gap-6 pb-3">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-6 w-24 rounded-lg" />
      ))}
    </div>
  );
}

export default function ChooseRideClient() {
  const router = useRouter();
  const { bookingState, setBookingState, setSelectedVehicle } =
    useBookingStore();

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<
    "recommended" | "price-low" | "price-high" | "name-asc"
  >("recommended");
  const [appliedFilters, setAppliedFilters] = useState<AppliedFilters>({
    gearTypes: [],
    fuelTypes: [],
    priceRange: [0, PRICE_MAX],
    hasAC: undefined,
  });

  const { data: categories = [], isLoading: catsLoading } =
    usePublicVehicleCategories();
  const activeCat = activeCategoryId ?? categories[0]?.id ?? null;

  useEffect(() => {
    if (catsLoading || categories.length === 0 || activeCategoryId) return;

    const findFirstActiveCategory = async () => {
      for (const cat of categories) {
        try {
          const res = await api.get<{ meta: { total: number } }>(
            "/vechicle/get-all",
            { params: { categoryId: cat.id, limit: 1 } },
          );
          if (res.data.meta.total > 0) {
            setActiveCategoryId(cat.id);
            break;
          }
        } catch {
          // skip
        }
      }
    };

    findFirstActiveCategory();
  }, [catsLoading, categories]);

  const activeSortOption =
    SORT_OPTIONS.find((o) => o.value === sortBy) ?? SORT_OPTIONS[0];

  const {
    data: allVehicles = [],
    isLoading,
    isError,
  } = useVehicles({
    categoryId: activeCat ?? undefined,
    sortBy: activeSortOption.sortBy,
    sortOrder: activeSortOption.sortOrder,
    ...(appliedFilters.gearTypes.length === 1
      ? { vechileGearType: appliedFilters.gearTypes[0] }
      : {}),
    ...(appliedFilters.fuelTypes.length === 1
      ? { vechileFuelType: appliedFilters.fuelTypes[0] }
      : {}),
    ...(appliedFilters.hasAC !== undefined
      ? { hasAC: appliedFilters.hasAC }
      : {}),
    ...(appliedFilters.priceRange[0] > 0
      ? { minPrice: appliedFilters.priceRange[0] }
      : {}),
    ...(appliedFilters.priceRange[1] < PRICE_MAX
      ? { maxPrice: appliedFilters.priceRange[1] }
      : {}),
  });

  const filtered = allVehicles.filter((v) => {
    if (
      appliedFilters.gearTypes.length > 1 &&
      !appliedFilters.gearTypes.includes(v.vechileGearType)
    )
      return false;
    if (
      appliedFilters.fuelTypes.length > 1 &&
      !appliedFilters.fuelTypes.includes(v.vechileFuelType)
    )
      return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const getPageNumbers = (): (number | "...")[] => {
    if (totalPages <= 7)
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (currentPage >= totalPages - 3)
      return [
        1,
        "...",
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  const handleFilterApply = async (filters: AppliedFilters) => {
    setAppliedFilters(filters);
    setCurrentPage(1);

    const filterParams: Record<string, unknown> = { limit: 1 };
    if (filters.gearTypes.length === 1)
      filterParams.vechileGearType = filters.gearTypes[0];
    if (filters.gearTypes.length > 1)
      filterParams.gearTypes = filters.gearTypes.join(",");
    if (filters.fuelTypes.length === 1)
      filterParams.vechileFuelType = filters.fuelTypes[0];
    if (filters.fuelTypes.length > 1)
      filterParams.fuelTypes = filters.fuelTypes.join(",");
    if (filters.hasAC !== undefined) filterParams.hasAC = filters.hasAC;
    if (filters.priceRange[0] > 0)
      filterParams.minPrice = filters.priceRange[0];
    if (filters.priceRange[1] < PRICE_MAX)
      filterParams.maxPrice = filters.priceRange[1];

    for (const cat of categories) {
      try {
        const res = await api.get<{
          data: ApiVehicle[];
          meta: { total: number };
        }>("/vechicle/get-all", {
          params: { ...filterParams, categoryId: cat.id },
        });
        if (res.data.meta.total > 0) {
          setActiveCategoryId(cat.id);
          break;
        }
      } catch {
        // skip
      }
    }
  };

  const handleFilterReset = () => {
    setAppliedFilters({
      gearTypes: [],
      fuelTypes: [],
      priceRange: [0, PRICE_MAX],
      hasAC: undefined,
    });
    setCurrentPage(1);
    setActiveCategoryId(categories[0]?.id ?? null);
  };

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 mt-20">
        {/* Go Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[16px] font-poppins text-black w-fit cursor-pointer"
        >
          <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
          Go Back
        </button>

        <BookingSummaryBar state={bookingState} onUpdate={setBookingState} />

        <h2 className="text-[20px] md:text-[24px] font-semibold font-sora text-black text-center">
          Available Rides for Your Trip
        </h2>

        {/* Sort + Mobile filter trigger */}
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
              className="h-full w-full rounded-t-3xl p-0 flex flex-col"
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
              <div className="p-5 overflow-y-auto">
                <RideFilterPanel
                  hideHeader
                  onApply={handleFilterApply}
                  onReset={handleFilterReset}
                />
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort By */}
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-[13px] text-black font-poppins hidden sm:block">
              Sort By:
            </span>
            <Select
              value={sortBy}
              onValueChange={(val) => {
                if (val) setSortBy(val as typeof sortBy);
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
        </div>

        {/* Dynamic category tabs */}
        <div className="mb-2">
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
                        setCurrentPage(1);
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

        {/* Body */}
        <div className="flex gap-6 items-start">
          {/* Desktop filter */}
          <div className="hidden lg:block w-[260px] shrink-0 sticky top-6">
            <RideFilterPanel
              onApply={handleFilterApply}
              onReset={handleFilterReset}
            />
          </div>

          {/* Cards */}
          <div className="flex-1 min-w-0 flex flex-col gap-4">
            {isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <VehicleCardSkeleton key={i} />
              ))}

            {isError && (
              <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
                  <Car className="w-7 h-7 text-red-400" />
                </div>
                <p className="text-[14px] text-gray-500 font-poppins">
                  Failed to load vehicles.
                </p>
              </div>
            )}

            {!isLoading && !isError && filtered.length === 0 && (
              <div className="text-center py-16 text-gray-400 font-poppins text-sm">
                No vehicles match the selected filters.
              </div>
            )}

            {!isLoading &&
              !isError &&
              paginated.map((vehicle) => (
                <RideCollectionVehicleCard
                  key={vehicle.id}
                  vehicle={vehicle}
                  onChoose={() => {
                    setSelectedVehicle(toSelectedVehicle(vehicle));
                    router.push("/complete-booking");
                  }}
                />
              ))}

            {!isLoading && filtered.length > ITEMS_PER_PAGE && (
              <div className="flex items-center justify-start gap-1.5 mt-6">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={24} />
                </button>
                {getPageNumbers().map((page, i) =>
                  page === "..." ? (
                    <span
                      key={`e-${i}`}
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
                          : "text-[#2E2E2E] hover:text-black",
                      ].join(" ")}
                    >
                      {page}
                    </button>
                  ),
                )}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="w-10 h-10 flex items-center justify-center rounded-[8px] bg-[#f5f5f5] text-black disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
