import type {
  WhyChooseUsFeature,
  WhyChooseUsContent,
} from "@/types/features/whyChooseUs.types";

export const WHY_CHOOSE_US_CONTENT: WhyChooseUsContent = {
  heading: "Why Travelers",
  highlightedWord: "Choose Us",
  description:
    "Experience a smoother way to plan and book your journey with trusted vehicles, transparent pricing, and a seamless travel experience.",
  image: "home/family.svg",
  imageAlt: "Happy family traveling in a taxi",
};

export const WHY_CHOOSE_US_FEATURES: WhyChooseUsFeature[] = [
  {
    id: "f1",
    icon: "logo/taxi.svg",
    title: "Wide Range of Vehicles",
    description:
      "Choose from economy cars, family vehicles, SUVs, and premium rides suitable for every type of journey and travel plan.",
  },
  {
    id: "f2",
    icon: "logo/route.svg",
    title: "Flexible Route Booking",
    description:
      "Book your ride based on your pickup location, destination, and travel date with easy route-based availability.",
  },
  {
    id: "f3",
    icon: "logo/cash.svg",
    title: "Fair & Clear Pricing",
    description:
      "Know your estimated travel cost before booking and enjoy transparent pricing without confusion during your trip.",
  },
  {
    id: "f4",
    icon: "logo/trust.svg",
    title: "Trusted Travel Experience",
    description:
      "Travel with confidence through verified vehicles, smooth booking, and a reliable experience from start to finish.",
  },
];
