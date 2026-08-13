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
  pickUpTime: string;
  returnDate?: string;
  bookingType: BookingType;
  tripType: ApiTripType;
  driverRequired: boolean;
  locationId?: string;
  oneWayFare?: number;
  roundTripFare?: number;
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

// How long a homepage date/location selection stays valid (10 minutes).
// After this, the persisted selection is cleared on rehydrate so stale picks
// don't show confusing prices when the user reopens the cars page later.
const SELECTION_TTL_MS = 10 * 60 * 1000;

interface BookingStore {
  bookingState: BookingFormState;
  modalData: BookingModalData | null;
  selectedVehicle: SelectedVehicle | null;
  contactData: BookingContactData | null;
  selectionTimestamp: number | null;
  hasHydrated: boolean;

  setBookingState: (state: BookingFormState) => void;
  setModalData: (data: BookingModalData) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  clearSelectedVehicle: () => void;
  setContactData: (data: BookingContactData) => void;
  resetBooking: () => void;
  setHasHydrated: (state: boolean) => void;
}

export const useBookingStore = create<BookingStore>()(
  persist(
    (set) => ({
      bookingState: DEFAULT_BOOKING_STATE,
      modalData: null,
      selectedVehicle: null,
      contactData: null,
      selectionTimestamp: null,
      hasHydrated: false,

      setBookingState: (state) =>
        set({ bookingState: state, selectionTimestamp: Date.now() }),
      setModalData: (data) =>
        set({ modalData: data, selectionTimestamp: Date.now() }),
      setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
      clearSelectedVehicle: () => set({ selectedVehicle: null }),
      setContactData: (data) => set({ contactData: data }),
      resetBooking: () =>
        set({
          bookingState: DEFAULT_BOOKING_STATE,
          modalData: null,
          selectedVehicle: null,
          contactData: null,
          selectionTimestamp: null,
        }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    {
      name: "booking-store",
      partialize: (state) => ({
        bookingState: state.bookingState,
        modalData: state.modalData,
        selectedVehicle: state.selectedVehicle,
        contactData: state.contactData,
        selectionTimestamp: state.selectionTimestamp,
      }),
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        // Expire stale selections older than the TTL.
        if (
          state.selectionTimestamp &&
          Date.now() - state.selectionTimestamp > SELECTION_TTL_MS
        ) {
          state.resetBooking();
        }
        state.setHasHydrated(true);
      },
    },
  ),
);
