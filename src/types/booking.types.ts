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
