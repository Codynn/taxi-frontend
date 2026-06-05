// app/checkout/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type { BookingFormState } from "@/types/booking.types";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";

// Dummy data — replace with real state/props
const DUMMY_VEHICLE: SelectedVehicle = {
  id: "v1",
  name: "SUV Carrera S 2024",
  plateNumber: "Ba 1 PA 1414",
  imageUrl: "/vehicle/suv1.png",
  rating: 5.0,
  totalTrips: 120,
  startingPrice: 5000,
  currency: "Rs",
  features: [
    { icon: "vehicle/battery.svg", label: "Electric" },
    { icon: "vehicle/seat.svg", label: "5 Seats" },
    { icon: "vehicle/wind.svg", label: "AC" },
  ],
};

const FARE_DETAILS = [
  { label: "Base Fare:", amount: 3500 },
  { label: "Distance Charge:", amount: 3500 },
  { label: "Vehicle Type Adjustment:", amount: 3500 },
  { label: "Service Fee:", amount: 3500 },
];

const TOTAL = FARE_DETAILS.reduce((s, f) => s + f.amount, 0);

type PaymentMethod = "esewa" | "khalti" | null;

export default function CheckoutPage() {
  const router = useRouter();
  const [bookingState, setBookingState] = useState<BookingFormState>(
    DEFAULT_BOOKING_STATE,
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

  const totalPassengers =
    bookingState.passengers.adults + bookingState.passengers.children;

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 pt-25">
        {/* Go Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-[16px] font-poppins text-black transition-colors w-fit cursor-pointer"
        >
          <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
          Go Back
        </button>

        {/* ── DESKTOP: 2-col layout ── */}
        <div className="hidden lg:grid grid-cols-2 gap-6">
          {/* LEFT col */}
          <div className="flex flex-col gap-5">
            {/* Booking Summary */}
            <div className="border border-gray-200 rounded-2xl overflow-hidden">
              <div className="px-5 pt-5 pb-4">
                <h2 className="text-[18px] font-medium font-sora text-black mb-4">
                  Booking Summary
                </h2>

                {/* Trip type row */}
                <div className="flex  bg-[#f5f5f5] rounded-xl overflow-hidden mb-5">
                  <div className="flex-1 px-4 py-3 text-center border-r border-gray-200">
                    <span className="text-[16px] font-poppins text-black">
                      {bookingState.tripType === "round-trip"
                        ? "Round Trip"
                        : "One Way"}
                    </span>
                  </div>
                  <div className="flex-1 px-4 py-3 text-center">
                    <span className="text-[16px] font-poppins text-black">
                      {bookingState.driverType === "with-driver"
                        ? "With Driver"
                        : "Self Drive"}
                    </span>
                  </div>
                </div>

                {/* From */}
                <div className="flex items-start gap-3 mb-1">
                  <Image
                    src="/ride/locationgreen.svg"
                    alt="from"
                    width={32}
                    height={32}
                    className="shrink-0 mt-1"
                  />
                  <div>
                    <p className="text-[12px] text-gray-500 font-poppins">
                      From
                    </p>
                    <p className="text-[16px] font-semibold text-black font-poppins">
                      {bookingState.destination.from || "Enter pickup location"}
                    </p>
                    <p className="text-[13px] text-black/65 font-poppins">
                      {bookingState.dateRange.pickup || "2083/02/07-08:00 AM"}
                    </p>
                  </div>
                </div>

                {/* Dashed connector */}
                <div className="ml-4 w-px h-6 border-l-2 border-dashed border-gray-300 my-1" />

                {/* To */}
                <div className="flex items-start gap-3 mb-4">
                  <Image
                    src="/ride/locationred.svg"
                    alt="to"
                    width={32}
                    height={32}
                    className="shrink-0 mt-1"
                  />
                  <div>
                    <p className="text-[12px]  font-poppins">To</p>
                    <p className="text-[16px]  text-black font-poppins">
                      {bookingState.destination.to || "Enter drop location"}
                    </p>
                    <p className="text-[12px] font-poppins">
                      {bookingState.dateRange.return || "2083/02/07-08:00 AM"}
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-[#808080]/50 shrink-0" />

                {/* Passengers */}
                <div className="flex items-center gap-3  rounded-xl px-4 py-3">
                  <Image
                    src="/ride/passenger.svg"
                    alt="passengers"
                    width={24}
                    height={24}
                    className="shrink-0"
                  />
                  <div>
                    <p className="text-[12px] text-gray-500 font-poppins">
                      Total Passengers
                    </p>
                    <p className="text-[15px] font-semibold text-black font-poppins">
                      {totalPassengers > 0
                        ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
                        : "1 Passenger"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Vehicle Selected */}
            <VehicleSelectedCard
              vehicle={DUMMY_VEHICLE}
              onChangeVehicle={() => router.back()}
            />
          </div>

          {/* RIGHT col */}
          <div className="flex flex-col gap-5">
            {/* Fare Details */}
            <div className=" rounded-2xl p-5 bg-[#f5f5f5]">
              <h2 className="text-[24px] font-bold font-sora text-black mb-4">
                Fare Details
              </h2>
              <div className="flex flex-col gap-3">
                {FARE_DETAILS.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between"
                  >
                    <span className="text-[16px]  font-poppins">
                      {item.label}
                    </span>
                    <span className="text-[16px] text-black font-poppins">
                      Rs {item.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
                <div className="h-px bg-[#808080]/50 my-1" />
                <div className="flex items-center justify-between">
                  <span className="text-[16px]  text-black font-poppins">
                    Total
                  </span>
                  <span className="text-[20px] font-bold text-black font-poppins">
                    Rs {TOTAL.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Choose Payment Method */}
            <div className="bg-[#f5f5f5] rounded-2xl p-5">
              <h2 className="text-[24px] font-bold font-sora text-black mb-4">
                Choose Payment Method
              </h2>
              <div className="grid grid-cols-2 gap-3 mb-5">
                <button
                  onClick={() => setSelectedPayment("esewa")}
                  className={[
                    "flex items-center justify-center p-4 rounded-xl border-2 transition-all",
                    selectedPayment === "esewa"
                      ? "border-[#FEA800]"
                      : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  <Image
                    src="/ride/esewa.svg"
                    alt="eSewa"
                    width={100}
                    height={100}
                    className="h-12 w-auto object-contain"
                  />
                </button>
                <button
                  onClick={() => setSelectedPayment("khalti")}
                  className={[
                    "flex items-center justify-center p-4 rounded-xl border-2 transition-all",
                    selectedPayment === "khalti"
                      ? "border-[#FEA800]"
                      : "border-gray-200 hover:border-gray-300",
                  ].join(" ")}
                >
                  <Image
                    src="/ride/khalti.svg"
                    alt="Khalti"
                    width={100}
                    height={36}
                    className="h-9 w-auto object-contain"
                  />
                </button>
              </div>

              <button
                disabled={!selectedPayment}
                className="w-full py-4 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[15px] hover:bg-[#e09700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue to Payment
              </button>
            </div>
          </div>
        </div>

        {/* ── MOBILE: single column ── */}
        <div className="flex lg:hidden flex-col gap-5">
          {/* Booking Summary */}
          <div className="border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-4 pt-4 pb-4">
              <h2 className="text-[18px] font-medium font-sora text-black mb-4">
                Booking Summary
              </h2>

              {/* Trip type row */}
              <div className="flex bg-[#f5f5f5]  rounded-xl overflow-hidden mb-4">
                <div className="flex-1 px-3 py-2.5 text-center border-r border-gray-200">
                  <span className="text-[16px] font-poppins text-black">
                    {bookingState.tripType === "round-trip"
                      ? "Round Trip"
                      : "One Way"}
                  </span>
                </div>
                <div className="flex-1 px-3 py-2.5 text-center">
                  <span className="text-[13px] font-poppins text-black">
                    {bookingState.driverType === "with-driver"
                      ? "With Driver"
                      : "Self Drive"}
                  </span>
                </div>
              </div>

              {/* From + swap icon + To — all in one row */}
              <div className="flex items-center gap-3 mb-4">
                {/* From */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Image
                    src="/ride/locationgreen.svg"
                    alt="from"
                    width={36}
                    height={36}
                    className="shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px] font-poppins">From</p>
                    <p className="text-[16px]  text-black font-poppins truncate">
                      {bookingState.destination.from || "Kathmandu"}
                    </p>
                  </div>
                </div>

                {/* Swap icon */}
                <div className="shrink-0">
                  <Image
                    src="/ride/locationgreen.svg"
                    alt="swap"
                    width={28}
                    height={28}
                    className="opacity-0 pointer-events-none"
                  />
                  {/* amber double arrow */}
                  <svg
                    width="28"
                    height="20"
                    viewBox="0 0 28 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="-mt-7"
                  >
                    <path
                      d="M4 6H24M24 6L19 1M24 6L19 11"
                      stroke="#FEA800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M24 14H4M4 14L9 9M4 14L9 19"
                      stroke="#FEA800"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                {/* To */}
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Image
                    src="/ride/locationred.svg"
                    alt="to"
                    width={36}
                    height={36}
                    className="shrink-0"
                  />
                  <div className="min-w-0">
                    <p className="text-[12px]  font-poppins">To</p>
                    <p className="text-[16px]  text-black font-poppins truncate">
                      {bookingState.destination.to || "Pokhara"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-full h-px bg-[#808080]/50 shrink-0" />

              {/* Passengers */}
              <div className="flex items-center gap-3  rounded-xl px-3 py-3">
                <Image
                  src="/ride/passenger.svg"
                  alt="passengers"
                  width={36}
                  height={36}
                  className="shrink-0"
                />
                <div>
                  <p className="text-[12px]  font-poppins">Total Passengers</p>
                  <p className="text-[16px]  text-black font-poppins">
                    {totalPassengers > 0
                      ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
                      : "1 Passenger"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Rest unchanged — Vehicle Selected, Fare Details, Payment */}
          <VehicleSelectedCard
            vehicle={DUMMY_VEHICLE}
            onChangeVehicle={() => router.back()}
          />

          {/* Fare Details */}
          <div className="bg-[#f5f5f5] rounded-2xl p-4">
            <h2 className="text-[24px] font-bold font-sora text-black mb-3">
              Fare Details
            </h2>
            <div className="flex flex-col gap-2.5">
              {FARE_DETAILS.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-[16px] text-black font-poppins">
                    {item.label}
                  </span>
                  <span className="text-[16px] text-black font-poppins">
                    Rs {item.amount.toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="h-px bg-gray-200 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-[16px]  text-black font-poppins">
                  Total
                </span>
                <span className="text-[18px] font-bold text-black font-poppins">
                  Rs {TOTAL.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Choose Payment Method */}
          <div className="border border-gray-200 rounded-2xl p-4">
            <h2 className="text-[20px] font-bold font-sora text-black mb-3">
              Choose Payment Method
            </h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button
                onClick={() => setSelectedPayment("esewa")}
                className={[
                  "flex items-center justify-center p-3 rounded-xl border-2 transition-all",
                  selectedPayment === "esewa"
                    ? "border-[#FEA800]"
                    : "border-gray-200",
                ].join(" ")}
              >
                <Image
                  src="/ride/esewa.svg"
                  alt="eSewa"
                  width={80}
                  height={80}
                  className="h-10 w-auto object-contain"
                />
              </button>
              <button
                onClick={() => setSelectedPayment("khalti")}
                className={[
                  "flex items-center justify-center p-3 rounded-xl border-2 transition-all",
                  selectedPayment === "khalti"
                    ? "border-[#FEA800]"
                    : "border-gray-200",
                ].join(" ")}
              >
                <Image
                  src="/ride/khalti.svg"
                  alt="Khalti"
                  width={80}
                  height={30}
                  className="h-10 w-auto object-contain"
                />
              </button>
            </div>
            <button
              disabled={!selectedPayment}
              className="w-full py-3.5 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[16px] hover:bg-[#e09700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
