import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";
import type { ApiVehicle } from "@/lib/api/vehicle.api";

export type { ApiVehicle };

export interface VehicleFilters {
  categoryId?: string;
  vechileType?: string;
  vechileFuelType?: string;
  vechileGearType?: string;
  hasAC?: boolean;
  minPrice?: number;
  maxPrice?: number;
  searchName?: string;
}

export function useVehicles(filters: VehicleFilters = {}) {
  return useQuery({
    queryKey: ["vehicles", filters],
    queryFn: async () => {
      const params: Record<string, unknown> = { limit: 100 };
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.vechileType) params.vechileType = filters.vechileType;
      if (filters.vechileFuelType)
        params.vechileFuelType = filters.vechileFuelType;
      if (filters.vechileGearType)
        params.vechileGearType = filters.vechileGearType;
      if (filters.hasAC !== undefined) params.hasAC = filters.hasAC;
      if (filters.minPrice !== undefined) params.minPrice = filters.minPrice;
      if (filters.maxPrice !== undefined) params.maxPrice = filters.maxPrice;
      if (filters.searchName) params.searchName = filters.searchName;

      const res = await api.get<{
        data: ApiVehicle[];
        meta: {
          total: number;
          page: number;
          limit: number;
          totalPages: number;
        };
      }>("/vechicle/get-all", { params });

      return res.data.data;
    },
  });
}
