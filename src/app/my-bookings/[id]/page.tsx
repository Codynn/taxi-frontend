import BookingDetailClient from "@/components/booking-history/BookingDetailClient";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Booking Details",
  description: "View your booking details and payment status.",
  path: "/my-bookings",
  noIndex: true,
});

export default async function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <BookingDetailClient bookingId={id} />;
}
