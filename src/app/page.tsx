import { HydrationBoundary } from "@tanstack/react-query";
import BookingSection from "@/components/Booking/Bookingsection";
import EarnWithVehicleSection from "@/components/home/Earnwithvehiclesection";
import HeroSection from "@/components/home/hero";
import HowItWorksSection from "@/components/home/Howitwork";
import RidesReadySection from "@/components/home/RidesReadySection";
import VoicesFromTheJourney from "@/components/home/VoicesFromTheJourney";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import SeoContent from "@/components/shared/SeoContent";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "Car & Taxi Booking in Nepal",
  description:
    "Book reliable cars, jeeps, and taxis across Nepal with Lokpriya Taxi. Compare vehicles, pick your date and route, and reserve short rides, long trips, or custom journeys.",
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
    url: "https://www.lokpriyataxi.com.np",
    areaServed: "Nepal",
    provider: {
      "@type": "Organization",
      name: "Lokpriya Taxi Pvt. Ltd.",
      url: "https://www.lokpriyataxi.com.np",
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
        <SeoContent
          heading="Reliable Car & Taxi Booking Across Nepal"
          paragraphs={[
            "Lokpriya Taxi (Popular Ride) makes travelling across Nepal simple, safe, and predictable. Whether you need a quick ride within the city, a comfortable car for a long inter-city trip, or a custom multi-day reservation, you can browse real vehicles, see transparent fares, and reserve the one that fits your journey. Every booking is handled by our local team, so you always know who is picking you up and what you are paying.",
            "Start by choosing your pickup location, destination, and travel date. For within-city and city-to-city routes you get a clear, upfront fare for each available vehicle, and for custom trips our team confirms pricing and availability directly with you. You can book a sedan or hatchback for everyday travel, a jeep or SUV for rough hill roads and group trips, or an auto and bike for short local hops. Drivers who know Nepal's roads help you reach your destination comfortably and on time.",
            "Popular routes include Tulsipur, Dang, Butwal, Kathmandu, Pokhara, Lumbini, Nepalgunj, Biratnagar, and airport transfers across the country. Because pricing depends on the route and the vehicle, you can compare options side by side before you commit — no hidden charges and no surprises. Choose one-way or round-trip, add a driver if you need one, and complete your reservation in a few taps.",
            "From daily commutes to long holiday journeys, Lokpriya Taxi is built to give travellers in Nepal a dependable way to move. Reserve online any time, track your booking status, and travel with confidence knowing a trusted local operator is behind every ride.",
          ]}
        />
      </main>
    </HydrationBoundary>
  );
}
