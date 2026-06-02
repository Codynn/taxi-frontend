"use client";

import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import Navbar from "@/components/layout/navbar";

export default function AboutPage() {
  return (
    <main className="relative w-full">
      <Navbar />

      <ContactHero />
      <ContactSection />
    </main>
  );
}
