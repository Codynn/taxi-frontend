import ChooseRideClient from "@/components/shared/ChooseRideClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Choose Your Ride | Popular Ride",
  description:
    "Browse available vehicles and choose the right ride for your trip.",
};

export default function ChooseRidePage() {
  return <ChooseRideClient />;
}
