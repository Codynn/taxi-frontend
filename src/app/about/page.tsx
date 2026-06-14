import AboutHeroSection from "@/components/about/AboutHeroSection";
import BuiltToSection from "@/components/about/BuiltToSection";
import OurStory from "@/components/about/ourStory";
import OurValues from "@/components/about/ourValues";
import Navbar from "@/components/layout/navbar";

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
