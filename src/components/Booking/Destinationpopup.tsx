"use client";

import { DESTINATIONS } from "@/constants/booking.constants";
import type { Destination } from "@/types/booking.types";

interface DestinationPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (dest: Destination) => void;
}

export default function DestinationPopup({
  open,
  onClose,
  onSelect,
}: DestinationPopupProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6 z-10 max-h-[80vh] overflow-y-auto">
        <h3 className="text-base font-semibold font-sora text-gray-900 pb-3 border-b border-gray-100">
          All Destination
        </h3>

        <div className="mt-3 flex flex-col gap-1">
          {DESTINATIONS.map((dest, i) => (
            <button
              key={i}
              onClick={() => {
                onSelect(dest);
                onClose();
              }}
              className="flex items-center justify-between py-3 px-2 rounded-lg hover:bg-gray-50 transition-colors w-full text-left"
            >
              <span className="text-sm font-medium text-gray-800 font-poppins">
                {dest.from}
              </span>
              <span className="text-[#FEA800]">
                <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                  <path
                    d="M1 6h18M13 1l6 5-6 5"
                    stroke="#FEA800"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M19 6H1M7 11L1 6l6-5"
                    stroke="#FEA800"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-sm font-medium text-gray-800 font-poppins">
                {dest.to}
              </span>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-gray-900 font-poppins">
              Can&apos;t find your destination?
            </p>
            <p className="text-xs text-gray-500 font-poppins mt-0.5">
              Click &quot;Custom Trip&quot; and our team will contact you with
              availability and pricing.
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 bg-[#FEA800] text-black text-sm font-semibold font-poppins px-4 py-2 rounded-full hover:bg-[#FEA800]/90 transition-colors"
          >
            Custom Trip
          </button>
        </div>
      </div>
    </div>
  );
}
