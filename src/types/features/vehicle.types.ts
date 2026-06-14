export type VehicleCategory = string;
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
  value: string;
  label: string;
  icon?: string;
  categoryId: string;
}

export interface FilterState {
  vehicleTypes: string[];
  gearTypes: string[];
  fuelTypes: string[];
  priceRange: [number, number];
}
