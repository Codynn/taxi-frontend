import Navbar from "@/components/layout/navbar";
import RideHeroSection from "@/components/rides/RideHeroSection";
import RideCollectionSection from "@/components/rides/RideCollectionSection";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Our Cars",
  description:
    "Browse our fleet of cars, auto rickshaws, and bikes available for booking across Nepal. Find the perfect vehicle for your trip — short rides, long trips, or custom journeys.",
  path: "/rides",
});

export default function RidesPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <RideHeroSection />
      <RideCollectionSection />
    </main>
  );
}
