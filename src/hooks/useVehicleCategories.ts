import { api } from "@/lib/axios";
import { useQuery } from "@tanstack/react-query";

export interface ApiCategory {
  id: string;
  name: string;
  icon?: string;
  vehicleCount: number;
}

export function usePublicVehicleCategories() {
  return useQuery({
    queryKey: ["vehicle-categories-public"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{
        success: boolean;
        data: ApiCategory[];
      }>("/vehicle-category/all");
      return res.data.data;
    },
  });
}
