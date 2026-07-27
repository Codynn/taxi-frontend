"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronDown } from "lucide-react";
import { formatBsDate } from "@/lib/bs-date";
import type { BookingFormState } from "@/types/booking.types";
import CheckoutBookingSummary from "./CheckoutBookingSummary";
import VehicleSelectedCard, {
  type SelectedVehicle,
} from "@/components/vehicles/Vehicleselectedcard";

interface TripSummaryCollapsibleProps {
  bookingState: BookingFormState;
  vehicle: SelectedVehicle;
  onChangeVehicle: () => void;
  variant: "desktop" | "mobile";
  total?: number;
}

// Collapsed by default so the booking form / payment section (the thing the
// user actually needs to act on) is visible without scrolling. Expands to
// the full trip + vehicle detail on demand.
export default function TripSummaryCollapsible({
  bookingState,
  vehicle,
  onChangeVehicle,
  variant,
  total,
}: TripSummaryCollapsibleProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
            {vehicle.imageUrl ? (
              <Image
                src={vehicle.imageUrl}
                alt={vehicle.name}
                fill
                className="object-cover object-center"
                unoptimized
              />
            ) : null}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold font-poppins text-black truncate">
              {bookingState.destination.from || "Pickup"}
              {" → "}
              {bookingState.destination.to || "Drop"}
            </p>
            <p className="text-[11px] font-poppins text-black/50 truncate">
              {vehicle.name}
              {bookingState.dateRange.pickup
                ? ` · ${formatBsDate(bookingState.dateRange.pickup)}`
                : ""}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          {total != null && (
            <span className="text-[14px] font-semibold font-poppins text-black">
              Rs {total.toLocaleString()}
            </span>
          )}
          <span className="text-[12px] font-poppins text-black/50 hidden sm:inline">
            {expanded ? "Hide details" : "View details"}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      {expanded && (
        <div className="border-t border-gray-100 p-4 flex flex-col gap-4">
          <CheckoutBookingSummary
            bookingState={bookingState}
            variant={variant}
          />
          <VehicleSelectedCard
            vehicle={vehicle}
            onChangeVehicle={onChangeVehicle}
          />
        </div>
      )}
    </div>
  );
}
