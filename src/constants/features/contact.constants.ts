import { ContactSectionProps } from "@/types/features/contact.types";

export const CONTACT_SECTION_DEFAULTS: Required<ContactSectionProps> = {
  heading: "Let's Plan Your Next Adventure",
  subheading:
    "Whether you are planning a trek in the Himalayas or a customized travel experience, our team is here to guide you every step of the way. Reach out with your questions, preferred dates, or destination ideas, and we will help you plan a smooth and memorable journey.",
  contactInfo: {
    address: "Kritipur, Kathmandu",
    phones: ["9861234567", "9862345678"],
    officeHours: "Sunday - Friday (9:00 AM - 5:00 PM)",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1!2d85.2795!3d27.6767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQwJzM2LjEiTiA4NcKwMTYnNDYuMiJF!5e0!3m2!1sen!2snp!4v1600000000000!5m2!1sen!2snp",
  },
  socialLinks: [
    { platform: "facebook", href: "#" },
    { platform: "instagram", href: "#" },
    { platform: "linkedin", href: "#" },
  ],
};

export const TREK_DESTINATIONS = [
  "Everest Base Camp",
  "Annapurna Circuit",
  "Langtang Valley",
  "Manaslu Circuit",
  "Upper Mustang",
  "Gokyo Lakes",
  "Poon Hill",
  "Custom Trip",
] as const;
