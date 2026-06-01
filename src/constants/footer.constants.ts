import type {
  FooterLinkGroup,
  SocialLink,
  ContactInfo,
} from "@/types/footer.types";

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    title: "Company",
    links: [
      { label: "Home", href: "/" },
      { label: "About Us", href: "/about" },
      { label: "Our Rides", href: "/rides" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Help & Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Refund Policy", href: "/refund-policy" },
      { label: "Support Center", href: "/support" },
    ],
  },
];

export const CONTACT_INFO: ContactInfo = {
  address: "Lokpriya Taxi Pvt.Ltd. Dang, Tulsipur",
  phones: ["082-590800", "9763641235"],
  email: "support@rentalcars.com.np",
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "facebook",
    label: "Facebook",
    href: "https://facebook.com",
    icon: "facebook",
  },
  {
    id: "instagram",
    label: "Instagram",
    href: "https://instagram.com",
    icon: "instagram",
  },
  { id: "tiktok", label: "TikTok", href: "https://tiktok.com", icon: "tiktok" },
];

export const FOOTER_DESCRIPTION =
  "Making travel easier with reliable vehicles, smooth booking experiences, and comfortable journeys designed for every traveler.";

export const FOOTER_TAGLINE = "BOOK. RIDE. ENJOY.";

export const FOOTER_COPYRIGHT = "©2026 Popular Ride | Website By";
