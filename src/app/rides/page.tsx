import Navbar from "@/components/layout/navbar";
import RideHeroSection from "@/components/rides/RideHeroSection";

export default function RidesPage() {
  return (
    <main className="relative w-full">
      <Navbar />
      <RideHeroSection />
      {/* Rest of ride page sections go here */}
    </main>
  );
}
