"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowRight, ChevronDown } from "lucide-react";
import {
  TRIP_TYPES,
  DRIVER_TYPES,
  CUSTOM_TRIP_NOTE,
  DESTINATIONS,
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

interface BookingFormProps {
  tripTab: TripTab;
  state: BookingFormState;
  onChange: (s: BookingFormState) => void;
}

interface CustomRadioProps<T extends string> {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

function CustomRadioGroup<T extends string>({
  options,
  value,
  onChange,
}: CustomRadioProps<T>) {
  return (
    <div className="flex items-center gap-5">
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
  // ← KEY FIX: ref on the portal container itself
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
      // Close only if click is OUTSIDE both the anchor AND the portal container
      const outsideAnchor =
        anchorRef.current && !anchorRef.current.contains(target);
      const outsidePortal =
        portalRef.current && !portalRef.current.contains(target);
      if (outsideAnchor && outsidePortal) {
        onClose();
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open, onClose, anchorRef]);

  if (!open || typeof window === "undefined") return null;

  const style: React.CSSProperties =
    align === "right"
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

export default function BookingForm({
  tripTab,
  state,
  onChange,
}: BookingFormProps) {
  const [destOpen, setDestOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);

  // Each trigger gets its own ref
  const destRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLButtonElement>(null);
  const passRef = useRef<HTMLButtonElement>(null);

  const totalPassengers = state.passengers.adults + state.passengers.children;
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  // if (tripTab === "custom") {
  //   return (
  //     <div className="py-6 px-2">
  //       <p className="text-sm text-gray-500 font-poppins leading-relaxed">
  //         {CUSTOM_TRIP_NOTE}
  //       </p>
  //     </div>
  //   );
  // }

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Radio row */}
        <div className="flex flex-wrap items-center gap-y-3">
          <CustomRadioGroup<TripType>
            options={TRIP_TYPES}
            value={state.tripType}
            onChange={(v) => onChange({ ...state, tripType: v })}
          />
          <div className="w-px h-5 bg-gray-200 mx-5" />
          <CustomRadioGroup<DriverType>
            options={DRIVER_TYPES}
            value={state.driverType}
            onChange={(v) => onChange({ ...state, driverType: v })}
          />
        </div>

        <div className="flex items-stretch border border-gray-200 rounded-xl overflow-hidden">
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
          {/* Divider */}
          <div className="flex items-center text-gray-400">|</div>
          <button
            ref={dateRef}
            onClick={() => setDateOpen(!dateOpen)}
            className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
            style={{ flex: "1 1 0%" }}
          >
            <p className="text-xs text-gray-400 font-poppins">Pickup</p>
            <p className="text-sm font-medium text-gray-800 font-poppins truncate">
              {state.dateRange.pickup || "2083/02/07-08:00 AM"}
            </p>
          </button>
          {/* Return date — only for round trip */}
          {state.tripType === "round-trip" && (
            <>
              <button
                onClick={() => setDateOpen(true)}
                className="px-5 py-3.5 hover:bg-gray-50 transition-colors text-left min-w-0"
                style={{ flex: "1 1 0%" }}
              >
                <p className="text-xs text-gray-400 font-poppins">Return</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.dateRange.return || "2083/02/07-08:00 AM"}
                </p>
              </button>
            </>
          )}
          {/* Divider */}
          <div className="flex items-center text-gray-400">|</div>
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

        {/* Search button */}
        <div className="flex justify-end">
          <button className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-12 py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm">
            Search Ride
          </button>
        </div>
      </div>

      {/* Destination dropdown */}
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

      {/* Date picker dropdown — anchored to the Pickup button */}
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

      {/* Passengers dropdown */}
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
