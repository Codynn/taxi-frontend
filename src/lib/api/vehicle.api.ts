import { api } from "@/lib/axios";

export type VehicleCategory = "CAR" | "AUTO_RICKSHAW" | "BIKE_SCOOTER";

export interface ApiVehicle {
  id: string;
  vechileName: string;
  vechileImage: string;
  vechileType: string;
  vechileNumber: string;
  vechileFuelType: string;
  vechileGearType: string;
  category: VehicleCategory;
  hasAC: boolean;
  noOfSeats: number;
  createdAt: string;
  updatedAt: string;
  pricePerDay: number;
}

export async function getAllVehicles(): Promise<ApiVehicle[]> {
  const res = await api.get<{ success: boolean; data: ApiVehicle[] }>(
    "/vechicle/get-all",
  );
  return res.data.data;
}
