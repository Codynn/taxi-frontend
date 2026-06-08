export type VehicleCategory = "CAR" | "AUTO_RICKSHAW" | "BIKE_SCOOTER";

export interface VehicleFeature {
  icon: string;
  label: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plateNumber: string;
  image: string;
  rating: number;
  trips: number;
  features: VehicleFeature[];
  startingPrice: number;
  currency: string;
  category: VehicleCategory;
}

export interface VehicleTab {
  value: VehicleCategory;
  label: string;
  icon: string;
}

export interface FilterState {
  vehicleTypes: string[];
  gearTypes: string[];
  fuelTypes: string[];
  priceRange: [number, number];
}
