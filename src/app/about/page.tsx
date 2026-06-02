import AboutHeroSection from "@/components/about/AboutHeroSection";
import OurStory from "@/components/about/ourStory";
import OurValues from "@/components/about/ourValues";
import Navbar from "@/components/layout/navbar";

export default function AboutPage() {
  return (
    <main>
      <Navbar />
      <AboutHeroSection />
      <OurStory />
      <OurValues />
    </main>
  );
}
