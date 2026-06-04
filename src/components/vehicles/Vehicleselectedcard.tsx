"use client";

import Image from "next/image";
import { Star, RefreshCw, Wind, Users } from "lucide-react";

export interface SelectedVehicle {
  id: string;
  name: string;
  plateNumber: string;
  imageUrl: string;
  fuelType: string;
  seats: number;
  hasAC: boolean;
  rating: number;
  totalTrips: number;
  startingPrice: number;
}

interface VehicleSelectedCardProps {
  vehicle: SelectedVehicle;
  onChangeVehicle?: () => void;
}

export default function VehicleSelectedCard({
  vehicle,
  onChangeVehicle,
}: VehicleSelectedCardProps) {
  return (
    <div className="border border-[#808080]/30 rounded-2xl bg-white overflow-hidden font-poppins">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <h3 className="text-[15px] font-semibold text-black font-sora">
          Vehicle Selected
        </h3>
      </div>

      {/* Vehicle info */}
      <div className="px-4 pb-4 flex gap-4">
        {/* Image */}
        <div className="relative w-[120px] h-[80px] rounded-xl overflow-hidden shrink-0 bg-gray-100">
          <Image
            src={vehicle.imageUrl}
            alt={vehicle.name}
            fill
            className="object-cover"
          />
          {/* Rating badge */}
          <div className="absolute bottom-1.5 left-1.5 flex items-center gap-1 bg-black/60 rounded-full px-2 py-0.5">
            <Star className="w-3 h-3 text-[#FEA800] fill-[#FEA800]" />
            <span className="text-white text-[10px] font-medium">
              {vehicle.rating} ({vehicle.totalTrips}+ trips)
            </span>
          </div>
        </div>

        {/* Details */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <p className="text-[15px] font-semibold text-black truncate">
              {vehicle.name}
            </p>
            <p className="text-[12px] text-gray-500">{vehicle.plateNumber}</p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <span className="w-4 h-4 flex items-center justify-center">
                ⚡
              </span>
              <span>{vehicle.fuelType}</span>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-gray-600">
              <Users className="w-3 h-3" />
              <span>{vehicle.seats} Seats</span>
            </div>
            {vehicle.hasAC && (
              <div className="flex items-center gap-1 text-[11px] text-gray-600">
                <Wind className="w-3 h-3" />
                <span>AC</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 mx-4" />

      {/* Price + Change */}
      <div className="px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-gray-500">Starting from</p>
          <p className="text-[18px] font-bold text-[#FEA800] font-sora">
            Rs {vehicle.startingPrice.toLocaleString()}
          </p>
        </div>
        {onChangeVehicle && (
          <button
            onClick={onChangeVehicle}
            className="flex items-center gap-1.5 bg-[#FEA800] rounded-full px-4 py-2 text-[13px] font-medium text-black hover:bg-[#e09700] transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Change Vehicle
          </button>
        )}
      </div>
    </div>
  );
}
