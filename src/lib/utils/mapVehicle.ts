import type { ApiVehicle } from "@/lib/api/vehicle.api";
import type { SelectedVehicle } from "@/components/vehicles/Vehicleselectedcard";

export function apiVehicleToSelectedVehicle(v: ApiVehicle): SelectedVehicle {
  const features: SelectedVehicle["features"] = [];

  if (v.vechileFuelType) {
    features.push({ icon: "vehicle/fuel.svg", label: v.vechileFuelType });
  }
  if (v.vechileGearType) {
    features.push({ icon: "vehicle/battery.svg", label: v.vechileGearType });
  }
  features.push({ icon: "vehicle/seat.svg", label: `${v.noOfSeats} Seats` });
  if (v.hasAC) {
    features.push({ icon: "vehicle/wind.svg", label: "AC" });
  }

  return {
    id: v.id,
    name: v.vechileName,
    plateNumber: v.vechileNumber,
    imageUrl: v.vechileImage,
    rating: 5.0,
    totalTrips: 0,
    startingPrice: v.pricePerDay,
    currency: "Rs",
    features,
  };
}
