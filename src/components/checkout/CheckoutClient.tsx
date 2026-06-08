"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";

import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CheckoutBookingSummary from "./CheckoutBookingSummary";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useCreateBooking } from "@/lib/api/booking.api";

type PaymentMethod = "esewa" | "khalti" | null;
type ModalState = "success" | "failure" | null;

/* ── Success Modal ── */
function SuccessModal({
  onClose,
  onViewDetails,
}: {
  onClose: () => void;
  onViewDetails: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-xl">
        {/* Green checkmark circle */}
        <div className="w-32 h-32 rounded-full bg-green-500 flex items-center justify-center mb-2">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 30L24 42L48 18"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h2 className="text-[22px] font-bold font-poppins text-black">
          Booking Successful!
        </h2>
        <p className="text-[15px] font-poppins text-black/70 leading-relaxed">
          Thank you for choosing us. Your ride is confirmed and ready for your
          journey.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-red-500 text-white font-semibold font-poppins text-[15px] hover:bg-red-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onViewDetails}
            className="flex-1 py-3.5 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[15px] hover:bg-[#e09700] transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Failure Modal ── */
function FailureModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-xl">
        {/* Red X circle */}
        <div className="w-32 h-32 rounded-full bg-red-500 flex items-center justify-center mb-2">
          <svg
            width="60"
            height="60"
            viewBox="0 0 60 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 18L42 42M42 18L18 42"
              stroke="white"
              strokeWidth="6"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h2 className="text-[22px] font-bold font-poppins text-black">
          Booking Failed!
        </h2>
        <p className="text-[15px] font-poppins text-black/70 leading-relaxed">
          Something went wrong while processing your booking. Please try again.
        </p>
        <div className="flex gap-3 w-full mt-2">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-red-500 text-white font-semibold font-poppins text-[15px] hover:bg-red-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[15px] hover:bg-[#e09700] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutClient() {
  const router = useRouter();
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [modalState, setModalState] = useState<ModalState>(null);

  const {
    bookingState,
    setBookingState,
    selectedVehicle,
    modalData,
    resetBooking,
  } = useBookingStore();

  const { mutate: createBooking, isPending } = useCreateBooking();

  // Guard: must have both vehicle and modal data
  useEffect(() => {
    if (!selectedVehicle || !modalData) {
      router.replace("/choose-ride");
    }
  }, [selectedVehicle, modalData, router]);

  if (!selectedVehicle || !modalData) return null;

  // Calculate fare details from real data
  const pricePerDay = selectedVehicle.startingPrice;
  const pickUpDate = new Date(modalData.pickUpDate);
  const returnDate = modalData.returnDate
    ? new Date(modalData.returnDate)
    : null;
  const days = returnDate
    ? Math.max(
        1,
        Math.ceil(
          (returnDate.getTime() - pickUpDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
      )
    : 1;

  const baseFare = pricePerDay * days;
  const serviceFee = Math.round(baseFare * 0.05);
  const driverCharge = modalData.driverRequired
    ? Math.round(pricePerDay * days * 0.2)
    : 0;
  const total = baseFare + serviceFee + driverCharge;

  const fareDetails = [
    { label: "Base Fare:", amount: baseFare },
    ...(driverCharge > 0
      ? [{ label: "Driver Charge:", amount: driverCharge }]
      : []),
    { label: "Service Fee:", amount: serviceFee },
  ];

  const handleContinueToPayment = () => {
    if (!selectedPayment) return;

    const toISO = (value: string | Date) => new Date(value).toISOString();

    // Since payment isn't integrated yet, directly trigger booking creation
    createBooking(
      {
        pickUpLocation: modalData.pickUpLocation,
        dropOffLocation: modalData.dropOffLocation,
        pickUpDate: toISO(modalData.pickUpDate),
        returnDate: modalData.returnDate
          ? toISO(modalData.returnDate)
          : undefined,
        bookingType: modalData.bookingType,
        tripType: modalData.tripType,
        driverRequired: modalData.driverRequired,
        // These should come from a form if available; fallback to store/placeholder
        fullName: "",
        contactNumber: "",
        email: "",
        pickUpTime: toISO(modalData.pickUpDate),
        vechicleId: selectedVehicle.id,
      },
      {
        onSuccess: () => {
          setModalState("success");
        },
        onError: () => {
          setModalState("failure");
        },
      },
    );
  };

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />

      {/* Modals */}
      {modalState === "success" && (
        <SuccessModal
          onClose={() => {
            setModalState(null);
            resetBooking();
            router.push("/choose-ride");
          }}
          onViewDetails={() => {
            setModalState(null);
            resetBooking();
            router.push("/my-bookings");
          }}
        />
      )}
      {modalState === "failure" && (
        <FailureModal onClose={() => setModalState(null)} />
      )}

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
              vehicle={selectedVehicle}
              onChangeVehicle={() => router.back()}
            />
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-5">
            <FareDetailsCard fareDetails={fareDetails} total={total} />
            <PaymentCard
              selectedPayment={selectedPayment}
              onSelect={setSelectedPayment}
              onContinue={handleContinueToPayment}
              isLoading={isPending}
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
            vehicle={selectedVehicle}
            onChangeVehicle={() => router.back()}
          />
          <FareDetailsCard fareDetails={fareDetails} total={total} />
          <PaymentCard
            selectedPayment={selectedPayment}
            onSelect={setSelectedPayment}
            onContinue={handleContinueToPayment}
            isLoading={isPending}
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
  onContinue,
  isLoading,
}: {
  selectedPayment: "esewa" | "khalti" | null;
  onSelect: (v: "esewa" | "khalti") => void;
  onContinue: () => void;
  isLoading: boolean;
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
        disabled={!selectedPayment || isLoading}
        onClick={onContinue}
        className="w-full py-4 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[15px] hover:bg-[#e09700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Processing..." : "Continue to Payment"}
      </button>
    </div>
  );
}
