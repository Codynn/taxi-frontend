import BookingSection from "@/components/Booking/Bookingsection";
import EarnWithVehicleSection from "@/components/home/Earnwithvehiclesection";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/Howitwork";
import RidesReadySection from "@/components/home/RidesReadySection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BookingSection />
      <HowItWorksSection />
      <RidesReadySection />
      <WhyChooseUsSection />
      <EarnWithVehicleSection />
    </main>
  );
}
