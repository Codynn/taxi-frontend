"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface BookingIdCopyProps {
  bookingNumber: string;
  className?: string;
}

/** Booking ID shown as readable text with a tap-to-copy button (for reading
 * out or pasting into a support call/WhatsApp message). */
export default function BookingIdCopy({
  bookingNumber,
  className = "",
}: BookingIdCopyProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(bookingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore, text is still readable */
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Copy booking ID"
      className={`inline-flex items-center gap-1.5 text-[12px] text-black font-poppins hover:text-[#FEA800] transition-colors ${className}`}
    >
      {bookingNumber}
      {copied ? (
        <Check className="w-3.5 h-3.5 text-green-500" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-gray-400" />
      )}
    </button>
  );
}
