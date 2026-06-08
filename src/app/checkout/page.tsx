import type { Metadata } from "next";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const metadata: Metadata = {
  title: "Checkout | Popular Ride",
  description:
    "Review your booking summary, selected vehicle, fare details, and complete your payment securely through Popular Ride.",
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
