export type TripTab = "long" | "short" | "custom";
export type TripType = "round-trip" | "one-way";
export type DriverType = "with-driver" | "self-drive";

export interface Destination {
  from: string;
  to: string;
}

export interface DateRange {
  pickup: string;
  return: string;
}

export interface Passengers {
  adults: number;
  children: number;
}

export interface BookingFormState {
  tripTab: TripTab;
  tripType: TripType;
  driverType: DriverType;
  destination: Destination;
  dateRange: DateRange;
  passengers: Passengers;
}

export interface BookingSearchState {
  tripType: TripType;
  driverType: DriverType;
  destination: { from: string; to: string };
  dateRange: { pickup: string; return: string };
  passengers: { adults: number; children: number };
}

export type BookingStatus = "Completed" | "Cancelled" | "Pending";

export interface BookingVehicleFeature {
  label: string;
  icon: string;
}

export interface BookingVehicle {
  name: string;
  plateNumber: string;
  image: string;
  features: BookingVehicleFeature[];
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  from: string;
  to: string;
  pickup: string;
  return: string;
  vehicle: BookingVehicle;
  paid: number;
  currency: string;
  tripType: TripTab;
}

export interface BookingVehicleFeature {
  label: string;
  icon: string;
}

export interface BookingVehicle {
  name: string;
  plateNumber: string;
  image: string;
  features: BookingVehicleFeature[];
}

export interface BookingRecord {
  id: string;
  bookingNumber: string;
  status: BookingStatus;
  from: string;
  to: string;
  pickup: string;
  return: string;
  vehicle: BookingVehicle;
  paid: number;
  currency: string;
  tripType: TripTab;
}
