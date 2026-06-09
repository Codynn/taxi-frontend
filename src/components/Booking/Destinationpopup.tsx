"use client";

import type { Destination } from "@/types/booking.types";
import { ArrowLeftRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface LocationRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  oneWayFare: number;
  roundTripFare: number;
  outsideDistrict: boolean;
}

interface LocationResponse {
  success: boolean;
  data: LocationRoute[];
}

function useLocations() {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const res = await api.get<LocationResponse>("/location");
      return res.data.data;
    },
  });
}

interface DestinationPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (dest: Destination) => void;
  inline?: boolean;
}

function DestinationContent({
  onClose,
  onSelect,
}: {
  onClose: () => void;
  onSelect: (dest: Destination) => void;
}) {
  const { data: routes, isLoading } = useLocations();

  return (
    <>
      <div className="px-8 py-5 border-b border-gray-200">
        <h3 className="text-base font-semibold font-sora text-gray-900 text-center">
          All Destination
        </h3>
      </div>

      <div className="flex flex-col max-h-[60vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            Loading destinations...
          </div>
        ) : (
          (routes ?? []).map((route) => (
            <button
              key={route.id}
              onClick={() => {
                onSelect({ from: route.fromLocation, to: route.toLocation });
                onClose();
              }}
              className="flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 w-full"
            >
              <span className="text-sm font-medium text-gray-800 font-poppins w-1/3 text-left">
                {route.fromLocation}
              </span>
              <ArrowLeftRight size={18} className="text-[#FEA800] shrink-0" />
              <span className="text-sm font-medium text-gray-800 font-poppins w-1/3 text-right">
                {route.toLocation}
              </span>
            </button>
          ))
        )}
      </div>

      <div className="px-8 py-5 border-t border-gray-100 flex items-center justify-between gap-6">
        <div>
          <p className="text-sm font-semibold text-gray-900 font-poppins">
            Can&apos;t find your destination?
          </p>
          <p className="text-xs text-gray-500 font-poppins mt-1 leading-relaxed">
            Click &quot;Custom Trip&quot; and our team will contact you with
            availability and pricing.
          </p>
        </div>
        <button
          onClick={onClose}
          className="shrink-0 bg-[#FEA800] text-black text-sm font-semibold font-poppins px-6 py-2.5 rounded-full hover:bg-[#FEA800]/90 transition-colors"
        >
          Custom Trip
        </button>
      </div>
    </>
  );
}

export default function DestinationPopup({
  open,
  onClose,
  onSelect,
  inline = false,
}: DestinationPopupProps) {
  if (!open) return null;

  if (inline) {
    return <DestinationContent onClose={onClose} onSelect={onSelect} />;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 z-10 overflow-hidden">
        <DestinationContent onClose={onClose} onSelect={onSelect} />
      </div>
    </div>
  );
}
