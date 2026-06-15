import BookingHistoryClient from "@/components/booking-history/BookingHistoryClient";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Booking History",
  description:
    "View all your past and upcoming vehicle bookings with Popular Ride. Track your trip status, booking details, and journey history.",
  path: "/booking-history",
  noIndex: true,
});

export default function BookingHistoryPage() {
  return <BookingHistoryClient />;
}
