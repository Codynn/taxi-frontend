"use client";

import Image from "next/image";
import type { ApiVehicle } from "@/hooks/useVehicle";
import type { SelectedVehicle } from "../vehicles/Vehicleselectedcard";
import { useAuthStore } from "@/store/useAuthStore";
import { useAuthModal } from "@/context/Authmodalcontext";

interface RideCollectionVehicleCardProps {
  vehicle: ApiVehicle;
  calculatedPrice?: number;
  isCustomTrip?: boolean;
  onChoose?: (vehicle: SelectedVehicle) => void;
}

function FeatureBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-gray-600 font-poppins truncate">
      <Image src={`/${icon}`} alt={label} width={14} height={14} className="shrink-0" />
      <span className="truncate">{label}</span>
    </span>
  );
}

function getGearIcon(gearType: string): string {
  return gearType.toLowerCase() === "automatic"
    ? "vehicle/battery.svg"
    : "vehicle/settings.svg";
}

export default function RideCollectionVehicleCard({
  vehicle,
  calculatedPrice,
  onChoose,
  isCustomTrip,
}: RideCollectionVehicleCardProps) {
  const user = useAuthStore((s) => s.user);
  const { openModal } = useAuthModal();

  const {
    id,
    vechileName,
    vechileImage,
    vechileNumber,
    vechileFuelType,
    vechileGearType,
    noOfSeats,
    priceIncreasePercentage,
    hasAC,
  } = vehicle;

  const hasPrice = calculatedPrice !== undefined;
  const isUnavailable = vehicle.isAvailableForDates === false;

  const handleChoose = () => {
    if (isUnavailable) return;
    if (!user) {
      openModal("login");
      return;
    }

    onChoose?.({
      id,
      name: vechileName,
      plateNumber: vechileNumber,
      imageUrl: vechileImage,
      rating: 0,
      totalTrips: 0,
      startingPrice: calculatedPrice ?? 0,
      currency: "Rs",
      priceIncreasePercentage,
      features: [
        { label: vechileFuelType, icon: "vehicle/fuel.svg" },
        { label: `${noOfSeats} Seats`, icon: "vehicle/seat.svg" },
        ...(hasAC ? [{ label: "AC", icon: "vehicle/wind.svg" }] : []),
      ],
    });
  };

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden transition-all duration-300 ease-out ${
        isUnavailable
          ? "border-[#808080]/30 opacity-60"
          : "border-[#808080]/50 hover:-translate-y-1 hover:shadow-xl"
      }`}
    >
      <div className="flex flex-col gap-3 p-4">
        {/* Image left, details right */}
        <div className="flex items-start gap-4">
          <div className="relative w-[110px] sm:w-[140px] aspect-square shrink-0 rounded-xl overflow-hidden">
            <Image
              src={vechileImage}
              alt={vechileName}
              fill
              className="object-cover object-center"
              unoptimized
            />
            {isUnavailable && (
              <div className="absolute top-1.5 left-1.5 bg-black/70 text-white text-[9px] sm:text-[11px] font-poppins font-medium px-2 py-0.5 sm:py-1 rounded-full">
                Not available
              </div>
            )}
          </div>

          <div className="flex flex-col flex-1 min-w-0 gap-2 self-stretch">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[15px] sm:text-[18px] font-semibold text-black font-poppins truncate">
                {vechileName}
              </h3>
              <p className="text-[12px] sm:text-[14px] text-black font-poppins shrink-0">
                {vechileNumber}
              </p>
            </div>
            <div className="bg-[#F5F5F5] rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 grid grid-cols-2 gap-x-3 sm:gap-x-6 gap-y-1.5 sm:gap-y-2 flex-1">
              {vechileFuelType && (
                <FeatureBadge label={vechileFuelType} icon="vehicle/fuel.svg" />
              )}
              {vechileGearType && (
                <FeatureBadge
                  label={vechileGearType}
                  icon={getGearIcon(vechileGearType)}
                />
              )}
              <FeatureBadge label={`${noOfSeats} Seats`} icon="vehicle/seat.svg" />
              {hasAC && <FeatureBadge label="AC" icon="vehicle/wind.svg" />}
            </div>
          </div>
        </div>

        {/* Price + Choose — full width row below */}
        <div
          className={`flex items-center gap-3 ${
            isCustomTrip ? "justify-end" : "justify-between"
          }`}
        >
          {!isCustomTrip &&
            (hasPrice ? (
              <div>
                <p className="text-[11px] text-black font-poppins leading-none mb-1">
                  Starting From
                </p>
                <p className="text-[20px] sm:text-[24px] text-[#FEA800] font-poppins font-bold leading-tight">
                  Rs {calculatedPrice.toLocaleString()}
                </p>
              </div>
            ) : (
              <p className="text-[12px] text-gray-400 font-poppins">
                Select route to see price
              </p>
            ))}
          <button
            onClick={handleChoose}
            disabled={isUnavailable}
            className="bg-[#FEA800] text-black text-[13px] sm:text-[14px] font-medium font-poppins px-5 sm:px-7 py-2.5 sm:py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#FEA800]"
          >
            {isUnavailable ? "Not Available" : "Choose Vehicle"}
          </button>
        </div>
      </div>
    </div>
  );
}
