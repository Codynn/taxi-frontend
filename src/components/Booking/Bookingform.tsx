"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  TRIP_TYPES,
  DRIVER_TYPES,
  CUSTOM_TRIP_NOTE,
} from "@/constants/booking.constants";
import type {
  BookingFormState,
  TripTab,
  TripType,
  DriverType,
} from "@/types/booking.types";
import DatePickerPopup from "./Datepickerpopup";
import PassengersPopup from "./Passengerspopup";
import DestinationPopup from "./Destinationpopup";
import { useRouter } from "next/navigation";
import { useBookingStore } from "@/hooks/useBookingStore";
import { BookingType, TripType as ApiTripType } from "@/lib/api/booking.api";

interface BookingFormProps {
  tripTab: TripTab;
  state: BookingFormState;
  onChange: (s: BookingFormState) => void;
}

function CustomRadioGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
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
                "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
                isSelected
                  ? "border-[#FEA800]"
                  : "border-gray-300 group-hover:border-[#FEA800]/50",
              ].join(" ")}
            >
              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEA800]" />
              )}
            </div>
            <span
              className={[
                "text-sm font-medium font-poppins transition-colors",
                isSelected
                  ? "text-gray-900"
                  : "text-gray-500 group-hover:text-gray-700",
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

interface PortalDropdownProps {
  anchorRef: React.RefObject<HTMLElement>;
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
  children: React.ReactNode;
  minWidth?: number;
}

function PortalDropdown({
  anchorRef,
  open,
  onClose,
  align = "left",
  children,
  minWidth,
}: PortalDropdownProps) {
  const [pos, setPos] = useState({ top: 0, left: 0, right: 0, width: 0 });
  const portalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
        right: window.innerWidth - rect.right - window.scrollX,
        width: rect.width,
      });
    }
  }, [open, anchorRef]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = e.target as Node;
      const outsideAnchor =
        anchorRef.current && !anchorRef.current.contains(target);
      const outsidePortal =
        portalRef.current && !portalRef.current.contains(target);
      if (outsideAnchor && outsidePortal) onClose();
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open || typeof window === "undefined") return null;

  // On mobile, always anchor to left edge with near-full width
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const style: React.CSSProperties = isMobile
    ? {
        position: "absolute",
        top: pos.top,
        left: 12,
        right: 12,
        zIndex: 9999,
      }
    : align === "right"
      ? {
          position: "absolute",
          top: pos.top,
          right: pos.right,
          width: Math.max(pos.width, minWidth ?? 0),
          zIndex: 9999,
        }
      : {
          position: "absolute",
          top: pos.top,
          left: pos.left,
          minWidth: minWidth ?? 460,
          zIndex: 9999,
        };

  return createPortal(
    <div
      ref={portalRef}
      style={style}
      className="bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
    >
      {children}
    </div>,
    document.body,
  );
}

const toISO = (value: string) => {
  return new Date(value).toISOString();
};

