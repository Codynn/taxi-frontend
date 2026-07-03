import { HydrationBoundary } from "@tanstack/react-query";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import BuiltToSection from "@/components/about/BuiltToSection";
import OurStory from "@/components/about/ourStory";
import OurValues from "@/components/about/ourValues";
import Navbar from "@/components/layout/navbar";
import SeoContent from "@/components/shared/SeoContent";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "About Lokpriya Taxi — Our Story & Mission",
  description:
    "Learn about Lokpriya Taxi Pvt. Ltd. (Popular Ride) — a Nepal-based taxi and vehicle rental service making travel simpler, safer, and more reliable across the country.",
  path: "/about",
});

export default async function AboutPage() {
  const dehydratedState = await prefetchPublic([
    { key: ["cms-website-data"], path: "/cms/website-data" },
    { key: ["cms-stats"], path: "/cms/stats" },
    { key: ["cms-values"], path: "/cms/values" },
  ]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main>
        <Navbar forceWhite />
        <AboutHeroSection />
        <OurStory />
        <OurValues />
        <BuiltToSection />
        <SeoContent
          heading="Who We Are"
          paragraphs={[
            "Lokpriya Taxi Pvt. Ltd., known online as Popular Ride, is a Nepal-based transport company dedicated to making travel across the country easier and more dependable. We started with a simple goal: give travellers a trustworthy way to find a vehicle, understand the fare, and book a ride without the usual guesswork. Today we connect passengers with well-maintained cars, jeeps, autos, and bikes, supported by experienced local drivers who know the roads.",
            "Our service covers everyday city travel, longer inter-city journeys, airport transfers, and custom multi-day reservations. We serve routes across Tulsipur, Dang, Butwal, Kathmandu, Pokhara, Lumbini, Nepalgunj, Biratnagar, and many other destinations. Because we operate locally, we can offer fair, route-based pricing and personal support for trips that need special planning.",
            "We believe good transport is about more than getting from one place to another. It is about safety, punctuality, and treating every passenger with respect. That is why we focus on transparent fares, clean and reliable vehicles, and clear communication from the moment you book until you reach your destination. Whether you are commuting, travelling for work, or exploring Nepal with family, we want the journey to feel effortless.",
            "As we grow, our commitment stays the same: reliable vehicles, honest pricing, and friendly service that travellers can count on. Thank you for choosing Lokpriya Taxi for your journeys across Nepal.",
          ]}
        />
      </main>
    </HydrationBoundary>
  );
}
