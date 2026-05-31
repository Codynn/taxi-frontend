import BookingSection from "@/components/Booking/Bookingsection";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/Howitwork";

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <BookingSection />
      <HowItWorksSection />
    </main>
  );
}
