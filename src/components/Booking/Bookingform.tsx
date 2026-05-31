"use client";

import { useState } from "react";
import {
  TRIP_TYPES,
  DRIVER_TYPES,
  CUSTOM_TRIP_NOTE,
} from "@/constants/booking.constants";
import type { BookingFormState, TripTab } from "@/types/booking.types";
import DestinationPopup from "./Destinationpopup";
import DatePickerPopup from "./Datepickerpopup";
import PassengersPopup from "./Passengerspopup";

interface BookingFormProps {
  tripTab: TripTab;
  state: BookingFormState;
  onChange: (s: BookingFormState) => void;
}

export default function BookingForm({
  tripTab,
  state,
  onChange,
}: BookingFormProps) {
  const [destOpen, setDestOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  const totalPassengers = state.passengers.adults + state.passengers.children;
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  if (tripTab === "custom") {
    return (
      <div className="py-6 px-4 text-center">
        <p className="text-sm text-gray-500 font-poppins max-w-md mx-auto">
          {CUSTOM_TRIP_NOTE}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          <div className="flex items-center gap-4">
            {TRIP_TYPES.map((t) => (
              <label
                key={t.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="tripType"
                  checked={state.tripType === t.value}
                  onChange={() => onChange({ ...state, tripType: t.value })}
                  className="accent-[#FEA800] w-4 h-4"
                />
                <span className="text-sm font-medium font-poppins text-gray-700">
                  {t.label}
                </span>
              </label>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {DRIVER_TYPES.map((d) => (
              <label
                key={d.value}
                className="flex items-center gap-2 cursor-pointer"
              >
                <input
                  type="radio"
                  name="driverType"
                  checked={state.driverType === d.value}
                  onChange={() => onChange({ ...state, driverType: d.value })}
                  className="accent-[#FEA800] w-4 h-4"
                />
                <span className="text-sm font-medium font-poppins text-gray-700">
                  {d.label}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-0 border border-gray-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setDestOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-[140px] px-4 py-3 hover:bg-gray-50 transition-colors border-r border-gray-200"
          >
            <div className="text-left">
              <p className="text-xs text-gray-400 font-poppins">From</p>
              <p className="text-sm font-medium text-gray-800 font-poppins">
                {state.destination.from || "Enter pickup location"}
              </p>
            </div>
          </button>

          <div className="px-3 text-[#FEA800]">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path
                d="M9 3v12M3 9l6-6 6 6M3 9l6 6 6-6"
                stroke="#FEA800"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <button
            onClick={() => setDestOpen(true)}
            className="flex items-center gap-3 flex-1 min-w-[140px] px-4 py-3 hover:bg-gray-50 transition-colors border-l border-gray-200"
          >
            <div className="text-left">
              <p className="text-xs text-gray-400 font-poppins">To</p>
              <p className="text-sm font-medium text-gray-800 font-poppins">
                {state.destination.to || "Enter drop location"}
              </p>
            </div>
          </button>

          <div className="w-px h-12 bg-gray-200" />

          <button
            onClick={() => setDateOpen(true)}
            className="flex-1 min-w-[130px] px-4 py-3 hover:bg-gray-50 transition-colors border-l border-gray-200 text-left"
          >
            <p className="text-xs text-gray-400 font-poppins">Pickup</p>
            <p className="text-sm font-medium text-gray-800 font-poppins">
              {state.dateRange.pickup || "Select date"}
            </p>
          </button>

          {state.tripType === "round-trip" && (
            <>
              <div className="w-px h-12 bg-gray-200" />
              <button
                onClick={() => setDateOpen(true)}
                className="flex-1 min-w-[130px] px-4 py-3 hover:bg-gray-50 transition-colors border-l border-gray-200 text-left"
              >
                <p className="text-xs text-gray-400 font-poppins">Return</p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {state.dateRange.return || "Select date"}
                </p>
              </button>
            </>
          )}

          <div className="w-px h-12 bg-gray-200" />

          <button
            onClick={() => setPassOpen(true)}
            className="flex-1 min-w-[130px] px-4 py-3 hover:bg-gray-50 transition-colors border-l border-gray-200 text-left flex items-center justify-between"
          >
            <div>
              <p className="text-xs text-gray-400 font-poppins">
                Total Passengers
              </p>
              <p className="text-sm font-medium text-gray-800 font-poppins">
                {passengerLabel}
              </p>
            </div>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 5l4 4 4-4"
                stroke="#9CA3AF"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex justify-end">
          <button className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-10 py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors">
            Search Ride
          </button>
        </div>
      </div>

      <DestinationPopup
        open={destOpen}
        onClose={() => setDestOpen(false)}
        onSelect={(dest) => onChange({ ...state, destination: dest })}
      />

      <DatePickerPopup
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        dateRange={state.dateRange}
        onConfirm={(range) => onChange({ ...state, dateRange: range })}
      />

      <PassengersPopup
        open={passOpen}
        onClose={() => setPassOpen(false)}
        passengers={state.passengers}
        onConfirm={(p) => onChange({ ...state, passengers: p })}
      />
    </>
  );
}
