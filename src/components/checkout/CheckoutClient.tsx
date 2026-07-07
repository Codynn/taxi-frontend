"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import Navbar from "@/components/layout/navbar";

import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CheckoutBookingSummary from "./CheckoutBookingSummary";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useCreateBooking } from "@/lib/api/booking.api";
import {
  useConfiguration,
  uploadFile,
  resolveUploadUrl,
} from "@/lib/api/configuration.api";

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
          Booking Submitted!
        </h2>
        <p className="text-[15px] font-poppins text-black/70 leading-relaxed">
          Thank you for choosing us. We&apos;ve received your booking and
          payment proof. Our team will verify and confirm it shortly.
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
function FailureModal({
  onClose,
  onRetry,
}: {
  onClose: () => void;
  onRetry: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-3xl p-8 mx-4 max-w-sm w-full flex flex-col items-center gap-4 text-center shadow-xl">
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
            onClick={onRetry}
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
  const [modalState, setModalState] = useState<ModalState>(null);
  const [paymentProof, setPaymentProof] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    bookingState,
    selectedVehicle,
    modalData,
    contactData,
    resetBooking,
    hasHydrated,
  } = useBookingStore();

  const { mutate: createBooking, isPending } = useCreateBooking();
  const { data: configuration } = useConfiguration();

  // Guard: must have vehicle, modal data and contact info (wait for persisted store to load)
  useEffect(() => {
    if (!hasHydrated) return;
    if (!selectedVehicle || !modalData) {
      router.replace("/choose-ride");
    } else if (!contactData) {
      router.replace("/complete-booking");
    }
  }, [hasHydrated, selectedVehicle, modalData, contactData, router]);

  if (!hasHydrated) return null;
  if (!selectedVehicle || !modalData || !contactData) return null;

  // Calculate fare details from real data
  const baseFare = selectedVehicle.startingPrice;
  const driverCharge = modalData.driverRequired
    ? (configuration?.defaultDriverCharge ?? 0)
    : 0;
  const total = baseFare + driverCharge;

  const fareDetails = [
    { label: "Base Fare:", amount: baseFare },
    ...(driverCharge > 0
      ? [{ label: "Driver Charge:", amount: driverCharge }]
      : []),
  ];

  const handleUploadProof = async (file: File) => {
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      setPaymentProof(url);
      toast.success("Payment proof uploaded");
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.message ||
          "Failed to upload payment proof. Please try again.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleContinueToPayment = () => {
    if (!paymentProof) return;

    const toISO = (value: string | Date) => new Date(value).toISOString();

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
        fullName: contactData.fullName,
        contactNumber: contactData.contactNumber,
        email: contactData.email,
        message: contactData.message,
        locationId: modalData.locationId,
        pickUpTime: toISO(contactData.pickUpTime),
        vechicleId: selectedVehicle.id,
        paymentProof,
      },
      {
        onSuccess: () => setModalState("success"),
        onError: () => setModalState("failure"),
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
            router.push("/choose-ride=");
          }}
          onViewDetails={() => {
            window.location.href = "/my-bookings";
            setModalState(null);
            resetBooking();
          }}
        />
      )}
      {modalState === "failure" && (
        <FailureModal
          onClose={() => setModalState(null)}
          onRetry={() => {
            setModalState(null);
            handleContinueToPayment();
          }}
        />
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
              qrImage={resolveUploadUrl(configuration?.paymentQrImage) ?? null}
              paymentProof={paymentProof}
              isUploading={isUploading}
              onUpload={handleUploadProof}
              onRemoveProof={() => setPaymentProof(null)}
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
            qrImage={resolveUploadUrl(configuration?.paymentQrImage) ?? null}
            paymentProof={paymentProof}
            isUploading={isUploading}
            onUpload={handleUploadProof}
            onRemoveProof={() => setPaymentProof(null)}
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
  qrImage,
  paymentProof,
  isUploading,
  onUpload,
  onRemoveProof,
  onContinue,
  isLoading,
}: {
  qrImage: string | null;
  paymentProof: string | null;
  isUploading: boolean;
  onUpload: (file: File) => void;
  onRemoveProof: () => void;
  onContinue: () => void;
  isLoading: boolean;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-[#f5f5f5] rounded-2xl p-5">
      <h2 className="text-[24px] font-bold font-sora text-black mb-4">
        Scan & Pay
      </h2>

      {/* QR code */}
      <div className="flex flex-col items-center gap-3 mb-5">
        {qrImage ? (
          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <Image
              src={qrImage}
              alt="Payment QR"
              width={220}
              height={220}
              unoptimized
              className="w-52 h-52 object-contain"
            />
          </div>
        ) : (
          <div className="w-52 h-52 rounded-xl bg-white border border-dashed border-gray-300 flex items-center justify-center text-center px-4">
            <p className="text-[13px] font-poppins text-black/50">
              Payment QR is not available right now. Please contact us to
              complete your payment.
            </p>
          </div>
        )}
        <p className="text-[14px] font-poppins text-black/70 text-center">
          Scan the QR with any payment app, complete the payment, then upload a
          screenshot below.
        </p>
      </div>

      {/* Payment proof upload */}
      <div className="mb-5">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file);
            e.target.value = "";
          }}
        />

        {paymentProof ? (
          <div className="relative bg-white rounded-xl p-3 border border-gray-200">
            <Image
              src={paymentProof}
              alt="Payment proof"
              width={400}
              height={240}
              unoptimized
              className="w-full max-h-60 object-contain rounded-lg"
            />
            <button
              type="button"
              onClick={onRemoveProof}
              className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-6 rounded-xl border-2 border-dashed border-gray-300 bg-white flex flex-col items-center justify-center gap-2 hover:border-[#FEA800] transition-colors disabled:opacity-50"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 text-[#FEA800] animate-spin" />
            ) : (
              <Upload className="w-6 h-6 text-[#FEA800]" />
            )}
            <span className="text-[14px] font-poppins text-black/70">
              {isUploading ? "Uploading..." : "Upload payment screenshot"}
            </span>
          </button>
        )}
      </div>

      <button
        disabled={!paymentProof || isLoading || isUploading}
        onClick={onContinue}
        className="w-full py-4 rounded-full bg-[#FEA800] text-black font-semibold font-poppins text-[15px] hover:bg-[#e09700] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "Submitting..." : "Submit Booking"}
      </button>
    </div>
  );
}
