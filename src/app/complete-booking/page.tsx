"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";

import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard from "@/components/vehicles/Vehicleselectedcard";
import CompleteBookingForm, {
  type CompleteBookingFormValues,
} from "@/components/Booking/Completebookingform";
import Navbar from "@/components/layout/navbar";
import { useBookingStore } from "@/hooks/useBookingStore";
import { useCreateBooking } from "@/lib/api/booking.api";

export default function CompleteBookingPage() {
  const router = useRouter();
  const { bookingState, setBookingState, selectedVehicle, resetBooking } =
    useBookingStore();

  const { mutate: createBooking, isPending } = useCreateBooking();

  // Guard: redirect if no vehicle selected
  useEffect(() => {
    if (!selectedVehicle) {
      router.replace("/choose-ride");
    }
  }, [selectedVehicle, router]);

  if (!selectedVehicle) return null;

  // Map bookingState tripType/driverType → API enums
  const bookingType =
    bookingState.tripType === "round-trip" ? "ROUND_TRIP" : "ONE_WAY";

  const driverRequired = bookingState.driverType === "with-driver";

  const handleSubmit = (values: CompleteBookingFormValues) => {
    createBooking(
      {
        fullName: values.fullName,
        contactNumber: values.contactNumber,
        email: values.email,
        message: values.message,
        pickUpLocation: values.pickupLocation,
        dropOffLocation: values.dropoffLocation,
        pickUpDate: bookingState.dateRange.pickup,
        pickUpTime: values.pickupTime,
        returnDate: bookingState.dateRange.return,
        bookingType,
        tripType: "LONG_TRIP", // adjust if you have a field for this
        driverRequired,
        vechicleId: selectedVehicle.id,
      },
      {
        onSuccess: () => {
          toast.success("Booking confirmed!");
          resetBooking();
          router.push("/booking-confirmed");
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ?? "Failed to create booking",
          );
        },
      },
    );
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
            {/* Left: Vehicle Selected */}
            <div className="w-full lg:flex-1 shrink-0">
              <VehicleSelectedCard
                vehicle={selectedVehicle}
                onChangeVehicle={() => router.push("/choose-ride")}
              />
            </div>

            {/* Right: Booking form */}
            <div className="basis-1/2 min-w-0">
              <CompleteBookingForm
                onSubmit={handleSubmit}
                isSubmitting={isPending}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
