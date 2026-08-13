"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CompleteBookingForm, {
  type CompleteBookingFormValues,
} from "@/components/Booking/Completebookingform";
import CustomTripRequestForm from "@/components/Booking/CustomTripRequestForm";
import Navbar from "@/components/layout/navbar";
import { useBookingStore } from "@/hooks/useBookingStore";
import { adStringToUtcIso } from "@/lib/bs-date";
import type { BookingFormState } from "@/types/booking.types";
import {
  isBookingDateValid,
  BOOKING_DATE_INVALID_MESSAGE,
} from "@/lib/bookingDateValidation";

export default function CompleteBookingClient() {
  const router = useRouter();

  const {
    bookingState,
    setBookingState,
    setModalData,
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
  const dateValid = isBookingDateValid(modalData);

  // The "Edit" sheet on BookingSummaryBar only updates bookingState. Keep
  // modalData (what actually gets submitted) in sync so a corrected pickup
  // date here really does clear the "date invalid" banner below.
  const handleBookingStateUpdate = (state: BookingFormState) => {
    setBookingState(state);
    setModalData({
      ...modalData,
      pickUpLocation: state.destination.from || modalData.pickUpLocation,
      dropOffLocation: state.destination.to || modalData.dropOffLocation,
      pickUpDate: state.dateRange.pickup
        ? adStringToUtcIso(state.dateRange.pickup)
        : modalData.pickUpDate,
      returnDate:
        state.tripTab === "custom" && state.dateRange.return
          ? adStringToUtcIso(state.dateRange.return)
          : undefined,
      bookingType: state.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY",
      locationId: state.destination.locationId ?? modalData.locationId,
      oneWayFare: state.destination.oneWayFare ?? modalData.oneWayFare,
      roundTripFare: state.destination.roundTripFare ?? modalData.roundTripFare,
    });
  };

  const handleSubmit = (values: CompleteBookingFormValues) => {
    if (!isBookingDateValid(modalData)) {
      toast.error(BOOKING_DATE_INVALID_MESSAGE);
      return;
    }
    setContactData({
      fullName: values.fullName,
      contactNumber: values.contactNumber,
      email: values.email,
      pickupLocation: values.pickupLocation,
      dropoffLocation: values.dropoffLocation,
      // Already collected up front on the homepage form, alongside the
      // pickup date — no longer asked again here.
      pickUpTime: modalData.pickUpTime,
      message: values.message,
    });
    router.push("/checkout");
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#F5F5F5] font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 pt-25">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[16px] font-poppins text-black transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
            Go Back
          </button>

          <BookingSummaryBar
            state={bookingState}
            onUpdate={handleBookingStateUpdate}
          />

          {!dateValid && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-[14px] font-semibold font-poppins text-red-700">
                  Your chosen pickup date is invalid
                </p>
                <p className="text-[13px] font-poppins text-red-600 mt-0.5">
                  It looks like your selected pickup date has already passed.
                  Please use the Edit button above to change it before
                  continuing.
                </p>
              </div>
            </div>
          )}

          {isCustomTrip ? (
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              <div className="w-full flex-1 lg:w-[380px] shrink-0">
                <VehicleSelectedCard
                  vehicle={selectedVehicle}
                  isCustomTrip={modalData?.tripType === "CUSTOM_TRIP"}
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
