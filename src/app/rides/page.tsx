import { HydrationBoundary } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import RideHeroSection from "@/components/rides/RideHeroSection";
import RideCollectionSection from "@/components/rides/RideCollectionSection";
import SeoContent from "@/components/shared/SeoContent";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "Our Cars & Vehicles for Hire in Nepal",
  description:
    "Browse cars, jeeps, SUVs, auto rickshaws, and bikes available to book across Nepal. Compare seats, fuel type, AC, and fares to pick the right vehicle for your trip.",
  path: "/rides",
});

export default async function RidesPage() {
  // Prefetch the initial (unfiltered, default-sorted) vehicle list so the whole
  // fleet is present in the SSR HTML. The client's first render uses the same
  // query key (categoryId is undefined before categories load), so it hydrates
  // without a refetch. Categories are intentionally left to load client-side so
  // this key keeps matching.
  const dehydratedState = await prefetchPublic([
    {
      key: ["vehicles", { sortBy: "createdAt", sortOrder: "desc" }],
      path: "/vechicle/get-all?limit=100&sortBy=createdAt&sortOrder=desc",
    },
  ]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="relative w-full">
        <Navbar />
        <RideHeroSection />
        <RideCollectionSection />
        <SeoContent
          heading="Find the Right Vehicle for Every Trip in Nepal"
          paragraphs={[
            "Our fleet is built to cover every kind of journey in Nepal. Choose a comfortable sedan or hatchback for city travel and airport transfers, a spacious jeep or SUV for hill roads and group trips, or an auto rickshaw and bike for quick local rides. Each vehicle listing shows the number of seats, fuel type, and whether air conditioning is available, so you can match the car to your comfort, budget, and the terrain of your route.",
            "Every vehicle can be filtered and sorted to help you decide quickly. Compare options by category, seating capacity, and features, then check the fare for your chosen route before you reserve. Fares are calculated for your specific pickup and destination, so the price you see reflects the real distance and vehicle — whether you are booking a short within-city trip, a longer city-to-city drive, or a custom multi-day reservation.",
            "Once you have found the right vehicle, pick your travel date and location and confirm your booking in a few steps. You can request a driver, choose one-way or round-trip travel, and review everything before you submit. For custom trips, our team follows up to confirm pricing and availability so your itinerary is exactly what you need.",
            "From Tulsipur and Dang to Kathmandu, Pokhara, Lumbini, and beyond, Lokpriya Taxi gives you a dependable selection of well-maintained vehicles and experienced drivers. Browse the fleet above, compare fares, and reserve the vehicle that fits your journey.",
          ]}
        />
      </main>
    </HydrationBoundary>
  );
}
