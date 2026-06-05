import BookingHistoryClient from "@/components/booking-history/BookingHistoryClient";

async function getBookingHistory() {
  return Array.from({ length: 12 }, (_, i) => ({
    id: String(i + 1),
    bookingNumber: "#1232142143",
    status: ["Completed", "Completed", "Cancelled", "Cancelled"][i % 4] as
      | "Completed"
      | "Cancelled"
      | "Pending",
    from: "Kathmandu, Putalisadak",
    to: "Pokhara",
    pickup: "2083/02/07-08:00 AM",
    return: "2083/02/07-08:00 AM",
    vehicle: {
      name: "SUV Carrera S 2024",
      plateNumber: "Ba 1 PA 1414",
      image: "vehicle/suv1.png",
      features: [
        { label: "Electric", icon: "vehicle/battery.svg" },
        { label: "5 Seats", icon: "vehicle/seat.svg" },
        { label: "AC", icon: "vehicle/wind.svg" },
      ],
    },
    paid: 15000,
    currency: "Rs",
    tripType: ["long", "short", "custom"][i % 3] as "long" | "short" | "custom",
  }));
}

export default async function BookingHistoryPage() {
  const bookings = await getBookingHistory();
  return <BookingHistoryClient initialBookings={bookings} />;
}
