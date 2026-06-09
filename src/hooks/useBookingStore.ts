import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";
import type { BookingFormState } from "@/types/booking.types";
import { DEFAULT_BOOKING_STATE } from "@/constants/booking.constants";
import type {
  BookingType,
  TripType as ApiTripType,
} from "@/lib/api/booking.api";

// Fields collected in BookingModal (step 1)
export interface BookingModalData {
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  returnDate?: string;
  bookingType: BookingType;
  tripType: ApiTripType;
  driverRequired: boolean;
}

// Fields collected in CompleteBookingForm (step 2)
export interface BookingContactData {
  fullName: string;
  contactNumber: string;
  email: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickUpTime: string;
  message?: string;
}

interface BookingStore {
  bookingState: BookingFormState;
  modalData: BookingModalData | null;
  selectedVehicle: SelectedVehicle | null;
  contactData: BookingContactData | null;

  setBookingState: (state: BookingFormState) => void;
  setModalData: (data: BookingModalData) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  clearSelectedVehicle: () => void;
  setContactData: (data: BookingContactData) => void;
  resetBooking: () => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookingState: DEFAULT_BOOKING_STATE,
      modalData: null,
      selectedVehicle: null,
      contactData: null,

      setBookingState: (state) => set({ bookingState: state }),
      setModalData: (data) => set({ modalData: data }),
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      clearSelectedVehicle: () => set({ selectedVehicle: null }),
      setContactData: (data) => set({ contactData: data }),
      resetBooking: () =>
        set({
          bookingState: DEFAULT_BOOKING_STATE,
          modalData: null,
          selectedVehicle: null,
          contactData: null,
        }),
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookingState: state.bookingState,
        modalData: state.modalData,
        selectedVehicle: state.selectedVehicle,
        contactData: state.contactData,
      }),
    },
  ),
);
