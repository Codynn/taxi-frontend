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
  } = useBookingStore();

  // Guard: must have vehicle + modal data from prior step
  useEffect(() => {
    if (!selectedVehicle || !modalData) {
      router.replace("/choose-ride");
    }
  }, [selectedVehicle, modalData, router]);

  if (!selectedVehicle || !modalData) return null;

  const handleSubmit = (values: CompleteBookingFormValues) => {
    // Persist form values so CheckoutClient can use them
    setContactData({
      fullName: values.fullName,
      contactNumber: values.contactNumber,
      email: values.email,
      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      pickUpTime: values.pickupTime,
      message: values.message,
    });

    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen font-poppins">
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
