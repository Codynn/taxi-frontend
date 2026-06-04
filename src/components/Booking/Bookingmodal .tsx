"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, ChevronDown } from "lucide-react";
import {
  TRIP_TABS,
  DEFAULT_BOOKING_STATE,
  TRIP_TYPES,
  DRIVER_TYPES,
  CUSTOM_TRIP_NOTE,
} from "@/constants/booking.constants";
import type {
  TripTab,
  BookingFormState,
  TripType,
  DriverType,
} from "@/types/booking.types";
import DatePickerPopup from "./Datepickerpopup";
import PassengersPopup from "./Passengerspopup";
import DestinationPopup from "./Destinationpopup";
import { useRouter } from "next/navigation";

interface BookingModalProps {
  open: boolean;
  onClose: () => void;
  onSearch?: (state: BookingFormState) => void;
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
                  ? "text-[#FEA800]"
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

export default function BookingModal({
  open,
  onClose,
  onSearch,
}: BookingModalProps) {
  const [activeTab, setActiveTab] = useState<TripTab>("long");
  const [formState, setFormState] = useState<BookingFormState>(
    DEFAULT_BOOKING_STATE,
  );

  const router = useRouter();

  // Only one popup open at a time
  const [activePopup, setActivePopup] = useState<
    "dest" | "date" | "pass" | null
  >(null);

  const totalPassengers =
    formState.passengers.adults + formState.passengers.children;
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Close all popups when modal closes
  useEffect(() => {
    if (!open) setActivePopup(null);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal */}
      <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl flex flex-col max-h-[90vh] sm:max-h-none sm:h-auto overflow-hidden">
        {/* ── Tabs ── */}
        <div className="flex bg-[#F5F5F5] rounded-t-3xl overflow-hidden shrink-0">
          {TRIP_TABS.map((tab, i) => {
            const isActive = activeTab === tab.value;
            const isFirst = i === 0;
            const isLast = i === TRIP_TABS.length - 1;
            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setFormState((s) => ({ ...s, tripTab: tab.value }));
                }}
                className={[
                  "flex-1 py-4 text-sm font-semibold font-poppins transition-all duration-200 relative",
                  isActive
                    ? "bg-white text-gray-900"
                    : "bg-[#F5F5F5] text-gray-400 hover:text-gray-600",
                  isActive && isFirst ? "rounded-tl-3xl" : "",
                  isActive && isLast ? "rounded-tr-3xl" : "",
                  !isActive && isFirst ? "rounded-tl-3xl" : "",
                  !isActive && isLast ? "rounded-tr-3xl" : "",
                ].join(" ")}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* ── Body — scrollable on mobile only ── */}
        <div className="overflow-y-auto sm:overflow-visible flex-1 sm:flex-none">
          <div className="px-5 py-5 flex flex-col gap-4">
            {activeTab === "custom" ? (
              <p className="text-sm text-gray-500 font-poppins leading-relaxed py-2">
                {CUSTOM_TRIP_NOTE}
              </p>
            ) : (
              <>
                {/* Radio row — single row on desktop, wraps on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:gap-6 gap-3">
                  <CustomRadioGroup<TripType>
                    options={TRIP_TYPES}
                    value={formState.tripType}
                    onChange={(v) =>
                      setFormState((s) => ({ ...s, tripType: v }))
                    }
                  />
                  {/* Divider — vertical on desktop, horizontal on mobile */}
                  <div className="sm:w-px sm:h-5 sm:bg-gray-300 w-full h-px bg-gray-100" />
                  <CustomRadioGroup<DriverType>
                    options={DRIVER_TYPES}
                    value={formState.driverType}
                    onChange={(v) =>
                      setFormState((s) => ({ ...s, driverType: v }))
                    }
                  />
                </div>

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
                      {formState.destination.from || "Enter pickup location"}
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
                    <p className="text-xs text-gray-400 font-poppins mb-0.5">
                      To
                    </p>
                    <p className="text-sm font-medium text-gray-800 font-poppins">
                      {formState.destination.to || "Enter drop location"}
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
                      {formState.dateRange.pickup || "2083/02/07-08:00 AM"}
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
                      {formState.dateRange.return || "2083/02/07-08:00 AM"}
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
                        {passengerLabel}
                      </p>
                    </div>
                    <ChevronDown
                      size={16}
                      className={`text-gray-400 shrink-0 transition-transform duration-200 ${activePopup === "pass" ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="px-5 pb-6 pt-3 grid grid-cols-2 gap-3 shrink-0 bg-white">
          <button
            onClick={onClose}
            className="py-4 rounded-full border border-gray-200 bg-gray-100 text-gray-700 text-sm font-semibold font-poppins hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onSearch?.(formState);
              onClose();
              router.push("/choose-ride");
            }}
            className="py-4 rounded-full bg-[#FEA800] text-black text-sm font-semibold font-poppins hover:bg-[#FEA800]/90 transition-colors shadow-sm"
          >
            Search Ride
          </button>
        </div>
      </div>

      {activePopup === "dest" && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
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
                setFormState((s) => ({ ...s, destination: dest }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}

      {activePopup === "date" && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
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
              dateRange={formState.dateRange}
              onConfirm={(range) => {
                setFormState((s) => ({ ...s, dateRange: range }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}

      {activePopup === "pass" && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 pb-4 sm:pb-0 bg-black/30"
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
              passengers={formState.passengers}
              onConfirm={(p) => {
                setFormState((s) => ({ ...s, passengers: p }));
                setActivePopup(null);
              }}
              inline
            />
          </div>
        </div>
      )}
    </div>
  );
}
