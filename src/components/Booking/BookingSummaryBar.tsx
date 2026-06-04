// components/Booking/BookingSummaryBar.tsx
"use client";

import Image from "next/image";
import {
  ArrowLeftRight,
  Pencil,
  ArrowUpDown,
  ChevronDown,
  X,
} from "lucide-react";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";
import { useState } from "react";
import {
  TRIP_TYPES,
  DRIVER_TYPES,
  DEFAULT_BOOKING_STATE,
} from "@/constants/booking.constants";
import type {
  BookingFormState,
  TripType,
  DriverType,
} from "@/types/booking.types";
import DatePickerPopup from "./Datepickerpopup";
import PassengersPopup from "./Passengerspopup";
import DestinationPopup from "./Destinationpopup";

interface BookingSummaryBarProps {
  state: BookingFormState;
  onUpdate: (state: BookingFormState) => void;
}

function CustomRadio<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className="flex items-center gap-2 group"
          >
            <div
              className={[
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                isSelected ? "border-[#FEA800]" : "border-gray-300",
              ].join(" ")}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEA800]" />
              )}
            </div>
            <span
              className={[
                "text-sm font-medium font-poppins",
                isSelected ? "text-[#FEA800]" : "text-gray-500",
              ].join(" ")}
            >
              {opt.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function BookingSummaryBar({
  state,
  onUpdate,
}: BookingSummaryBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editState, setEditState] = useState<BookingFormState>(state);
  const [activePopup, setActivePopup] = useState<
    "dest" | "date" | "pass" | null
  >(null);

  const totalPassengers = state.passengers.adults + state.passengers.children;

  const handleSearch = () => {
    onUpdate(editState);
    setSheetOpen(false);
  };

  return (
    <>
      <div className="hidden lg:flex w-full border border-[#808080]/50 rounded-full overflow-hidden bg-white text-sm font-poppins items-center px-2">
        <div className="px-5 py-4 flex items-center">
          <span className="text-black text-[16px]  whitespace-nowrap">
            {state.tripType === "round-trip" ? "Round Trip" : "One Way"}
          </span>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        {/* With Driver */}
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
              <p className="text-black font-poppins  text-[16px] truncate">
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
          <p className="text-black font-poppins  text-[16px] whitespace-nowrap">
            {state.dateRange.return || "2083/02/07-08:00 AM"}
          </p>
        </div>

        <div className="w-px h-6 bg-[#808080]/50 shrink-0" />

        <div className="px-5 py-4 flex flex-col justify-center">
          <p className="text-[14px] text-black font-poppins leading-none mb-0.5">
            Total Passengers
          </p>
          <p className="text-black font-poppins text-[16px] whitespace-nowrap">
            {totalPassengers > 0
              ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
              : "Enter passengers"}
          </p>
        </div>

        <div className="px-4 py-4 flex items-center ml-auto">
          <button
            onClick={() => {
              setEditState(state);
              setSheetOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#FEA800] rounded-full px-3 py-1.5 text-[14px]  text-black transition-colors whitespace-nowrap cursor-pointer"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
        </div>
      </div>

      {/* ── MOBILE summary card ── */}
      <div className="flex lg:hidden flex-col border border-[#808080]/50 rounded-2xl bg-white font-poppins overflow-hidden">
        <div className="flex items-center px-4 py-3">
          <span className="text-black text-[15px] font-medium">
            {state.tripType === "round-trip" ? "Round Trip" : "One Way"}
          </span>
          <div className="w-px h-5 bg-[#808080]/50 mx-4 shrink-0" />
          <span className="text-black text-[15px] font-medium">
            {state.driverType === "with-driver" ? "With Driver" : "Self Drive"}
          </span>
          <button
            onClick={() => {
              setEditState(state);
              setSheetOpen(true);
            }}
            className="flex items-center gap-1.5 bg-[#FEA800] rounded-full px-3 py-1.5 text-[13px] font-medium text-black ml-auto whitespace-nowrap"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
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

        <div className="px-4 py-3">
          <p className="text-[11px] text-black font-poppins leading-none mb-0.5">
            Total Passengers
          </p>
          <p className="text-black font-poppins text-[14px] font-medium">
            {totalPassengers > 0
              ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
              : "Enter passengers"}
          </p>
        </div>
      </div>

      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetContent
          side="right"
          className="!w-full sm:!w-[420px] p-0 overflow-y-auto flex flex-col [&>button]:hidden"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
            <h3 className="text-[18px] font-semibold font-sora text-black">
              Edit
            </h3>
            <SheetClose className="rounded-full p-1 hover:bg-gray-100 transition-colors">
              <X className="w-5 h-5 text-[#FE4830]" />
            </SheetClose>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
            <CustomRadio<TripType>
              options={TRIP_TYPES}
              value={editState.tripType}
              onChange={(v) => setEditState((s) => ({ ...s, tripType: v }))}
            />
            <CustomRadio<DriverType>
              options={DRIVER_TYPES}
              value={editState.driverType}
              onChange={(v) => setEditState((s) => ({ ...s, driverType: v }))}
            />

            {/* From / To */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              <button
                onClick={() => setActivePopup("dest")}
                className="w-full px-4 pt-4 pb-3 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  From
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {editState.destination.from || "Enter pickup location"}
                </p>
              </button>
              <div className="relative flex items-center px-4">
                <div className="flex-1 h-px bg-gray-200" />
                <button className="mx-3 w-8 h-8 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm shrink-0">
                  <ArrowUpDown size={14} className="text-[#FEA800]" />
                </button>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => setActivePopup("dest")}
                className="w-full px-4 pt-3 pb-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">To</p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {editState.destination.to || "Enter drop location"}
                </p>
              </button>
            </div>

            {/* Pickup + Return */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden grid grid-cols-2 divide-x divide-gray-200">
              <button
                onClick={() => setActivePopup("date")}
                className="px-4 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  Pickup
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {editState.dateRange.pickup || "2083/02/07-08:00 AM"}
                </p>
              </button>
              <button
                onClick={() => setActivePopup("date")}
                className="px-4 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  Return
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {editState.dateRange.return || "2083/02/07-08:00 AM"}
                </p>
              </button>
            </div>

            {/* Passengers */}
            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
              <button
                onClick={() =>
                  setActivePopup((p) => (p === "pass" ? null : "pass"))
                }
                className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Total Passengers
                  </p>
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {editState.passengers.adults +
                      editState.passengers.children >
                    0
                      ? `${editState.passengers.adults + editState.passengers.children} Passenger(s)`
                      : "Enter passengers"}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform ${activePopup === "pass" ? "rotate-180" : ""}`}
                />
              </button>
            </div>
          </div>

          <div className="px-6 pb-6 pt-3 shrink-0">
            <button
              onClick={handleSearch}
              className="w-full py-4 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-sm hover:bg-[#FEA800]/90 transition-colors"
            >
              Search Ride
            </button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Popups */}
      {activePopup === "dest" && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePopup(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <DestinationPopup
              open
              onClose={() => setActivePopup(null)}
              onSelect={(dest) => {
                setEditState((s) => ({ ...s, destination: dest }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}

      {activePopup === "date" && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePopup(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <DatePickerPopup
              open
              onClose={() => setActivePopup(null)}
              dateRange={editState.dateRange}
              onConfirm={(range) => {
                setEditState((s) => ({ ...s, dateRange: range }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}

      {activePopup === "pass" && (
        <div
          className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActivePopup(null);
          }}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <PassengersPopup
              open
              onClose={() => setActivePopup(null)}
              passengers={editState.passengers}
              onConfirm={(p) => {
                setEditState((s) => ({ ...s, passengers: p }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}
    </>
  );
}
