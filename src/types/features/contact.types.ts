export interface ContactInfo {
  phones: string[];
  email: string;
  address: string;
  officeHours: string;
  mapEmbedUrl: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "tiktok";
  href: string;
}

export interface ContactSectionProps {
  heading?: string;
  subheading?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}
