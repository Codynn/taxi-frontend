import Navbar from "@/components/layout/navbar";
import RideHeroSection from "@/components/rides/RideHeroSection";
import RideCollectionSection from "@/components/rides/RideCollectionSection";

export default function RidesPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <RideHeroSection />
      <RideCollectionSection />
    </main>
  );
}
