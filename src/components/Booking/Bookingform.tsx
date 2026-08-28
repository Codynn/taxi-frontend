"use client";

import { useState, useEffect, useRef } from "react";
import {
  formatBsDate,
  adStringToUtcIso,
  adStringAndTimeToUtcIso,
} from "@/lib/bs-date";
import { formatTimeLabel } from "@/lib/time";
import { createPortal } from "react-dom";
import { ArrowRight, ArrowUpDown, ChevronDown } from "lucide-react";
import {
  TRIP_TYPES,
  DRIVER_TYPES,
  CUSTOM_TRIP_NOTE,
  TRIP_TABS,
  deriveApiTripType,
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
import CustomDestinationPopup from "./CustomDestinationPopup";
import { useDefaultPickupLocation } from "@/hooks/useDefaultPickupLocation";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";

interface BookingFormProps {
  tripTab: TripTab;
  state: BookingFormState;
  onChange: (s: BookingFormState) => void;
  onChangeTab: (tab: TripTab) => void;
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
                "text-md md:text-sm  font-medium font-poppins transition-colors",
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

function FieldErrorMsg({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="text-red-500 text-xs font-poppins mt-1.5 ml-1">{message}</p>
  );
}

// dateRange values are local "YYYY/MM/DD" calendar-date strings; convert
// them to UTC-midnight ISO so the intended calendar day is preserved
// regardless of the browser's timezone (see adStringToUtcIso for why).
const toISO = adStringToUtcIso;

export default function BookingForm({
  tripTab,
  state,
  onChange,
  onChangeTab,
}: BookingFormProps) {
  const [destOpen, setDestOpen] = useState(false);
  const [destField, setDestField] = useState<"from" | "to">("from");
  const [dateOpen, setDateOpen] = useState(false);
  const [passOpen, setPassOpen] = useState(false);
  const mobilePickupTimeRef = useRef<HTMLInputElement>(null);
  const desktopPickupTimeRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<{
    destination?: string;
    date?: string;
    returnDate?: string;
    pickupTime?: string;
    driverType?: string;
    passengers?: string;
  }>({});

  const router = useRouter();

  const { setModalData, setBookingState } = useBookingStore();

  // Centralized body scroll-lock for the mobile bottom sheets.
  //
  // Each <Sheet> (destination / date / passengers) can independently lock
  // and unlock the body. With three separate Sheet instances now mounting
  // in the same form, switching focus/state between them can momentarily
  // unlock the body between one Sheet's cleanup and the next one's effect
  // running — and the instant the body is unlocked, iOS Safari falls back
  // to its default "scroll the whole layout viewport to reveal the
  // focused input" behavior, which is the bug we're trying to avoid.
  //
  // Locking once here, keyed off "is ANY sheet open", removes that gap:
  // the lock only releases once all three are closed.
  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    const anySheetOpen = destOpen || dateOpen || passOpen;
    if (!anySheetOpen) return;

    const scrollY = window.scrollY;
    const { style } = document.body;
    const prev = {
      position: style.position,
      top: style.top,
      left: style.left,
      right: style.right,
      width: style.width,
    };

    style.position = "fixed";
    style.top = `-${scrollY}px`;
    style.left = "0";
    style.right = "0";
    style.width = "100%";

    return () => {
      style.position = prev.position;
      style.top = prev.top;
      style.left = prev.left;
      style.right = prev.right;
      style.width = prev.width;
      window.scrollTo(0, scrollY);
    };
  }, [destOpen, dateOpen, passOpen]);

  const totalPassengers = state.passengers.adults + state.passengers.children;
  const passengerLabel = `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`;

  const isCustom = tripTab === "custom";
  const showTripTypeRadio = !isCustom; // short & long tabs
  const showDriverRadio = isCustom; // custom tab only

  // Only Custom Trip uses a return date / date range (two calendars).
  // Within City & City-to-City use a single calendar with one date.
  const showReturnDate = isCustom;

  // Pre-fill From with the pickup location that has the most routes
  // available (so customers usually only need to fill in where they're
  // going). Only applies to a still-empty field — never overwrites a value
  // the user (or a previous selection) already set.
  const { data: defaultFrom } = useDefaultPickupLocation();
  useEffect(() => {
    if (isCustom) return;
    if (!defaultFrom) return;
    if (state.destination.from) return;
    onChange({
      ...state,
      destination: { ...state.destination, from: defaultFrom },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultFrom, isCustom, state.destination.from]);

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    if (!state.destination.from || !state.destination.to) {
      newErrors.destination = "Please select pickup and drop location";
    }

    if (!state.dateRange.pickup) {
      newErrors.date = "Please select pickup date";
    }

    if (!state.pickupTime) {
      newErrors.pickupTime = "Please select a pickup time";
    }

    // Return date is only used (and shown) for custom round-trips
    if (showReturnDate && !state.dateRange.return) {
      newErrors.returnDate = "Please select a return date";
    }

    // Custom tab: driverType must be selected (not empty)
    if (isCustom && !state.driverType) {
      newErrors.driverType = "Please select a driver option";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const bookingType: BookingType =
      state.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY";

    const apiTripType: ApiTripType = deriveApiTripType(
      tripTab,
      state.destination.outsideDistrict,
    );

    // For within-city and city-to-city, driver is always not required
    const driverRequired = isCustom
      ? state.driverType === "with-driver"
      : false;

    setModalData({
      pickUpLocation: state.destination.from,
      dropOffLocation: state.destination.to,
      pickUpDate: toISO(state.dateRange.pickup),
      pickUpTime: adStringAndTimeToUtcIso(
        state.dateRange.pickup,
        state.pickupTime,
      ),
      returnDate:
        showReturnDate && state.dateRange.return
          ? toISO(state.dateRange.return)
          : "",
      bookingType,
      tripType: apiTripType,
      driverRequired,
      locationId: state.destination.locationId,
      oneWayFare: state.destination.oneWayFare,
      roundTripFare: state.destination.roundTripFare,
    });

    setBookingState(state);
    router.push("/choose-ride");
  };

  const handleRevert = () => {
    onChange({
      ...state,
      destination: {
        ...state.destination,
        from: state.destination.to,
        to: state.destination.from,
        locationId: undefined,
        oneWayFare: undefined,
        roundTripFare: undefined,
        outsideDistrict: undefined,
      },
    });
    setErrors((e) => ({ ...e, destination: undefined }));
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        {/* Radio group row — only show what's relevant per tab */}
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-center gap-x-0 gap-y-2 sm:gap-y-0">
            {showTripTypeRadio && (
              <CustomRadioGroup
                options={TRIP_TYPES}
                value={state.tripType}
                onChange={(v) => {
                  onChange({ ...state, tripType: v });
                  setErrors((e) => ({ ...e, returnDate: undefined }));
                }}
              />
            )}

            {showDriverRadio && (
              <CustomRadioGroup
                options={DRIVER_TYPES}
                value={state.driverType}
                onChange={(v) => {
                  onChange({ ...state, driverType: v });
                  setErrors((e) => ({ ...e, driverType: undefined }));
                }}
              />
            )}
          </div>
          {isCustom && <FieldErrorMsg message={errors.driverType} />}
        </div>

        {/* ── Mobile ── */}
        <div className="flex flex-col gap-3 lg:hidden">
          <div>
            <div
              className={`border rounded-2xl overflow-hidden bg-white ${errors.destination ? "border-red-400" : "border-gray-200"}`}
            >
              <button
                onClick={() => {
                  setDestField("from");
                  setDestOpen(!destOpen);
                }}
                className="w-full px-4 pt-4 pb-3 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">
                  From
                </p>
                <p className="text-xl md:text-sm font-medium text-gray-800 font-poppins">
                  {state.destination.from || "Enter pickup location"}
                </p>
              </button>
              <div className="relative flex items-center px-4">
                <div className="flex-1 h-px bg-gray-200" />
                <div
                  onClick={handleRevert}
                  className="mx-1 w-9 h-9 bg-[#FEF1D8] rounded-full border border-gray-200 flex items-center justify-center shadow-sm shrink-0"
                >
                  <ArrowUpDown size={18} className="text-[#FEA800]" />
                </div>
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <button
                onClick={() => {
                  setDestField("to");
                  setDestOpen(!destOpen);
                }}
                className="w-full px-4 pt-3 pb-4 hover:bg-gray-50 transition-colors text-left"
              >
                <p className="text-xs text-gray-400 font-poppins mb-0.5">To</p>
                <p className="text-xl md:text-sm font-medium text-gray-800 font-poppins">
                  {state.destination.to || "Enter drop location"}
                </p>
              </button>
            </div>
            <FieldErrorMsg message={errors.destination} />
          </div>

          <div>
            {showReturnDate ? (
              // Show both pickup + return date grid
              <div
                className={`grid border rounded-2xl gap-0 grid-cols-2 ${errors.date || errors.returnDate ? "border-red-400" : "border-gray-200"}`}
              >
                <div className="rounded-l-2xl bg-white border-r border-gray-200">
                  <button
                    onClick={() => setDateOpen(!dateOpen)}
                    className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <p className="text-xs text-gray-400 font-poppins mb-0.5">
                      Pickup
                    </p>
                    <p className="text-xl md:text-sm font-medium text-gray-800 font-poppins">
                      {formatBsDate(state.dateRange.pickup) ||
                        "Enter a pickup date"}
                    </p>
                  </button>
                </div>
                <div
                  className={`rounded-r-2xl bg-white overflow-hidden ${errors.returnDate ? "border-l border-red-400" : ""}`}
                >
                  <button
                    onClick={() => setDateOpen(true)}
                    className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                  >
                    <p className="text-xs text-gray-400 font-poppins mb-0.5">
                      Return
                    </p>
                    <p
                      className={`text-xl md:text-sm  font-medium font-poppins ${errors.returnDate && !state.dateRange.return ? "text-red-400" : "text-gray-800"}`}
                    >
                      {formatBsDate(state.dateRange.return) ||
                        "Enter a return date"}
                    </p>
                  </button>
                </div>
              </div>
            ) : (
              // Only pickup date (within city & city-to-city one-way)
              <div
                className={`border rounded-2xl bg-white overflow-hidden ${errors.date ? "border-red-400" : "border-gray-200"}`}
              >
                <button
                  onClick={() => setDateOpen(!dateOpen)}
                  className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Pickup
                  </p>
                  <p className="text-xl md:text-sm font-medium text-gray-800 font-poppins">
                    {formatBsDate(state.dateRange.pickup) ||
                      "Enter a pickup date"}
                  </p>
                </button>
              </div>
            )}
            <FieldErrorMsg message={errors.date} />
            <FieldErrorMsg message={errors.returnDate} />
          </div>

          <div>
            <div
              onClick={() => mobilePickupTimeRef.current?.showPicker?.()}
              className={`relative border rounded-2xl bg-white overflow-hidden px-4 py-4 focus-within:ring-2 focus-within:ring-[#FEA800]/40 cursor-pointer ${errors.pickupTime ? "border-red-400" : "border-gray-200"}`}
            >
              <p className="text-xs text-gray-400 font-poppins mb-0.5">
                Pickup Time
              </p>
              <p
                className={`text-xl md:text-sm font-medium font-poppins ${state.pickupTime ? "text-gray-800" : "text-gray-400"}`}
              >
                {state.pickupTime
                  ? formatTimeLabel(state.pickupTime)
                  : "Select pickup time"}
              </p>
              {/* Transparent native input laid over the whole box so the
                  entire field opens the time picker, not just the browser's
                  small clock icon. On desktop browsers, clicking anywhere
                  other than that tiny icon merely focuses the input without
                  opening any UI, so the wrapping div's onClick above calls
                  showPicker() explicitly to make the whole box work. */}
              <input
                ref={mobilePickupTimeRef}
                type="time"
                value={state.pickupTime}
                onChange={(e) => {
                  onChange({ ...state, pickupTime: e.target.value });
                  setErrors((err) => ({ ...err, pickupTime: undefined }));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <FieldErrorMsg message={errors.pickupTime} />
          </div>

          <div>
            <div
              className={`border rounded-2xl bg-white overflow-hidden ${errors.passengers ? "border-red-400" : "border-gray-200"}`}
            >
              <button
                onClick={() => setPassOpen(!passOpen)}
                className="w-full px-4 py-4 hover:bg-gray-50 transition-colors text-left flex items-center justify-between"
              >
                <div>
                  <p className="text-xs text-gray-400 font-poppins mb-0.5">
                    Total Passengers
                  </p>
                  <p className="text-xl md:text-sm font-medium text-gray-800 font-poppins">
                    {passengerLabel}
                  </p>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 shrink-0 transition-transform duration-200 ${passOpen ? "rotate-180" : ""}`}
                />
              </button>
            </div>
            <FieldErrorMsg message={errors.passengers} />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#FEA800] text-black font-semibold text-sm font-poppins py-4 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm mt-1"
          >
            Search Ride
          </button>
        </div>

        {/* ── Desktop ── */}
        <div className="hidden lg:flex flex-col gap-2">
          <div
            className={`flex items-stretch border rounded-xl overflow-hidden ${errors.destination || errors.date || errors.returnDate ? "border-red-400" : "border-gray-200"}`}
          >
            <div className="flex items-stretch" style={{ flex: "2 1 0%" }}>
              <button
                onClick={() => {
                  setDestField("from");
                  setDestOpen(!destOpen);
                }}
                className="flex-1 px-5 py-3 hover:bg-gray-50 transition-colors text-left min-w-0"
              >
                <p className="text-xs text-gray-400 font-poppins">From</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.destination.from || "Enter pickup location"}
                </p>
                {errors.destination && !state.destination.from && (
                  <p className="text-[11px] text-red-500 font-poppins mt-0.5">
                    Please select a pickup location
                  </p>
                )}
              </button>
              <div className="flex items-center justify-center px-3 bg-white shrink-0">
                <ArrowRight size={16} className="text-[#FEA800]" />
              </div>
              <button
                onClick={() => {
                  setDestField("to");
                  setDestOpen(!destOpen);
                }}
                className="flex-1 px-5 py-3 hover:bg-gray-50 transition-colors text-left min-w-0"
              >
                <p className="text-xs text-gray-400 font-poppins">To</p>
                <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                  {state.destination.to || "Enter drop location"}
                </p>
                {errors.destination && !state.destination.to && (
                  <p className="text-[11px] text-red-500 font-poppins mt-0.5">
                    Please select a drop location
                  </p>
                )}
              </button>
            </div>

            <div className="w-px bg-gray-200 shrink-0" />

            <button
              onClick={() => setDateOpen(!dateOpen)}
              className="px-5 py-3 hover:bg-gray-50 transition-colors text-left min-w-0"
              style={{ flex: "1 1 0%" }}
            >
              <p className="text-xs text-gray-400 font-poppins">Pickup</p>
              <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                {formatBsDate(state.dateRange.pickup) || "Enter a pickup date"}
              </p>
              {errors.date && (
                <p className="text-[11px] text-red-500 font-poppins mt-0.5">
                  Please select a pickup date
                </p>
              )}
            </button>

            {/* Return date only for round-trip (short/long) or custom tab */}
            {showReturnDate && (
              <>
                <div className="w-px bg-gray-200 shrink-0" />
                <button
                  onClick={() => setDateOpen(true)}
                  className="px-5 py-3 hover:bg-gray-50 transition-colors text-left min-w-0"
                  style={{ flex: "1 1 0%" }}
                >
                  <p className="text-xs text-gray-400 font-poppins">Return</p>
                  <p className="text-sm font-medium text-gray-800 font-poppins truncate">
                    {formatBsDate(state.dateRange.return) ||
                      "Enter return date"}
                  </p>
                  {errors.returnDate && !state.dateRange.return && (
                    <p className="text-[11px] text-red-500 font-poppins mt-0.5">
                      Please select a return date
                    </p>
                  )}
                </button>
              </>
            )}

            <div className="w-px bg-gray-200 shrink-0" />

            <div
              onClick={() => desktopPickupTimeRef.current?.showPicker?.()}
              className="relative px-5 py-3 min-w-0 hover:bg-gray-50 transition-colors focus-within:bg-gray-50 cursor-pointer"
              style={{ flex: "1 1 0%" }}
            >
              <p className="text-xs text-gray-400 font-poppins">Pickup Time</p>
              <p
                className={`text-sm font-medium font-poppins truncate ${state.pickupTime ? "text-gray-800" : "text-gray-400"}`}
              >
                {state.pickupTime
                  ? formatTimeLabel(state.pickupTime)
                  : "Select pickup time"}
              </p>
              {errors.pickupTime && (
                <p className="text-[11px] text-red-500 font-poppins mt-0.5">
                  Please select a pickup time
                </p>
              )}
              {/* Transparent native input laid over the whole box so the
                  entire field opens the time picker, not just the browser's
                  small clock icon. On desktop, clicking elsewhere in the box
                  only focuses the input without opening any UI, so the
                  wrapping div's onClick above calls showPicker() explicitly
                  so the whole box is actually usable. */}
              <input
                ref={desktopPickupTimeRef}
                type="time"
                value={state.pickupTime}
                onChange={(e) => {
                  onChange({ ...state, pickupTime: e.target.value });
                  setErrors((err) => ({ ...err, pickupTime: undefined }));
                }}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>

            <div className="w-px bg-gray-200 shrink-0" />

            <button
              onClick={() => setPassOpen(!passOpen)}
              className="flex items-center justify-between gap-2 px-5 py-3 hover:bg-gray-50 transition-colors text-left shrink-0"
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

          <div className="flex justify-end">
            <button
              onClick={handleSubmit}
              className="bg-[#FEA800] text-black font-semibold text-sm font-poppins px-12 py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors shadow-sm"
            >
              Search Ride
            </button>
          </div>
        </div>

        {/* Custom trip note */}
        {isCustom && (
          <p className="text-sm text-gray-500 font-poppins leading-relaxed mt-2">
            {CUSTOM_TRIP_NOTE}
          </p>
        )}
      </div>

      {destOpen &&
        (() => {
          const destContent = isCustom ? (
            <CustomDestinationPopup
              open={destOpen}
              onClose={() => setDestOpen(false)}
              onSelect={(dest) => {
                onChange({ ...state, destination: { ...dest } });
                setErrors((e) => ({ ...e, destination: undefined }));
              }}
              inline
            />
          ) : (
            <DestinationPopup
              open={destOpen}
              onClose={() => setDestOpen(false)}
              activeField={destField}
              currentFrom={state.destination.from}
              onSelect={(dest) => {
                onChange({ ...state, destination: dest });
                setErrors((e) => ({ ...e, destination: undefined }));
              }}
              onSelectFrom={(from) => {
                // Changing From invalidates any previously picked route.
                onChange({
                  ...state,
                  destination: {
                    from,
                    to: "",
                    locationId: undefined,
                    oneWayFare: undefined,
                    roundTripFare: undefined,
                    outsideDistrict: undefined,
                  },
                });
                setErrors((e) => ({ ...e, destination: undefined }));
              }}
              inline
            />
          );

          // Mobile: shadcn/base-ui Sheet as a bottom sheet — handles iOS
          // scroll-lock/keyboard quirks correctly out of the box. Desktop is
          // untouched (same centered dialog as before).
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            // iOS's keyboard pushes the whole page up (rather than resizing
            // the viewport in place like Android), so a tall sheet ends up
            // partly hidden above the keyboard — cap it shorter on iOS.
            // iPadOS masquerades as desktop Safari (no "iPad" in the UA)
            // unless the user opted into "Request Mobile Website", so a
            // touch-capable "MacIntel" platform is the reliable way to catch
            // it alongside the direct iPhone/iPod UA match.
            const isIOS =
              /iphone|ipad|ipod/i.test(navigator.userAgent) ||
              (navigator.platform === "MacIntel" &&
                navigator.maxTouchPoints > 1);
            return (
              <Sheet open={destOpen} onOpenChange={setDestOpen}>
                <SheetContent
                  side="bottom"
                  className={`min-h-[70vh] ${isIOS ? "max-h-full" : "max-h-[80vh]"} rounded-t-2xl p-0`}
                >
                  <SheetTitle className="sr-only">
                    {destField === "from"
                      ? "Select pickup location"
                      : "Select drop location"}
                  </SheetTitle>
                  <div className="overflow-y-hidden">{destContent}</div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            typeof window !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setDestOpen(false);
                }}
              >
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                  {destContent}
                </div>
              </div>,
              document.body,
            )
          );
        })()}

      {dateOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDateOpen(false);
            }}
          >
            <div
              className={`relative bg-white rounded-2xl shadow-2xl w-full ${isCustom ? "max-w-3xl" : "max-w-md"} max-h-[90vh] overflow-y-auto`}
            >
              <DatePickerPopup
                open={dateOpen}
                onClose={() => setDateOpen(false)}
                dateRange={state.dateRange}
                single={!isCustom}
                onConfirm={(range) => {
                  onChange({ ...state, dateRange: range });
                  setErrors((e) => ({ ...e, date: undefined }));
                }}
                inline
              />
            </div>
          </div>,
          document.body,
        )}

      {passOpen &&
        (() => {
          const passContent = (
            <PassengersPopup
              open={passOpen}
              onClose={() => setPassOpen(false)}
              passengers={state.passengers}
              onConfirm={(p) => {
                onChange({ ...state, passengers: p });
                setErrors((e) => ({ ...e, passengers: undefined }));
              }}
              inline
            />
          );

          // Mobile: bottom Sheet, same pattern as the destination popup.
          if (typeof window !== "undefined" && window.innerWidth < 1024) {
            return (
              <Sheet open={passOpen} onOpenChange={setPassOpen}>
                <SheetContent
                  side="bottom"
                  className="min-h-[30vh] max-h-[80vh] rounded-t-2xl p-0"
                >
                  <SheetTitle className="sr-only">Select passengers</SheetTitle>
                  <div className="overflow-y-auto">{passContent}</div>
                </SheetContent>
              </Sheet>
            );
          }

          return (
            typeof window !== "undefined" &&
            createPortal(
              <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 px-4"
                onClick={(e) => {
                  if (e.target === e.currentTarget) setPassOpen(false);
                }}
              >
                <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm max-h-[90vh] overflow-y-auto">
                  {passContent}
                </div>
              </div>,
              document.body,
            )
          );
        })()}
    </>
  );
}
