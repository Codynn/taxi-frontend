import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BookingFormState } from "@/types/booking.types";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";

interface BookingStore {
  bookingState: BookingFormState;
  selectedVehicle: SelectedVehicle | null;

  setBookingState: (state: BookingFormState) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  clearSelectedVehicle: () => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookingState: DEFAULT_BOOKING_STATE,
      selectedVehicle: null,

      setBookingState: (state) => set({ bookingState: state }),
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      clearSelectedVehicle: () => set({ selectedVehicle: null }),
      resetBooking: () =>
        set({
          bookingState: DEFAULT_BOOKING_STATE,
          selectedVehicle: null,
        }),
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookingState: state.bookingState,
        selectedVehicle: state.selectedVehicle,
      }),
    },
  ),
);
