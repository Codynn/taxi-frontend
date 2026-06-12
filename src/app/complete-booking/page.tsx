"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CompleteBookingForm, {
  type CompleteBookingFormValues,
} from "@/components/Booking/Completebookingform";
import Navbar from "@/components/layout/navbar";
import { useBookingStore } from "@/hooks/useBookingStore";

export default function CompleteBookingPage() {
  const router = useRouter();

  const {
    bookingState,
    setBookingState,
    selectedVehicle,
    modalData,
    setContactData,
    hasHydrated,
  } = useBookingStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!selectedVehicle || !modalData) {
      router.replace("/choose-ride");
    }
  }, [hasHydrated, selectedVehicle, modalData, router]);

  if (!hasHydrated) return null;
  if (!selectedVehicle || !modalData) return null;

  const handleSubmit = (values: CompleteBookingFormValues) => {
    const toISO = (value: string | Date) => new Date(value).toISOString();

    // Save step 2 (contact + pickup time + message) for use on the checkout page
    setContactData({
      fullName: values.fullName,
      contactNumber: values.contactNumber,
      email: values.email,
      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      pickUpTime: toISO(values.pickupTime),
      message: values.message,
    });

    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F5] font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 pt-25">
          {/* Go Back */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[16px] font-poppins text-black transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
            Go Back
          </button>

          {/* Booking Summary Bar */}
          <BookingSummaryBar state={bookingState} onUpdate={setBookingState} />

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Left: Vehicle */}
            <div className="w-full flex-1 lg:w-[380px] shrink-0">
              <VehicleSelectedCard
                vehicle={selectedVehicle}
                onChangeVehicle={() => router.push("/choose-ride")}
              />
            </div>

            {/* Right: Form */}
            <div className="basis-1/2 min-w-0">
              <CompleteBookingForm
                onSubmit={handleSubmit}
                isSubmitting={false}
                // Pre-fill locations from step 1
                defaultValues={{
                  pickupLocation: modalData.pickUpLocation,
                  dropoffLocation: modalData.dropOffLocation,
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
