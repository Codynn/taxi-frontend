import Image from "next/image";
import type { Vehicle } from "@/types/features/vehicle.types";
import VehicleFeatureBadge from "./VehicleFeatureBadge";

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
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
    <div className="bg-white rounded-2xl border border-[#808080]/50 transition-all duration-300 ease-out hover:translate-y-2 hover:shadow-xl flex flex-col p-4">
      <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-2">
        <Image
          src={`/${image}`}
          alt={name}
          fill
          priority
          className="rounded-xl object-center"
        />
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white text-black text-[11px] font-poppins font-semibold px-2.5 py-1 rounded-full shadow-sm">
          <Image src="/vehicle/star.svg" alt="star" width={12} height={12} />
          <span>
            {rating.toFixed(1)} ({trips}+ trips)
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div>
          <h3 className="text-[18px] font-medium text-[#000000] font-poppins leading-snug">
            {name}
          </h3>
          <p className="text-[14px] text-[#000000] font-poppins mt-0.5">
            {plateNumber}
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl px-4 py-3.5 grid grid-cols-2 gap-x-6 gap-y-3">
          {features.map((f) => (
            <VehicleFeatureBadge key={f.label} {...f} />
          ))}
        </div>

        <div className="flex items-center justify-between gap-3 mt-auto pt-1">
          <div>
            <p className="text-[12px] text-[#000000] font-poppins leading-none mb-1">
              Starting from
            </p>
            <p className="text-[23px]  text-[#FEA800] font-poppins font-bold leading-tight">
              {currency} {startingPrice.toLocaleString()}
            </p>
          </div>
          <button className="bg-[#FEA800] text-black text-[14px] font-medium font-poppins px-5 py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0 whitespace-nowrap">
            Choose Vehicle
          </button>
        </div>
      </div>
    </div>
  );
}
