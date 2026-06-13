export interface WebsiteData {
  id: string;
  homepageHeroHeading?: string;
  homepageHeroSubheading?: string;
  homepageHeroVehicleImage?: string;
  aboutPageHeroHeading?: string;
  aboutPageHeroSubheading?: string;
  aboutPageOurStoryDescription?: string;
}

export interface Story {
  id: string;
  message: string;
  username: string;
  rating: number;
}

export interface Stat {
  id: string;
  stat: string;
  statLabel: string;
}

export interface Value {
  id: string;
  title: string;
  icon: string;
  description: string;
}

export interface ContactDetails {
  id: string;
  contacts: string[];
  supportEmail: string[];
  locationString: string;
  mapUrl: string;
  officeHours: string[];
}
