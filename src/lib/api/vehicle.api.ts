import { api } from "@/lib/axios";

export type VehicleCategory = "CAR" | "AUTO_RICKSHAW" | "BIKE_SCOOTER";

interface ApiVehicleRaw {
  id: string;
  vechileName: string;
  vechileImage: string;
  vechileType: string;
  vechileNumber: string;
  vechileFuelType: string;
  vechileGearType: string;
  categoryId: string;
  hasAC: boolean;
  noOfSeats: number;
  pricePerDay: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
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
  pricePerDay: number;
  createdAt: string;
  updatedAt: string;
}

interface GetAllVehiclesResponse {
  success: boolean;
  data: {
    data: ApiVehicleRaw[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
}

export async function getAllVehicles(): Promise<ApiVehicle[]> {
  const res = await api.get<GetAllVehiclesResponse>("/vechicle/get-all");
  const raw: ApiVehicleRaw[] = res.data.data;

  return raw.map((v) => ({
    id: v.id,
    vechileName: v.vechileName,
    vechileImage: v.vechileImage,
    vechileType: v.vechileType,
    vechileNumber: v.vechileNumber,
    vechileFuelType: v.vechileFuelType,
    vechileGearType: v.vechileGearType,
    categoryId: v.categoryId,
    category: v.category.name as VehicleCategory,
    hasAC: v.hasAC,
    noOfSeats: v.noOfSeats,
    pricePerDay: v.pricePerDay,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));
}