export default function BookingForm({
  tripTab,
  state,
  onChange,
}: BookingFormProps) {
  const [destOpen, setDestOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  const router = useRouter();

  const destRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const passRef = useRef<HTMLButtonElement>(null);

  const { setModalData, setBookingState } = useBookingStore();

  const totalPassengers = state.passengers.adults + state.passengers.children;
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  const handleSubmit = () => {
    const bookingType: BookingType =
      state.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY";

    const apiTripType: ApiTripType =
      tripTab === "long"
        ? "LONG_TRIP"
        : tripTab === "short"
          ? "SHORT_TRIP"
          : "CUSTOM_TRIP";

    const driverRequired = state.driverType === "with-driver";

    setModalData({
      pickUpLocation: state.destination.from,
      dropOffLocation: state.destination.to,
      pickUpDate: toISO(state.dateRange.pickup),
      returnDate: state.dateRange.return ? toISO(state.dateRange.return) : "",
      bookingType,
      tripType: apiTripType,
      driverRequired,
    });

    setBookingState(state);

    router.push("/choose-ride");
  };

  if (tripTab === "custom") {
    return (
      <>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-0 gap-y-2 sm:gap-y-0">
            <CustomRadioGroup<TripType>
              options={TRIP_TYPES}
              value={state.tripType}
              onChange={(v) => onChange({ ...state, tripType: v })}
            />
            <div className="hidden sm:block w-px h-5 bg-gray-200 mx-5" />
            <CustomRadioGroup<DriverType>
              options={DRIVER_TYPES}
              value={state.driverType}
              onChange={(v) => onChange({ ...state, driverType: v })}
            />
          </div>

          <div className="flex flex-col gap-3 lg:hidden">
            <div
              ref={destRef}
              className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
            >
              <button
                onClick={() => setDestOpen(!destOpen)}
                className="w-full px-4 pt-4 pb-3 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  From
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {state.destination.from || "Enter pickup location"}
                </p>
              </button>
              <div className="relative flex items-center px-4">
                <div className="flex-1 h-px bg-gray-200" />
                <div className="mx-3 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm shrink-0">
                  <ArrowUpDown size={13} className="text-[#FEA800]" />
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => setDestOpen(!destOpen)}
                className="w-full px-4 pt-3 pb-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">To</p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {state.destination.to || "Enter drop location"}
                </p>
              </button>
            </div>

            <div className="grid border border-gray-200 rounded-2xl gap-3 grid-cols-2">
              <div className="rounded-2xl bg-white overflow-hidden">
                <button
                  ref={dateRef}
                  onClick={() => setDateOpen(!dateOpen)}
                  className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Pickup
                  </p>
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {state.dateRange.pickup || "Enter a pickup date"}
                  </p>
                </button>
              </div>
              <div className="rounded-2xl bg-white overflow-hidden">
                <button
                  onClick={() => setDateOpen(true)}
                  className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Return
                  </p>
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {state.dateRange.return || "Enter a return date"}
                  </p>
                </button>
              </div>
            </div>

            <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
              <button
                ref={passRef}
                onClick={() => setPassOpen(!passOpen)}
                className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Total Passengers
                  </p>
                  <p className="text-sm font-medium text-gray-800 font-poppins">
                    {passengerLabel}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${passOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            <button
              onClick={handleSubmit}
              className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-12 py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm"
            >
              Search Ride
            </button>
          </div>

          <div className="hidden lg:flex items-stretch border border-gray-200 rounded-xl overflow-hidden">
            <div
              ref={destRef}
              className="flex items-stretch"
              style={{ flex: "2 1 0%" }}
            >
              <button
                onClick={() => setDestOpen(!destOpen)}
                className="flex-1 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
              >
                <p className="text-xs text-gray-400 font-poppins">From</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.destination.from || "Enter pickup location"}
                </p>
              </button>
              <div className="flex items-center justify-center px-3 bg-white shrink-0">
                <ArrowRight size={16} className="text-[#FEA800]" />
              </div>
              <button
                onClick={() => setDestOpen(!destOpen)}
                className="flex-1 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
              >
                <p className="text-xs text-gray-400 font-poppins">To</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.destination.to || "Enter drop location"}
                </p>
              </button>
            </div>

            <div className="w-px bg-gray-200 shrink-0" />

            <button
              ref={dateRef}
              onClick={() => setDateOpen(!dateOpen)}
              className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
              style={{ flex: "1 1 0%" }}
            >
              <p className="text-xs text-gray-400 font-poppins">Pickup</p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {state.dateRange.pickup || "Enter a pickup date"}
              </p>
            </button>

            <div className="w-px bg-gray-200 shrink-0" />

            <button
              onClick={() => setDateOpen(true)}
              className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
              style={{ flex: "1 1 0%" }}
            >
              <p className="text-xs text-gray-400 font-poppins">Return</p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {state.dateRange.return || "Enter a return date"}
              </p>
            </button>

            <div className="w-px bg-gray-200 shrink-0" />

            <button
              ref={passRef}
              onClick={() => setPassOpen(!passOpen)}
              className="flex items-center justify-between gap-2 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left shrink-0"
              style={{ minWidth: "160px" }}
            >
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-poppins">
                  Total Passengers
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {passengerLabel}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 shrink-0 transition-transform ${passOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="hidden lg:flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-12 py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm"
            >
              Search Ride
            </button>
          </div>

          <p className="text-sm text-gray-500 font-poppins leading-relaxed mt-2">
            {CUSTOM_TRIP_NOTE}
          </p>
        </div>

        <PortalDropdown
          anchorRef={destRef as React.RefObject<HTMLElement>}
          open={destOpen}
          onClose={() => setDestOpen(false)}
          align="left"
          minWidth={460}
        >
          <DestinationPopup
            open={destOpen}
            onClose={() => setDestOpen(false)}
            onSelect={(dest) => onChange({ ...state, destination: dest })}
            inline
          />
        </PortalDropdown>
        <PortalDropdown
          anchorRef={dateRef as React.RefObject<HTMLElement>}
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          align="left"
          minWidth={600}
        >
          <DatePickerPopup
            open={dateOpen}
            onClose={() => setDateOpen(false)}
            dateRange={state.dateRange}
            onConfirm={(range) => onChange({ ...state, dateRange: range })}
            inline
          />
        </PortalDropdown>
        <PortalDropdown
          anchorRef={passRef as React.RefObject<HTMLElement>}
          open={passOpen}
          onClose={() => setPassOpen(false)}
          align="right"
          minWidth={320}
        >
          <PassengersPopup
            open={passOpen}
            onClose={() => setPassOpen(false)}
            passengers={state.passengers}
            onConfirm={(p) => onChange({ ...state, passengers: p })}
            inline
          />
        </PortalDropdown>
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-x-0 gap-y-2 sm:gap-y-0">
          <CustomRadioGroup<TripType>
            options={TRIP_TYPES}
            value={state.tripType}
            onChange={(v) => onChange({ ...state, tripType: v })}
          />
          <div className="hidden sm:block w-px h-5 bg-gray-200 mx-5" />
          <CustomRadioGroup<DriverType>
            options={DRIVER_TYPES}
            value={state.driverType}
            onChange={(v) => onChange({ ...state, driverType: v })}
          />
        </div>

        <div className="flex flex-col gap-3 lg:hidden">
          <div
            ref={destRef}
            className="border border-gray-200 rounded-2xl overflow-hidden bg-white"
          >
            <button
              onClick={() => setDestOpen(!destOpen)}
              className="w-full px-4 pt-4 pb-3 hover:bg-gray-50 transition-colors text-left"
            >
              <p className="text-xs text-gray-400 font-poppins mb-0.5">From</p>
              <p className="text-sm font-medium text-gray-800 font-poppins">
                {state.destination.from || "Enter pickup location"}
              </p>
            </button>

            <div className="relative flex items-center px-4">
              <div className="flex-1 h-px bg-gray-200" />
              <div className="mx-3 w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm shrink-0">
                <ArrowUpDown size={13} className="text-[#FEA800]" />
              </div>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <button
              onClick={() => setDestOpen(!destOpen)}
              className="w-full px-4 pt-3 pb-4 hover:bg-gray-50 transition-colors text-left"
            >
              <p className="text-xs text-gray-400 font-poppins mb-0.5">To</p>
              <p className="text-sm font-medium text-gray-800 font-poppins">
                {state.destination.to || "Enter drop location"}
              </p>
            </button>
          </div>

          <div
            className={`grid border border-gray-200 rounded-2xl gap-3 grid-cols-2`}
          >
            <div className="rounded-2xl bg-white overflow-hidden">
              <button
                ref={dateRef}
                onClick={() => setDateOpen(!dateOpen)}
                className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  Pickup
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {state.dateRange.pickup || "Enter a pickup date"}
                </p>
              </button>
            </div>

            <div className="rounded-2xl bg-white overflow-hidden">
              <button
                onClick={() => setDateOpen(true)}
                className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  Return
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {state.dateRange.return || "Enter a return date"}
                </p>
              </button>
            </div>
          </div>

          <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden">
            <button
              ref={passRef}
              onClick={() => setPassOpen(!passOpen)}
              className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
            >
              <div>
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  Total Passengers
                </p>
                <p className="text-sm font-medium text-gray-800 font-poppins">
                  {passengerLabel}
                </p>
              </div>
              <ChevronDown
                size={16}
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${passOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#FEA800] text-black font-semibold text-sm font-poppins py-4 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm mt-1"
          >
            Search Ride
          </button>
        </div>

        <div className="hidden lg:flex items-stretch border border-gray-200 rounded-xl overflow-hidden">
          <div
            ref={destRef}
            className="flex items-stretch"
            style={{ flex: "2 1 0%" }}
          >
            <button
              onClick={() => setDestOpen(!destOpen)}
              className="flex-1 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
            >
              <p className="text-xs text-gray-400 font-poppins">From</p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {state.destination.from || "Enter pickup location"}
              </p>
            </button>

            <div className="flex items-center justify-center px-3 bg-white shrink-0">
              <ArrowRight size={16} className="text-[#FEA800]" />
            </div>

            <button
              onClick={() => setDestOpen(!destOpen)}
              className="flex-1 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
            >
              <p className="text-xs text-gray-400 font-poppins">To</p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {state.destination.to || "Enter drop location"}
              </p>
            </button>
          </div>

          <div className="w-px bg-gray-200 shrink-0" />

          <button
            ref={dateRef}
            onClick={() => setDateOpen(!dateOpen)}
            className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
            style={{ flex: "1 1 0%" }}
          >
            <p className="text-xs text-gray-400 font-poppins">Pickup</p>
            <p className="text-sm font-medium text-gray-800 font-poppins truncate">
              {state.dateRange.pickup || "Enter a pickup date"}
            </p>
          </button>

          {state.tripType === "round-trip" && (
            <>
              <div className="w-px bg-gray-200 shrink-0" />
              <button
                onClick={() => setDateOpen(true)}
                className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
                style={{ flex: "1 1 0%" }}
              >
                <p className="text-xs text-gray-400 font-poppins">Return</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.dateRange.return || "Enter return date"}
                </p>
              </button>
            </>
          )}

          <div className="w-px bg-gray-200 shrink-0" />

          <button
            ref={passRef}
            onClick={() => setPassOpen(!passOpen)}
            className="flex items-center justify-between gap-2 px-5 py-3.5 hover:bg-gray-50 transition-colors text-left shrink-0"
            style={{ minWidth: "160px" }}
          >
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-poppins">
                Total Passengers
              </p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {passengerLabel}
              </p>
            </div>
            <ChevronDown
              size={16}
              className={`text-gray-400 shrink-0 transition-transform ${passOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>

        <div className="hidden lg:flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-12 py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm"
          >
            Search Ride
          </button>
        </div>
      </div>

      <PortalDropdown
        anchorRef={destRef as React.RefObject<HTMLElement>}
        open={destOpen}
        onClose={() => setDestOpen(false)}
        align="left"
        minWidth={460}
      >
        <DestinationPopup
          open={destOpen}
          onClose={() => setDestOpen(false)}
          onSelect={(dest) => onChange({ ...state, destination: dest })}
          inline
        />
      </PortalDropdown>

      <PortalDropdown
        anchorRef={dateRef as React.RefObject<HTMLElement>}
        open={dateOpen}
        onClose={() => setDateOpen(false)}
        align="left"
        minWidth={600}
      >
        <DatePickerPopup
          open={dateOpen}
          onClose={() => setDateOpen(false)}
          dateRange={state.dateRange}
          onConfirm={(range) => onChange({ ...state, dateRange: range })}
          inline
        />
      </PortalDropdown>

      <PortalDropdown
        anchorRef={passRef as React.RefObject<HTMLElement>}
        open={passOpen}
        onClose={() => setPassOpen(false)}
        align="right"
        minWidth={320}
      >
        <PassengersPopup
          open={passOpen}
          onClose={() => setPassOpen(false)}
          passengers={state.passengers}
          onConfirm={(p) => onChange({ ...state, passengers: p })}
          inline
        />
      </PortalDropdown>
    </>
  );
}
