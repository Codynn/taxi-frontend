import { HydrationBoundary } from "@tanstack/react-query";
import AboutHeroSection from "@/components/about/AboutHeroSection";
import BuiltToSection from "@/components/about/BuiltToSection";
import OurStory from "@/components/about/ourStory";
import OurValues from "@/components/about/ourValues";
import Navbar from "@/components/layout/navbar";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about Popular Ride by Lokpriya Taxi Pvt. Ltd. — making travel across Nepal simpler, safer, and more reliable. Discover our story, values, and mission.",
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
      </main>
    </HydrationBoundary>
  );
}
