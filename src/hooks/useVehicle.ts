import { useQuery } from "@tanstack/react-query";

import type { ApiVehicle, VehicleCategory } from "@/lib/api/vehicle.api";
import { getAllVehicles } from "@/lib/api/vehicle.api";

export const VEHICLES_QUERY_KEY = ["vehicles"] as const;

export function useVehicles() {
  return useQuery({
    queryKey: VEHICLES_QUERY_KEY,
    queryFn: getAllVehicles,
    staleTime: 1000 * 60 * 5, // 5 min cache
  });
}

export type { ApiVehicle, VehicleCategory };
