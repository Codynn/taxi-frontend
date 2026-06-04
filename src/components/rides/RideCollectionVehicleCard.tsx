"use client";

import Image from "next/image";
import type { Vehicle } from "@/types/features/vehicle.types";
import VehicleFeatureBadge from "../vehicles/VehicleFeatureBadge";

interface RideCollectionVehicleCardProps {
  vehicle: Vehicle;
  onChoose?: (vehicle: Vehicle) => void;
}

export default function RideCollectionVehicleCard({
  vehicle,
  onChoose,
}: RideCollectionVehicleCardProps) {
  const {
    name,
    plateNumber,
    image,
    rating,
    trips,
    features,
    startingPrice,
    currency,
  } = vehicle;

  return (
    <div className="bg-white rounded-2xl border border-[#808080]/50 overflow-hidden">
      {/* ── MOBILE ── */}
      <div className="flex flex-col lg:hidden">
        <div className="relative w-full h-[200px]">
          <Image
            src={`/${image}`}
            alt={name}
            fill
            className="object-cover rounded-2xl p-2"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-black text-[11px] font-poppins font-semibold px-2.5 py-1 rounded-full shadow-sm">
            <Image src="/vehicle/star.svg" alt="star" width={12} height={12} />
            <span>
              {rating.toFixed(1)} ({trips}+ trips)
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div>
            <h3 className="text-[16px] font-semibold text-black font-poppins">
              {name}
            </h3>
            <p className="text-[13px] text-black font-poppins">{plateNumber}</p>
          </div>
          <div className="bg-[#F5f5f5] rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-2">
            {features.map((f) => (
              <VehicleFeatureBadge key={f.label} {...f} />
            ))}
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] text-black font-poppins leading-none mb-1">
                Starting from
              </p>
              <p className="text-[20px] text-[#FEA800] font-poppins font-bold leading-tight">
                {currency} {startingPrice.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onChoose?.(vehicle)} // ← same as desktop now
              className="bg-[#FEA800] text-black text-[13px] font-medium font-poppins px-5 py-2.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0"
            >
              Choose Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex flex-row p-4">
        <div className="relative w-[290px] shrink-0 min-h-[180px]">
          <Image
            src={`/${image}`}
            alt={name}
            fill
            className="rounded-xl object-center"
          />
          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-black text-[11px] font-poppins font-semibold px-2.5 py-1 rounded-full shadow-sm">
            <Image src="/vehicle/star.svg" alt="star" width={12} height={12} />
            <span>
              {rating.toFixed(1)} ({trips}+ trips)
            </span>
          </div>
        </div>
        <div className="flex flex-col flex-1 min-w-0 pl-2">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h3 className="text-[18px] font-semibold text-black font-poppins">
              {name}
            </h3>
            <p className="text-[14px] text-black font-poppins">{plateNumber}</p>
          </div>
          <div className="bg-[#f5f5f5] rounded-xl mx-0 px-6 py-3.5 flex items-center gap-8 flex-wrap">
            {features.map((f) => (
              <VehicleFeatureBadge key={f.label} {...f} />
            ))}
          </div>
          <div className="flex items-center justify-between px-6 pt-4 pb-5">
            <div>
              <p className="text-[12px] text-black font-poppins leading-none mb-1">
                Starting from
              </p>
              <p className="text-[24px] text-[#FEA800] font-poppins font-bold leading-tight">
                {currency} {startingPrice.toLocaleString()}
              </p>
            </div>
            <button
              onClick={() => onChoose?.(vehicle)}
              className="bg-[#FEA800] text-black text-[14px] font-medium font-poppins px-7 py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0"
            >
              Choose Vehicle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
