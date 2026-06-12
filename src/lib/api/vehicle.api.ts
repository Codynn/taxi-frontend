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
  data: ApiVehicleRaw[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

function normalizeCategory(name: string): VehicleCategory {
  switch (name) {
    case "CAR":
      return "CAR";
    case "AUTO_RICKSHAW":
      return "AUTO_RICKSHAW";
    case "BIKE_SCOOTER":
      return "BIKE_SCOOTER";
    default:
      return "CAR";
  }
}

export async function getAllVehicles(): Promise<ApiVehicle[]> {
  const res = await api.get<GetAllVehiclesResponse>("/vechicle/get-all");

  const raw = res.data.data;

  return raw.map((v) => ({
    id: v.id,
    vechileName: v.vechileName,
    vechileImage: v.vechileImage,
    vechileType: v.vechileType,
    vechileNumber: v.vechileNumber,
    vechileFuelType: v.vechileFuelType,
    vechileGearType: v.vechileGearType,
    categoryId: v.categoryId,

    // safe mapping
    category: normalizeCategory(v.category.name),

    hasAC: v.hasAC,
    noOfSeats: v.noOfSeats,
    pricePerDay: v.pricePerDay,
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  }));
}
