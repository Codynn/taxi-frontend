"use client";

import { Phone } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

interface SupportContactLinksProps {
  whatsappNumber?: string | null;
  phoneNumber?: string | null;
  /** Pre-filled WhatsApp message, e.g. mentioning a booking ID. */
  whatsappMessage?: string;
  /** Icon-only circular buttons instead of the full text pill — for tight spaces like a booking card. */
  compact?: boolean;
  className?: string;
}

function toTelHref(num: string) {
  return `tel:${num.replace(/[^\d+]/g, "")}`;
}

function toWhatsappHref(num: string, message?: string) {
  const digits = num.replace(/\D/g, "");
  const base = `https://wa.me/${digits}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}

/** Call / WhatsApp buttons for a support contact — used on checkout and my-bookings. */
export default function SupportContactLinks({
  whatsappNumber,
  phoneNumber,
  whatsappMessage,
  compact = false,
  className = "",
}: SupportContactLinksProps) {
  if (!whatsappNumber && !phoneNumber) return null;

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {phoneNumber && (
          <a
            href={toTelHref(phoneNumber)}
            title={`Call ${phoneNumber}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white text-[#FEA800] hover:border-[#FEA800] transition-colors"
          >
            <Phone className="w-4 h-4" />
          </a>
        )}
        {whatsappNumber && (
          <a
            href={toWhatsappHref(whatsappNumber, whatsappMessage)}
            target="_blank"
            rel="noopener noreferrer"
            title={`WhatsApp ${whatsappNumber}`}
            className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-green-200 bg-white text-green-500 hover:border-green-400 transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
          </a>
        )}
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      {phoneNumber && (
        <a
          href={toTelHref(phoneNumber)}
          className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-[13px] font-poppins text-black hover:border-[#FEA800] transition-colors"
        >
          <Phone className="w-4 h-4 text-[#FEA800]" />
          {phoneNumber}
        </a>
      )}
      {whatsappNumber && (
        <a
          href={toWhatsappHref(whatsappNumber, whatsappMessage)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-white px-4 py-2 text-[13px] font-poppins text-black hover:border-green-400 transition-colors"
        >
          <FaWhatsapp className="w-4 h-4 text-green-500" />
          {whatsappNumber}
        </a>
      )}
    </div>
  );
}
