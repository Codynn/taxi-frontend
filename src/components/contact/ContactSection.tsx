"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaTiktok } from "react-icons/fa";
import { CONTACT_SECTION_DEFAULTS } from "@/constants/features/contact.constants";
import {
  ContactSectionProps,
  SocialLink,
} from "@/types/features/contact.types";
import InquiryForm from "@/components/shared/InquiryForm";
import { usePublicContact } from "@/hooks/useWebsiteData";

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  tiktok: FaTiktok,
} as const;

const FALLBACK = CONTACT_SECTION_DEFAULTS;

export default function ContactSection({
  heading = FALLBACK.heading,
  subheading = FALLBACK.subheading,
  socialLinks = FALLBACK.socialLinks,
}: ContactSectionProps) {
  const { data: cmsContact } = usePublicContact();

  const phones = cmsContact?.contacts?.length
    ? cmsContact.contacts
    : FALLBACK.contactInfo.phones;
  const email =
    cmsContact?.supportEmail?.[0]?.trim() || FALLBACK.contactInfo.email;
  const address =
    cmsContact?.locationString?.trim() || FALLBACK.contactInfo.address;
  const officeHours = cmsContact?.officeHours?.length
    ? cmsContact.officeHours.join(" · ")
    : FALLBACK.contactInfo.officeHours;
  const mapEmbedUrl =
    cmsContact?.mapUrl?.trim() || FALLBACK.contactInfo.mapEmbedUrl;

  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-16 z-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20 items-start">
          <div className="flex flex-col gap-6">
            <p className="font-poppins text-black text-sm sm:text-base leading-relaxed">
              {subheading}
            </p>

            <div className="flex flex-col gap-3">
              <h3 className="font-sora font-bold text-gray-900 text-base">
                Our Contact Details
              </h3>
              <div className="flex items-start gap-2 text-gray-600 text-sm font-poppins">
                <Phone
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500"
                  strokeWidth={1.8}
                />
                <span>{phones.join(", ")}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 text-sm font-poppins">
                <Mail
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500"
                  strokeWidth={1.8}
                />
                <span>{email}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 text-sm font-poppins">
                <MapPin
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500"
                  strokeWidth={1.8}
                />
                <span>{address}</span>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sora font-bold text-gray-900 text-base">
                Office Hours
              </h3>
              <div className="flex items-start gap-2 text-gray-600 text-sm font-poppins">
                <Clock
                  className="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-500"
                  strokeWidth={1.8}
                />
                <span>{officeHours}</span>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sora font-bold text-gray-900 text-base">
                Follow Us
              </h3>
              <div className="flex items-center gap-3">
                {socialLinks.map(({ platform, href }: SocialLink) => {
                  const Icon = SOCIAL_ICONS[platform];
                  return (
                    <a
                      key={platform}
                      href={href}
                      aria-label={platform}
                      className="w-8 h-8 rounded-full bg-[#FEA800] flex items-center justify-center text-white hover:bg-[#e09700] transition-colors duration-200"
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full rounded-xl overflow-hidden border border-gray-200 h-[200px] sm:h-[240px]">
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Office location map"
              />
            </div>
          </div>

          <InquiryForm />
        </div>
      </div>
    </section>
  );
}
