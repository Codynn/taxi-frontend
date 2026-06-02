export interface ContactInfo {
  address: string;
  phones: string[];
  officeHours: string;
  mapEmbedUrl: string;
}

export interface SocialLink {
  platform: "facebook" | "instagram" | "linkedin";
  href: string;
}

export interface ContactSectionProps {
  heading?: string;
  subheading?: string;
  contactInfo?: ContactInfo;
  socialLinks?: SocialLink[];
}
