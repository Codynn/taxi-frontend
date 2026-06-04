"use client";

import { useEffect, useState } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { bookingState, setBookingState, selectedVehicle } = useBookingStore();

  useEffect(() => {
    if (!selectedVehicle) {
      router.replace("/choose-ride");
    }
  }, [selectedVehicle, router]);

  if (!selectedVehicle) return null;

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

      <div className="min-h-screen  font-poppins">
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
            <div className="w-full lg:w-[320px] basis-1/2 shrink-0">
              <VehicleSelectedCard
                vehicle={selectedVehicle}
                onChangeVehicle={() => router.push("/choose-ride")}
              />
            </div>

            {/* Right: Booking form */}
            <div className="basis-1/2 max-w-full">
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
