import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import Navbar from "@/components/layout/navbar";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Contact Us",
  description:
    "Get in touch with Popular Ride. Find our office location, phone numbers, support email, and business hours. We're here to help with your booking needs.",
  path: "/contact",
});

export default function AboutPage() {
  return (
    <main className="relative w-full">
      <Navbar />

      <ContactHero />
      <ContactSection />
    </main>
  );
}
