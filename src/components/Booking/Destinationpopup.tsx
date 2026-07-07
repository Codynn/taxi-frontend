"use client";

import type { Destination } from "@/types/booking.types";
import { Clock, ArrowDown, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { useState } from "react";

interface LocationRoute {
  id: string;
  fromLocation: string;
  toLocation: string;
  oneWayFare: number;
  roundTripFare: number;
  outsideDistrict: boolean;
  totalDays: number;
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
  onCustomClick: () => void;
  onSelect: (dest: Destination) => void;
  inline?: boolean;
  tripType?: "one-way" | "round-trip"; // <-- pass in from BookingForm
}

function DestinationContent({
  onClose,
  onCustomClick,
  onSelect,
  tripType: externalTripType,
}: {
  onClose: () => void;
  onCustomClick: () => void;
  onSelect: (dest: Destination) => void;
  tripType?: "one-way" | "round-trip";
}) {
  const { data: routes, isLoading } = useLocations();

  // Trip-type toggle is local to the popup (only changes which fare is shown).
  // Seed from the parent prop, but always let the buttons drive the display.
  const [localTripType, setLocalTripType] = useState<"one-way" | "round-trip">(
    externalTripType ?? "one-way",
  );
  const [prevExternal, setPrevExternal] = useState(externalTripType);
  if (externalTripType !== prevExternal) {
    setPrevExternal(externalTripType);
    if (externalTripType) setLocalTripType(externalTripType);
  }
  const activeTripType = localTripType;

  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();
  const filteredRoutes = (routes ?? []).filter((route) =>
    query === ""
      ? true
      : `${route.fromLocation} ${route.toLocation}`
          .toLowerCase()
          .includes(query),
  );

  return (
    <>
      <div className="px-8 py-5 border-b border-gray-200 flex flex-col items-center gap-3 max-h-[98vh] overflow-y-auto">
        <h3 className="text-base font-semibold font-sora text-gray-900">
          All Destinations
        </h3>

        {/* Toggle pill */}
        <div className="flex items-center bg-gray-100 rounded-full p-1 gap-1">
          {(["one-way", "round-trip"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setLocalTripType(type)}
              className={[
                "px-4 py-1.5 rounded-full text-xs font-semibold font-poppins transition-all duration-200 cursor-pointer",
                activeTripType === type
                  ? "bg-[#FEA800] text-black shadow-sm"
                  : "text-gray-500 hover:text-gray-700",
              ].join(" ")}
            >
              {type === "one-way" ? "One Way" : "Round Trip"}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search destination (e.g. Kathmandu)"
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-sm font-poppins text-gray-800 outline-none focus:border-[#FEA800]"
          />
        </div>
      </div>

      <div className="flex flex-col max-h-[50vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            Loading destinations...
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            No destinations found.
          </div>
        ) : (
          filteredRoutes.map((route) => {
            const fare =
              activeTripType === "round-trip"
                ? route.roundTripFare
                : route.oneWayFare;

            return (
              <button
                key={route.id}
                onClick={() => {
                  onSelect({
                    from: route.fromLocation,
                    to: route.toLocation,
                    locationId: route.id,
                    oneWayFare: route.oneWayFare,
                    roundTripFare: route.roundTripFare,
                  });
                  onClose();
                }}
                className="flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 w-full"
              >
                {/* From → To */}
                <div className="flex flex-col items-start gap-1 w-1/3">
                  <span className="text-sm font-medium text-gray-800 font-poppins">
                    {route.fromLocation}
                  </span>
                  <ArrowDown size={14} className="text-gray-400 mx-1" />
                  <span className="text-sm font-medium text-gray-800 font-poppins">
                    {route.toLocation}
                  </span>
                </div>

                {/* Total Days */}
                <div className="flex flex-col items-center gap-1">
                  <Clock size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500 font-poppins">
                    {route.totalDays} {route.totalDays === 1 ? "Day" : "Days"}
                  </span>
                </div>

                {/* Fare */}
                <div className="flex flex-col items-end gap-0.5 w-1/3">
                  <span className="text-[11px] text-gray-400 font-poppins">
                    {activeTripType === "round-trip"
                      ? "Round trip fare"
                      : "One way fare"}
                  </span>
                  <span className="text-base font-bold text-gray-900 font-poppins">
                    Rs {fare.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })
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
          onClick={() => {
            onClose();
            onCustomClick();
          }}
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
  onCustomClick,
  onSelect,
  inline = false,
  tripType,
}: DestinationPopupProps) {
  if (!open) return null;

  if (inline) {
    return (
      <DestinationContent
        onClose={onClose}
        onCustomClick={onCustomClick}
        onSelect={onSelect}
        tripType={tripType}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 z-10 overflow-hidden">
        <DestinationContent
          onClose={onClose}
          onCustomClick={() => {}}
          onSelect={onSelect}
          tripType={tripType}
        />
      </div>
    </div>
  );
}
