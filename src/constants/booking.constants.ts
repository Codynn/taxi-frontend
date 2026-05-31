import type {
  TripTab,
  TripType,
  DriverType,
  BookingFormState,
} from "@/types/booking.types";

export const TRIP_TABS: { value: TripTab; label: string }[] = [
  { value: "long", label: "Long Trip" },
  { value: "short", label: "Short Trip" },
  { value: "custom", label: "Custom Trip" },
];

export const TRIP_TYPES: { value: TripType; label: string }[] = [
  { value: "round-trip", label: "Round Trip" },
  { value: "one-way", label: "One way" },
];

export const DRIVER_TYPES: { value: DriverType; label: string }[] = [
  { value: "with-driver", label: "With Driver" },
  { value: "self-drive", label: "Self Drive" },
];

export const DESTINATIONS: { from: string; to: string }[] = [
  { from: "Dang", to: "Kathmandu" },
  { from: "Dang", to: "Pokhara" },
  { from: "Dang", to: "Lumbini" },
  { from: "Dang", to: "Illam" },
  { from: "Dang", to: "Nepalgunj" },
  { from: "Dang", to: "Biratnagar" },
];

export const PASSENGER_OPTIONS = [
  "1 Passenger",
  "2 Passengers",
  "3 Passengers",
  "4 Passengers",
  "5 Passengers",
  "6+ Passengers",
];

export const DEFAULT_BOOKING_STATE: BookingFormState = {
  tripTab: "long",
  tripType: "round-trip",
  driverType: "with-driver",
  destination: { from: "", to: "" },
  dateRange: { pickup: "", return: "" },
  passengers: { adults: 1, children: 0 },
};

export const CUSTOM_TRIP_NOTE =
  "Choose your destination, and our team will contact you shortly with custom pricing and availability.";
