import BookingSection from "@/components/Booking/Bookingsection";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/Howitwork";
import RidesReadySection from "@/components/home/RidesReadySection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BookingSection />
      <HowItWorksSection />
      <RidesReadySection />
    </main>
  );
}
