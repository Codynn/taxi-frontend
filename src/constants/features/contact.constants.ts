import { ContactSectionProps } from "@/types/features/contact.types";

export const CONTACT_SECTION_DEFAULTS: Required<ContactSectionProps> = {
  heading: "Contact Us",
  subheading:
    "Find our office location, contact details, and business hours for booking support and travel assistance.",
  contactInfo: {
    phones: ["082-590800", "9763641235"],
    email: "support@rentalcars.com.np",
    address: "Lokpriya Taxi Pvt.Ltd. Dang, Tulsipur",
    officeHours: "Sun – Friday (9:00 AM – 5:00 PM)",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3533.1!2d85.2795!3d27.6767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjfCsDQwJzM2LjEiTiA4NcKwMTYnNDYuMiJF!5e0!3m2!1sen!2snp!4v1600000000000!5m2!1sen!2snp",
  },
  socialLinks: [
    { platform: "facebook", href: "#" },
    { platform: "instagram", href: "#" },
    { platform: "tiktok", href: "#" },
  ],
};
