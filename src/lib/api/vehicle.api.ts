import { api } from "@/lib/axios";

export interface VehicleCategory {
  id: string;
  name: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiVehicle {
  id: string;
  vechileName: string;
  vechileImage: string;
  vechileType: string;
  vechileNumber: string;
  vechileFuelType: string;
  vechileGearType: string;
  categoryId: string;
  category: VehicleCategory;
  hasAC: boolean;
  noOfSeats: number;
  priceIncreasePercentage: number;
  createdAt: string;
  updatedAt: string;
  // Present only when the list was queried with a date range + markUnavailable —
  // false means this vehicle is fully booked for those dates.
  isAvailableForDates?: boolean;
}

interface GetAllVehiclesResponse {
  data: ApiVehicle[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export async function getAllVehicles(params?: {
  categoryId?: string;
  limit?: number;
  searchName?: string;
  vechileGearType?: string;
  vechileFuelType?: string;
  hasAC?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}): Promise<ApiVehicle[]> {
  const res = await api.get<GetAllVehiclesResponse>("/vechicle/get-all", {
    params,
  });
  return res.data.data;
}
