"use client";

import Image from "next/image";
import type { ApiVehicle } from "@/lib/api/vehicle.api";

interface VehicleCardProps {
  vehicle: ApiVehicle;
  onChoose?: (vehicle: ApiVehicle) => void;
}

function FeatureBadge({ label, icon }: { label: string; icon: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[12px] text-gray-600 font-poppins">
      <Image src={`/${icon}`} alt={label} width={14} height={14} />
      {label}
    </span>
  );
}

export default function VehicleCard({ vehicle, onChoose }: VehicleCardProps) {
  const {
    vechileName,
    vechileImage,
    vechileNumber,
    vechileFuelType,
    vechileGearType,
    noOfSeats,
    hasAC,
    pricePerDay,
  } = vehicle;

  return (
    <div className="bg-white rounded-2xl border border-[#808080]/50 transition-all duration-300 ease-out hover:translate-y-2 hover:shadow-xl flex flex-col p-4">
      {/* Image */}
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-2">
        <Image
          src={vechileImage}
          alt={vechileName}
          fill
          priority
          className="rounded-xl object-cover object-center"
          unoptimized
        />
      </div>

      <div className="flex flex-col gap-4 flex-1">
        {/* Name + plate */}
        <div>
          <h3 className="text-[18px] font-medium text-[#000000] font-poppins leading-snug">
            {vechileName}
          </h3>
          <p className="text-[14px] text-[#000000] font-poppins mt-0.5">
            {vechileNumber}
          </p>
        </div>

        {/* Features */}
        <div className="bg-gray-50 rounded-xl px-4 py-3.5 grid grid-cols-2 gap-x-6 gap-y-3">
          {vechileFuelType && (
            <FeatureBadge label={vechileFuelType} icon="vehicle/fuel.svg" />
          )}
          {vechileGearType && (
            <FeatureBadge label={vechileGearType} icon="vehicle/battery.svg" />
          )}
          <FeatureBadge label={`${noOfSeats} Seats`} icon="vehicle/seat.svg" />
          {hasAC && <FeatureBadge label="AC" icon="vehicle/wind.svg" />}
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          <div>
            <p className="text-[12px] text-[#000000] font-poppins leading-none mb-1">
              Per Day
            </p>
            <p className="text-[23px] text-[#FEA800] font-poppins font-bold leading-tight">
              Rs {pricePerDay?.toLocaleString()}
            </p>
          </div>
          <button
            onClick={() => onChoose?.(vehicle)}
            className="bg-[#FEA800] text-black text-[14px] font-medium font-poppins px-5 py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0 whitespace-nowrap"
          >
            Choose Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
