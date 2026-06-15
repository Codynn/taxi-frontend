import AboutHeroSection from "@/components/about/AboutHeroSection";
import BuiltToSection from "@/components/about/BuiltToSection";
import OurStory from "@/components/about/ourStory";
import OurValues from "@/components/about/ourValues";
import Navbar from "@/components/layout/navbar";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Learn about Popular Ride by Lokpriya Taxi Pvt. Ltd. — making travel across Nepal simpler, safer, and more reliable. Discover our story, values, and mission.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <main>
      <Navbar forceWhite />
      <AboutHeroSection />
      <OurStory />
      <OurValues />
      <BuiltToSection />
    </main>
  );
}
