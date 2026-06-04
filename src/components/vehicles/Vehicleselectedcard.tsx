"use client";

import Image from "next/image";
import VehicleFeatureBadge from "../vehicles/VehicleFeatureBadge";
import { VehicleFeature } from "@/types/features/vehicle.types";

export interface SelectedVehicle {
  id: string;
  name: string;
  plateNumber: string;
  imageUrl: string;
  rating: number;
  totalTrips: number;
  startingPrice: number;
  currency?: string;
  features: VehicleFeature[];
}

interface VehicleSelectedCardProps {
  vehicle: SelectedVehicle;
  onChangeVehicle?: () => void;
}

export default function VehicleSelectedCard({
  vehicle,
  onChangeVehicle,
}: VehicleSelectedCardProps) {
  const {
    name,
    plateNumber,
    imageUrl,
    features,
    rating,
    totalTrips,
    startingPrice,
    currency = "Rs",
  } = vehicle;

  return (
    <div className="bg-white rounded-2xl border border-[#808080]/50 overflow-hidden font-poppins">
      {/* Section title */}
      <div className="px-4 pt-4 pb-3">
        <h3 className="text-[15px] font-semibold text-black font-sora">
          Vehicle Selected
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 px-4 pb-4">
        <div className="relative w-full sm:w-[200px] h-[200px] sm:h-auto shrink-0 overflow-hidden rounded-2xl">
          <Image
            src={imageUrl}
            alt={name}
            fill
            className="object-cover object-center"
          />
          {/* Rating badge */}
          <div className="absolute bottom-2 right-2 flex items-center gap-1 bg-white text-black text-[10px] font-poppins font-semibold px-2 py-0.5 rounded-full shadow-sm whitespace-nowrap">
            <Image src="/vehicle/star.svg" alt="star" width={11} height={11} />
            <span>
              {rating.toFixed(1)} ({totalTrips}+ trips)
            </span>
          </div>
        </div>

        {/* Right: Details */}
        <div className="flex flex-col flex-1 min-w-0 justify-between gap-3">
          {/* Name + plate */}
          <div>
            <h3 className="text-[16px] sm:text-[18px] font-semibold text-black font-poppins leading-tight">
              {name}
            </h3>
            <p className="text-[12px] sm:text-[14px] text-black font-poppins mt-0.5">
              {plateNumber}
            </p>
          </div>

          {/* Features */}
          <div className="bg-[#F5F5F5] rounded-xl px-3 py-2.5 grid grid-cols-2 gap-x-4 gap-y-2">
            {features.map((f) => (
              <VehicleFeatureBadge key={f.label} {...f} />
            ))}
          </div>

          {/* Price + Change Vehicle */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div>
              <p className="text-[11px] text-black font-poppins leading-none mb-0.5">
                Starting from
              </p>
              <p className="text-[20px] sm:text-[22px] text-[#FEA800] font-poppins font-bold leading-tight">
                {currency} {startingPrice.toLocaleString()}
              </p>
            </div>
            {onChangeVehicle && (
              <button
                onClick={onChangeVehicle}
                className="flex items-center gap-1.5 bg-[#FEA800] text-black text-[13px] font-medium font-poppins px-5 py-2.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-3.5 h-3.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                  <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                  <path d="M8 16H3v5" />
                </svg>
                Change Vehicle
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
