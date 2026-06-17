import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface BookedRange {
  pickUpDate: string;
  returnDate: string | null;
  bookingType: "ONE_WAY" | "ROUND_TRIP";
}

function toDateStr(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

function expandToBookedSet(ranges: BookedRange[]): Set<string> {
  const set = new Set<string>();

  for (const r of ranges) {
    const start = new Date(r.pickUpDate);
    const end = r.returnDate ? new Date(r.returnDate) : new Date(r.pickUpDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const cur = new Date(start);
    while (cur <= end) {
      set.add(toDateStr(cur));
      cur.setDate(cur.getDate() + 1);
    }
  }

  return set;
}

export function useVehicleBookedDates(vehicleId: string | null) {
  return useQuery({
    queryKey: ["vehicle-booked-dates", vehicleId],
    enabled: !!vehicleId,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BookedRange[] }>(
        `/booking/vehicle/${vehicleId}/booked-dates`,
      );
      return expandToBookedSet(res.data.data);
    },
  });
}
