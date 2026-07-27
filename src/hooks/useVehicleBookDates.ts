import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface BookedRange {
  pickUpDate: string;
  returnDate: string | null;
  bookingType: "ONE_WAY" | "ROUND_TRIP";
}

interface BookedDatesResponse {
  totalCount: number;
  bookings: BookedRange[];
}

function toDateStr(date: Date) {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

// A vehicle entry can represent several identical physical units
// (totalCount), so a date is only "fully booked" (and should disable the
// picker) once the number of active bookings overlapping that date reaches
// totalCount — not on the first overlapping booking.
function computeFullyBookedDates(
  ranges: BookedRange[],
  totalCount: number,
): Set<string> {
  const counts = new Map<string, number>();

  for (const r of ranges) {
    const start = new Date(r.pickUpDate);
    const end = r.returnDate ? new Date(r.returnDate) : new Date(r.pickUpDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);

    const cur = new Date(start);
    while (cur <= end) {
      const key = toDateStr(cur);
      counts.set(key, (counts.get(key) ?? 0) + 1);
      cur.setDate(cur.getDate() + 1);
    }
  }

  const fullyBooked = new Set<string>();
  for (const [date, count] of counts) {
    if (count >= totalCount) fullyBooked.add(date);
  }
  return fullyBooked;
}

export function useVehicleBookedDates(vehicleId: string | null) {
  return useQuery({
    queryKey: ["vehicle-booked-dates", vehicleId],
    enabled: !!vehicleId,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: BookedDatesResponse }>(
        `/booking/vehicle/${vehicleId}/booked-dates`,
      );
      const { totalCount, bookings } = res.data.data;
      return computeFullyBookedDates(bookings, totalCount || 1);
    },
  });
}
