import { HydrationBoundary } from "@tanstack/react-query";
import ContactHero from "@/components/contact/ContactHero";
import ContactSection from "@/components/contact/ContactSection";
import Navbar from "@/components/layout/navbar";
import SeoContent from "@/components/shared/SeoContent";
import { createMetadata } from "@/lib/utils/metadata";
import { prefetchPublic } from "@/lib/server/prefetch";

export const metadata = createMetadata({
  title: "Contact Lokpriya Taxi — Phone, Email & Location",
  description:
    "Contact Lokpriya Taxi (Popular Ride) for bookings and support in Nepal. Find our phone numbers, support email, office location, and business hours to plan your ride.",
  path: "/contact",
});

export default async function ContactPage() {
  const dehydratedState = await prefetchPublic([
    { key: ["cms-contact"], path: "/cms/contact-details" },
  ]);

  return (
    <HydrationBoundary state={dehydratedState}>
      <main className="relative w-full">
        <Navbar />

        <ContactHero />
        <ContactSection />
        <SeoContent
          heading="Get in Touch With Lokpriya Taxi"
          paragraphs={[
            "Have a question about a booking, need help planning a custom trip, or want a quote for a long-distance journey? Our team is here to help. You can reach Lokpriya Taxi (Popular Ride) by phone, email, or by visiting our office during business hours. Whether you are arranging an airport transfer, a within-city ride, or a multi-day reservation across Nepal, we are happy to guide you to the right vehicle and fare.",
            "For the fastest response, call us with your pickup location, destination, travel date, and the number of passengers. This helps us recommend the most suitable vehicle — a sedan for city travel, a jeep or SUV for hill routes, or an auto and bike for short local trips — and confirm availability right away. For custom trips, our team will share pricing and options tailored to your itinerary.",
            "You can also send us a message using the contact form on this page, and we will get back to you as soon as possible. We serve travellers across Tulsipur, Dang, Butwal, Kathmandu, Pokhara, Lumbini, Nepalgunj, Biratnagar, and many other destinations, so wherever your journey begins, we can help you plan it.",
            "We value clear, friendly communication and aim to make every booking simple from start to finish. Reach out any time — we look forward to helping you travel comfortably and reliably across Nepal.",
          ]}
        />
      </main>
    </HydrationBoundary>
  );
}
