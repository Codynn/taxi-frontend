"use client";

import { MapPin, Phone, Clock } from "lucide-react";
import { FaFacebookF, FaInstagram, FaLinkedinIn } from "react-icons/fa";
import { CONTACT_SECTION_DEFAULTS } from "@/constants/features/contact.constants";
import {
  ContactSectionProps,
  SocialLink,
} from "@/types/features/contact.types";
import InquiryForm from "@/components/shared/InquiryForm";

const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
} as const;

export default function ContactSection({
  heading = CONTACT_SECTION_DEFAULTS.heading,
  subheading = CONTACT_SECTION_DEFAULTS.subheading,
  contactInfo = CONTACT_SECTION_DEFAULTS.contactInfo,
  socialLinks = CONTACT_SECTION_DEFAULTS.socialLinks,
}: ContactSectionProps) {
  return (
    <section className="w-full bg-white py-12 sm:py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="max-w-[100vw] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 xl:gap-20">
          <div className="flex flex-col gap-6 sm:gap-7">
            <h2 className="font-sora font-bold text-[#22784E] leading-tight m-0 text-2xl sm:text-3xl md:text-4xl lg:text-[38px] xl:text-[44px]">
              {heading}
            </h2>

            <p className="font-montserrat text-gray-600 leading-relaxed m-0 text-sm sm:text-base">
              {subheading}
            </p>

            {/* Address & Contact */}
            <div className="flex flex-col gap-3">
              <h3 className="font-sora font-bold text-[#22784E] text-sm sm:text-base m-0">
                Address and Contact Information
              </h3>
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <MapPin
                  className="w-4 h-4 mt-0.5 text-[#22784E] flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="font-montserrat">{contactInfo.address}</span>
              </div>
              <div className="flex items-start gap-2 text-gray-600 text-sm">
                <Phone
                  className="w-4 h-4 mt-0.5 text-[#22784E] flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="font-montserrat">
                  {contactInfo.phones.join(", ")}
                </span>
              </div>
            </div>

            {/* Office Hours */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sora font-bold text-[#22784E] text-sm sm:text-base lg:text-[18px] m-0">
                Office Hour
              </h3>
              <div className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                <Clock
                  className="w-4 h-4 mt-0.5 text-[#22784E] flex-shrink-0"
                  strokeWidth={2}
                />
                <span className="font-montserrat">
                  {contactInfo.officeHours}
                </span>
              </div>
            </div>

            {/* Follow Us */}
            <div className="flex flex-col gap-2">
              <h3 className="font-sora font-bold text-[#22784E] text-sm sm:text-base lg:text-[18px] m-0">
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
                      className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-[#22784E] hover:border-[#22784E] transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Google Map */}
            <div className="w-full rounded-xl overflow-hidden border border-gray-200 h-[200px] sm:h-[240px] md:h-[260px]">
              <iframe
                src={contactInfo.mapEmbedUrl}
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

          {/* RIGHT — InquiryForm */}
          <div className="bg-gray-50 rounded-2xl p-6 sm:p-8 lg:p-10">
            <InquiryForm />
          </div>
        </div>
      </div>
    </section>
  );
}
