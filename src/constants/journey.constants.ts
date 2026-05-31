import type { JourneyStep } from "@/types/journey.types";

export const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "step-1",
    step: "01",
    icon: "/logo/route.svg",
    title: "Choose Your Route",
    description:
      "Enter your pickup and drop-off locations to begin planning your journey.",
  },
  {
    id: "step-2",
    step: "02",
    icon: "/logo/date.svg",
    title: "Select Your Date",
    description:
      "Pick your preferred travel date and view available booking options instantly.",
  },
  {
    id: "step-3",
    step: "03",
    icon: "/logo/taxi.svg",
    title: "Find Your Ride",
    description:
      "Browse different vehicle types and choose the one that fits your comfort and budget.",
  },
  {
    id: "step-4",
    step: "04",
    icon: "/logo/booking.svg",
    title: "Confirm Booking",
    description:
      "Complete your reservation in just a few clicks and get ready for your trip.",
  },
];

export const HOW_IT_WORKS_CONTENT = {
  heading: "How Your Journey Works",
  highlightedWord: "Journey",
  description:
    "From selecting your route to confirming your booking, every step is designed to make your travel experience smooth, simple, and stress-free.",
  driverImage: "/home/driver.png",
  driverImageAlt: "Professional driver ready for your journey",
};
