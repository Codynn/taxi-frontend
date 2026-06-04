"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft } from "lucide-react";
import { useState } from "react";
import BookingSummaryBar from "@/components/Booking/BookingSummaryBar";
import VehicleSelectedCard, {
  type SelectedVehicle,
} from "@/components/vehicles/Vehicleselectedcard";
import CompleteBookingForm, {
  type CompleteBookingFormValues,
} from "@/components/Booking/Completebookingform";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type { BookingFormState } from "@/types/booking.types";
import Navbar from "@/components/layout/navbar";

const MOCK_BOOKING_STATE: BookingFormState = {
  ...DEFAULT_BOOKING_STATE,
  tripType: "round-trip",
  driverType: "with-driver",
  destination: { from: "Kathmandu", to: "Pokhara" },
  dateRange: { pickup: "2083/02/07-08:00 AM", return: "2083/02/07-08:00 AM" },
  passengers: { adults: 1, children: 0 },
};

const MOCK_VEHICLE: SelectedVehicle = {
  id: "1",
  name: "SUV Carrera S 2024",
  plateNumber: "Ba 1 PA 1414",
  imageUrl: "/vehicles/suv.jpg",
  fuelType: "Electric",
  seats: 5,
  hasAC: true,
  rating: 5.0,
  totalTrips: 120,
  startingPrice: 5000,
};

export default function CompleteBookingPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingState, setBookingState] =
    useState<BookingFormState>(MOCK_BOOKING_STATE);

  const handleSubmit = async (values: CompleteBookingFormValues) => {
    setIsSubmitting(true);
    try {
      // TODO: call API
      console.log("Booking submitted:", values);
      router.push("/booking-confirmed");
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#F5F5F5] font-poppins">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-5 pt-25">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[16px] font-poppins text-black  transition-colors w-fit cursor-pointer"
          >
            <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
            Go Back
          </button>

          {/* Booking Summary Bar */}
          <BookingSummaryBar
            state={bookingState}
            onUpdate={(updated) => setBookingState(updated)}
          />

          {/* Main content */}
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            {/* Left: Vehicle Selected */}
            <div className="w-full lg:w-[320px] shrink-0">
              <VehicleSelectedCard
                vehicle={MOCK_VEHICLE}
                onChangeVehicle={() => router.push("/choose-ride")}
              />
            </div>

            {/* Right: Booking form */}
            <div className="flex-1 min-w-0">
              <CompleteBookingForm
                onSubmit={handleSubmit}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
