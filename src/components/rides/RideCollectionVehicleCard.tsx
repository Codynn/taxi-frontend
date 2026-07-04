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
    <span className="flex items-center gap-1.5 text-[12px] text-gray-600 font-poppins">
      <Image src={`/${icon}`} alt={label} width={14} height={14} />
      {label}
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

  const handleChoose = () => {
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
    <div className="bg-white rounded-2xl border border-[#808080]/50 overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl">
      {/* ── MOBILE ── */}
      <div className="flex flex-col lg:hidden">
        <div className="relative w-full h-[200px]">
          <Image
            src={vechileImage}
            alt={vechileName}
            fill
            className="object-cover rounded-t-2xl"
            unoptimized
          />
        </div>
        <div className="flex flex-col gap-3 p-4">
          <div>
            <h3 className="text-[16px] font-semibold text-black font-poppins">
              {vechileName}
            </h3>
            <p className="text-[13px] text-black font-poppins">
              {vechileNumber}
            </p>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl px-4 py-3 flex flex-wrap gap-x-6 gap-y-2">
            {vechileFuelType && (
              <FeatureBadge label={vechileFuelType} icon="vehicle/fuel.svg" />
            )}
            {vechileGearType && (
              <FeatureBadge
                label={vechileGearType}
                icon={getGearIcon(vechileGearType)}
              />
            )}
            <FeatureBadge
              label={`${noOfSeats} Seats`}
              icon="vehicle/seat.svg"
            />
            {hasAC && <FeatureBadge label="AC" icon="vehicle/wind.svg" />}
          </div>
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
                  <p className="text-[20px] text-[#FEA800] font-poppins font-bold leading-tight">
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
              className="bg-[#FEA800] text-black text-[13px] font-medium font-poppins px-5 py-2.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shrink-0"
            >
              Choose Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex flex-row p-4">
        <div className="relative w-[290px] shrink-0 min-h-[180px] rounded-xl overflow-hidden">
          <Image
            src={vechileImage}
            alt={vechileName}
            fill
            className="object-cover object-center"
            unoptimized
          />
        </div>
        <div className="flex flex-col flex-1 min-w-0 pl-2">
          <div className="flex items-center justify-between px-6 pt-5 pb-4">
            <h3 className="text-[18px] font-semibold text-black font-poppins">
              {vechileName}
            </h3>
            <p className="text-[14px] text-black font-poppins">
              {vechileNumber}
            </p>
          </div>
          <div className="bg-[#F5F5F5] rounded-xl px-6 py-3.5 flex items-center gap-8 flex-wrap">
            {vechileFuelType && (
              <FeatureBadge label={vechileFuelType} icon="vehicle/fuel.svg" />
            )}
            {vechileGearType && (
              <FeatureBadge
                label={vechileGearType}
                icon={getGearIcon(vechileGearType)}
              />
            )}
            <FeatureBadge
              label={`${noOfSeats} Seats`}
              icon="vehicle/seat.svg"
            />
            {hasAC && <FeatureBadge label="AC" icon="vehicle/wind.svg" />}
          </div>

          <div
            className={`flex items-center px-6 pt-4 pb-5 ${
              isCustomTrip ? "justify-end" : "justify-between"
            }`}
          >
            {!isCustomTrip &&
              (hasPrice ? (
                <div>
                  <p className="text-[12px] text-black font-poppins leading-none mb-1">
                    Starting From
                  </p>
                  <p className="text-[24px] text-[#FEA800] font-poppins font-bold leading-tight">
                    Rs {calculatedPrice.toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-[13px] text-gray-400 font-poppins">
                  Select route to see price
                </p>
              ))}
            <button
              onClick={handleChoose}
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
