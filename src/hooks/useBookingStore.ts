import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";
import type { BookingFormState, TripType } from "@/types/booking.types";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import { BookingType } from "@/lib/api/booking.api";

export interface BookingModalData {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate: string;
  bookingType: BookingType;
  tripType: TripType;
  driverRequired: boolean;
}

interface BookingStore {
  // Summary bar UI state
  bookingState: BookingFormState;
  // Step 1 data from BookingModal
  modalData: BookingModalData | null;
  // Step 2 selected vehicle
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
