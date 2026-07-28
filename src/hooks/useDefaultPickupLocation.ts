import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface LocationRoute {
  fromLocation: string;
}

interface LocationResponse {
  success: boolean;
  data: LocationRoute[];
}

// The pickup location with the most routes available from it — i.e. the
// "highest availability" from location — used to pre-fill the From field so
// customers only need to fill in where they're going.
function pickMostAvailableFrom(routes: LocationRoute[]): string {
  const counts = new Map<string, number>();
  for (const r of routes) {
    counts.set(r.fromLocation, (counts.get(r.fromLocation) ?? 0) + 1);
  }
  let best = "";
  let bestCount = 0;
  for (const [from, count] of counts) {
    if (count > bestCount) {
      best = from;
      bestCount = count;
    }
  }
  return best;
}

export function useDefaultPickupLocation() {
  return useQuery({
    queryKey: ["default-pickup-location"],
    queryFn: async () => {
      const res = await api.get<LocationResponse>("/location");
      return pickMostAvailableFrom(res.data.data);
    },
    staleTime: 1000 * 60 * 30,
  });
}
