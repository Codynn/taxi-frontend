import {
  StoryContent,
  StoryStat,
  ValueContent,
} from "@/types/features/about.types";
import { WhyChooseUsFeature } from "@/types/features/whyChooseUs.types";

export const OUR_STORY_CONTENT: StoryContent = {
  title: "Our Story",
  paragraphs: [
    "Popular Ride was created with one goal — to make vehicle booking easier, more transparent, and more accessible for travelers across Nepal.",
    "From city rides to long-distance travel, we understand how important comfort, reliability, and trust are during every journey. Our platform helps travelers quickly find suitable vehicles based on their destination, travel date, and preferred travel style.",
  ],
};

export const STORY_STATS: StoryStat[] = [
  {
    value: "+10000",
    label: "Successful Trips Completed",
  },
  {
    value: "+1000",
    label: "Verified Vehicles Listed",
  },
  {
    value: "94%",
    label: "Customer Satisfaction Rate",
  },
  {
    value: "24/7",
    label: "Support Availability",
  },
];

export const OUR_VALUES_CONTENT: ValueContent = {
  title: "Our Values",
  paragraphs:
    "Built on trust, comfort, reliability, and better travel experiences",
};

export const OUR_VALUES: WhyChooseUsFeature[] = [
  {
    id: "f1",
    icon: "about/vision.svg",
    title: "Our Mission",
    description:
      "Creating an easy and smooth booking experience for every traveler across Nepal.",
  },
  {
    id: "f2",
    icon: "about/mission.svg",
    title: "Our Vision",
    description:
      "Connecting people with reliable, safe and comfortable transportation anytime they travel.",
  },
  {
    id: "f3",
    icon: "about/goal.svg",
    title: "Our Goal",
    description:
      "Improving accessibility, convenience, and confidence through smarter vehicle booking experiences.",
  },
  {
    id: "f4",
    icon: "about/commitment.svg",
    title: "Our Commitment",
    description:
      "Focusing on trusted service, transparent experiences, and customer satisfaction in every ride.",
  },
];
