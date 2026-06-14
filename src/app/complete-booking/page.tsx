"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CompleteBookingForm, {
  type CompleteBookingFormValues,
} from "@/components/Booking/Completebookingform";
import CustomTripRequestForm from "@/components/Booking/CustomTripRequestForm";
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

  const isCustomTrip = modalData.tripType === "CUSTOM_TRIP";

  const handleSubmit = (values: CompleteBookingFormValues) => {
    setContactData({
      fullName: values.fullName,
      contactNumber: values.contactNumber,
      email: values.email,
      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      pickUpTime: new Date(values.pickupTime).toISOString(),
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

          {isCustomTrip ? (
            /* ── Custom Trip Layout ── */
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              <div className="w-full flex-1 lg:w-[380px] shrink-0">
                <VehicleSelectedCard
                  vehicle={selectedVehicle}
                  onChangeVehicle={() => router.push("/choose-ride")}
                />
              </div>
              <div className="basis-1/2 min-w-0">
                <CustomTripRequestForm
                  defaultValues={{
                    pickupLocation: modalData.pickUpLocation,
                    dropoffLocation: modalData.dropOffLocation,
                  }}
                  vehicleId={selectedVehicle.id}
                  modalData={modalData}
                />
              </div>
            </div>
          ) : (
            /* ── Normal Booking Layout ── */
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              <div className="w-full flex-1 lg:w-[380px] shrink-0">
                <VehicleSelectedCard
                  vehicle={selectedVehicle}
                  onChangeVehicle={() => router.push("/choose-ride")}
                />
              </div>
              <div className="basis-1/2 min-w-0">
                <CompleteBookingForm
                  onSubmit={handleSubmit}
                  isSubmitting={false}
                  defaultValues={{
                    pickupLocation: modalData.pickUpLocation,
                    dropoffLocation: modalData.dropOffLocation,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
