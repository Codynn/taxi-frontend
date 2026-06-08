import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";
import type { BookingFormState } from "@/types/booking.types";

import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type { BookingType, TripType as ApiTripType } from "@/lib/api/booking.api";

// Fields collected in BookingModal (step 1) — uses API enums, not UI enums
export interface BookingModalData {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  returnDate?: string;
  bookingType: BookingType;     // "ROUND_TRIP" | "ONE_WAY"
  tripType: ApiTripType;        // "LONG_TRIP" | "SHORT_TRIP" | "CUSTOM_TRIP"
  driverRequired: boolean;
}

interface BookingStore {
  bookingState: BookingFormState;
  modalData: BookingModalData | null;
  selectedVehicle: SelectedVehicle | null;

  setBookingState: (state: BookingFormState) => void;
  setModalData: (data: BookingModalData) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  clearSelectedVehicle: () => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookingState: DEFAULT_BOOKING_STATE,
      modalData: null,
      selectedVehicle: null,

      setBookingState: (state) => set({ bookingState: state }),
      setModalData: (data) => set({ modalData: data }),
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      clearSelectedVehicle: () => set({ selectedVehicle: null }),
      resetBooking: () =>
        set({
          bookingState: DEFAULT_BOOKING_STATE,
          modalData: null,
          selectedVehicle: null,
        }),
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookingState: state.bookingState,
        modalData: state.modalData,
        selectedVehicle: state.selectedVehicle,
      }),
    },
  ),
);