"use client";

import Image from "next/image";
import { ArrowLeftRight, Pencil } from "lucide-react";
import type { BookingFormState } from "@/types/booking.types";

interface BookingSummaryCardProps {
  state: BookingFormState;
  onEdit?: () => void;
  showEdit?: boolean;
}

export default function BookingSummaryCard({
  state,
  onEdit,
  showEdit = true,
}: BookingSummaryCardProps) {
  const totalPassengers = state.passengers.adults + state.passengers.children;
  const passengerLabel =
    totalPassengers > 0
      ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
      : "Enter passengers";

  return (
    <>
      {/* ── DESKTOP ── */}
      <div className="hidden lg:flex w-full border border-[#808080]/50 rounded-full overflow-hidden bg-white text-sm font-poppins items-center px-2">
        <div className="px-5 py-4 flex items-center">
          <span className="text-black text-[16px] whitespace-nowrap">
            {state.tripType === "round-trip" ? "Round Trip" : "One Way"}
          </span>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex items-center">
          <span className="text-black text-[16px] font-poppins whitespace-nowrap">
            {state.driverType === "with-driver" ? "With Driver" : "Self Drive"}
          </span>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex items-center gap-3 flex-1 min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/ride/locationgreen.svg"
              alt="from"
              width={28}
              height={28}
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[14px] text-black font-poppins leading-none">
                From
              </p>
              <p className="text-black font-poppins text-[16px] truncate">
                {state.destination.from || "Enter pickup location"}
              </p>
            </div>
          </div>

          <ArrowLeftRight className="w-5 h-5 text-[#FEA800] shrink-0" />

          <div className="flex items-center gap-2 min-w-0">
            <Image
              src="/ride/locationred.svg"
              alt="to"
              width={28}
              height={28}
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[14px] text-black font-poppins leading-none">
                To
              </p>
              <p className="text-black font-poppins text-[16px] truncate">
                {state.destination.to || "Enter drop location"}
              </p>
            </div>
          </div>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex flex-col justify-center">
          <p className="text-[14px] text-black font-poppins leading-none mb-0.5">
            Pickup
          </p>
          <p className="text-black font-poppins text-[16px] whitespace-nowrap">
            {state.dateRange.pickup || "2083/02/07-08:00 AM"}
          </p>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex flex-col justify-center">
          <p className="text-[14px] text-black font-poppins leading-none mb-0.5">
            Return
          </p>
          <p className="text-black font-poppins text-[16px] whitespace-nowrap">
            {state.dateRange.return || "2083/02/07-08:00 AM"}
          </p>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex flex-col justify-center">
          <p className="text-[14px] text-black font-poppins leading-none mb-0.5">
            Total Passengers
          </p>
          <p className="text-black font-poppins text-[16px] whitespace-nowrap">
            {passengerLabel}
          </p>
        </div>

        {showEdit && onEdit && (
          <div className="px-4 py-4 flex items-center ml-auto">
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 bg-[#FEA800] rounded-full px-3 py-1.5 text-[14px] text-black transition-colors whitespace-nowrap cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          </div>
        )}
      </div>

      {/* ── MOBILE ── */}
      <div className="flex lg:hidden flex-col border border-[#808080]/50 rounded-2xl bg-white font-poppins overflow-hidden">
        {/* Row 1: Trip type + Driver + Edit */}
        <div className="flex items-center px-4 py-3">
          <span className="text-black text-[15px] font-medium">
            {state.tripType === "round-trip" ? "Round Trip" : "One Way"}
          </span>
          <div className="w-px h-5 bg-[#808080]/50 mx-4 shrink-0" />
          <span className="text-black text-[15px] font-medium">
            {state.driverType === "with-driver" ? "With Driver" : "Self Drive"}
          </span>
          {showEdit && onEdit && (
            <button
              onClick={onEdit}
              className="flex items-center gap-1.5 bg-[#FEA800] rounded-full px-3 py-1.5 text-[13px] font-medium text-black ml-auto whitespace-nowrap"
            >
              <Pencil className="w-3.5 h-3.5" />
              Edit
            </button>
          )}
        </div>

        <div className="h-px bg-[#808080]/30 mx-4" />

        {/* Row 2: From / To */}
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Image
              src="/ride/locationgreen.svg"
              alt="from"
              width={22}
              height={22}
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] text-black font-poppins leading-none">
                From
              </p>
              <p className="text-black font-poppins text-[14px] truncate font-medium">
                {state.destination.from || "Enter pickup location"}
              </p>
            </div>
          </div>
          <ArrowLeftRight className="w-4 h-4 text-[#FEA800] shrink-0" />
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Image
              src="/ride/locationred.svg"
              alt="to"
              width={22}
              height={22}
              className="shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[11px] text-black font-poppins leading-none">
                To
              </p>
              <p className="text-black font-poppins text-[14px] truncate font-medium">
                {state.destination.to || "Enter drop location"}
              </p>
            </div>
          </div>
        </div>

        <div className="h-px bg-[#808080]/30 mx-4" />

        {/* Row 3: Pickup + Return */}
        <div className="grid grid-cols-2 divide-x divide-[#808080]/30">
          <div className="px-4 py-3">
            <p className="text-[11px] text-black font-poppins leading-none mb-0.5">
              Pickup
            </p>
            <p className="text-black font-poppins text-[14px] font-medium">
              {state.dateRange.pickup || "2083/02/07-08:00 AM"}
            </p>
          </div>
          <div className="px-4 py-3">
            <p className="text-[11px] text-black font-poppins leading-none mb-0.5">
              Return
            </p>
            <p className="text-black font-poppins text-[14px] font-medium">
              {state.dateRange.return || "2083/02/07-08:00 AM"}
            </p>
          </div>
        </div>

        <div className="h-px bg-[#808080]/30 mx-4" />

        {/* Row 4: Total Passengers */}
        <div className="px-4 py-3">
          <p className="text-[11px] text-black font-poppins leading-none mb-0.5">
            Total Passengers
          </p>
          <p className="text-black font-poppins text-[14px] font-medium">
            {passengerLabel}
          </p>
        </div>
      </div>
    </>
  );
}
