import { HydrationBoundary } from "@tanstack/react-query";
import Navbar from "@/components/layout/navbar";
import RideHeroSection from "@/components/rides/RideHeroSection";
import RideCollectionSection from "@/components/rides/RideCollectionSection";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "Our Cars",
  description:
    "Browse our fleet of cars, auto rickshaws, and bikes available for booking across Nepal. Find the perfect vehicle for your trip — short rides, long trips, or custom journeys.",
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
      </main>
    </HydrationBoundary>
  );
}
