"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";

import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CheckoutBookingSummary from "./CheckoutBookingSummary";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type { BookingFormState } from "@/types/booking.types";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";

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

export default function CheckoutClient() {
  const router = useRouter();
  const [bookingState, setBookingState] = useState<BookingFormState>(
    DEFAULT_BOOKING_STATE,
  );
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);

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

        <div className="hidden lg:grid grid-cols-2 gap-6">
          <div className="flex flex-col gap-5">
            <CheckoutBookingSummary
              bookingState={bookingState}
              variant="desktop"
            />
            <VehicleSelectedCard
              vehicle={DUMMY_VEHICLE}
              onChangeVehicle={() => router.back()}
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            <FareDetailsCard fareDetails={FARE_DETAILS} total={TOTAL} />
            <PaymentCard
              selectedPayment={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>
        </div>

        {/* ── MOBILE ── */}
        <div className="flex lg:hidden flex-col gap-5">
          <CheckoutBookingSummary
            bookingState={bookingState}
            variant="mobile"
          />
          <VehicleSelectedCard
            vehicle={DUMMY_VEHICLE}
            onChangeVehicle={() => router.back()}
          />
          <FareDetailsCard fareDetails={FARE_DETAILS} total={TOTAL} />
          <PaymentCard
            selectedPayment={selectedPayment}
            onSelect={setSelectedPayment}
          />
        </div>
      </div>
    </main>
  );
}

/* ── Fare Details ── */
function FareDetailsCard({
  fareDetails,
  total,
}: {
  fareDetails: { label: string; amount: number }[];
  total: number;
}) {
  return (
    <div className="rounded-2xl p-5 bg-[#f5f5f5]">
      <h2 className="text-[24px] font-bold font-sora text-black mb-4">
        Fare Details
      </h2>
      <div className="flex flex-col gap-3">
        {fareDetails.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className="text-[16px] font-poppins">{item.label}</span>
            <span className="text-[16px] text-black font-poppins">
              Rs {item.amount.toLocaleString()}
            </span>
          </div>
        ))}
        <div className="h-px bg-[#808080]/50 my-1" />
        <div className="flex items-center justify-between">
          <span className="text-[16px] text-black font-poppins">Total</span>
          <span className="text-[20px] font-bold text-black font-poppins">
            Rs {total.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Payment ── */
function PaymentCard({
  selectedPayment,
  onSelect,
}: {
  selectedPayment: "esewa" | "khalti" | null;
  onSelect: (v: "esewa" | "khalti") => void;
}) {
  return (
    <div className="bg-[#f5f5f5] rounded-2xl p-5">
      <h2 className="text-[24px] font-bold font-sora text-black mb-4">
        Choose Payment Method
      </h2>
      <div className="grid grid-cols-2 gap-3 mb-5">
        <button
          onClick={() => onSelect("esewa")}
          className={[
            "flex items-center justify-center p-4 rounded-xl border-2 bg-white transition-all",
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
          onClick={() => onSelect("khalti")}
          className={[
            "flex items-center justify-center p-4 rounded-xl border-2 bg-white transition-all",
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
  );
}
