import { HydrationBoundary } from "@tanstack/react-query";
import BookingSection from "@/components/Booking/Bookingsection";
import EarnWithVehicleSection from "@/components/home/Earnwithvehiclesection";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/Howitwork";
import RidesReadySection from "@/components/home/RidesReadySection";
import VoicesFromTheJourney from "@/components/home/VoicesFromTheJourney";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "Book the Right Car for Every Journey in Nepal",
  description:
    "Book reliable cars, jeeps, and taxis across Nepal with Lokpriya Taxi. Choose your destination, travel date, and vehicle for short rides, long trips, or custom journeys.",
  path: "/",
});

export default async function HomePage() {
  const dehydratedState = await prefetchPublic([
    { key: ["cms-website-data"], path: "/cms/website-data" },
    { key: ["cms-stories"], path: "/cms/stories" },
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TaxiService",
    name: "Lokpriya Taxi",
    description:
      "Reliable car, jeep, and taxi booking across Nepal for short rides, long trips, and custom journeys.",
    url: "https://lokpriyataxi.com.np",
    areaServed: "Nepal",
    provider: {
      "@type": "Organization",
      name: "Lokpriya Taxi Pvt. Ltd.",
      url: "https://lokpriyataxi.com.np",
    },
  };

  return (
    <HydrationBoundary state={dehydratedState}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main>
        <HeroSection />
        <BookingSection />
        <HowItWorksSection />
        <RidesReadySection />
        <WhyChooseUsSection />
        <EarnWithVehicleSection />
        <VoicesFromTheJourney />
      </main>
    </HydrationBoundary>
  );
}
