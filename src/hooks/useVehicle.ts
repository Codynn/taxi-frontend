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
  searchName?: string;
  sortBy?:
    | "vechileName"
    | "noOfSeats"
    | "createdAt"
    | "updatedAt"
    | "vechileType"
    | "vechileFuelType"
    | "vechileGearType";
  sortOrder?: "asc" | "desc";
  /** ISO date strings — when both are set, vehicles fully booked for this
   * range are annotated with isAvailableForDates: false instead of being
   * removed from the results, so they can be shown but disabled. */
  availableFrom?: string;
  availableTo?: string;
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
      if (filters.searchName) params.searchName = filters.searchName;
      if (filters.sortBy) params.sortBy = filters.sortBy;
      if (filters.sortOrder) params.sortOrder = filters.sortOrder;
      if (filters.availableFrom && filters.availableTo) {
        params.availableFrom = filters.availableFrom;
        params.availableTo = filters.availableTo;
        params.markUnavailable = true;
      }

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
