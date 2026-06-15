import CompleteBookingClient from "@/components/shared/CompleteBookingClient";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Complete Booking",
  description:
    "Fill in your details to complete your vehicle booking with Popular Ride. Secure and easy booking for your journey across Nepal.",
  path: "/complete-booking",
  noIndex: true,
});

export default function CompleteBookingPage() {
  return <CompleteBookingClient />;
}
