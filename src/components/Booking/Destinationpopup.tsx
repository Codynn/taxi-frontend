"use client";

import type { Destination } from "@/types/booking.types";
import { Clock, ArrowDown } from "lucide-react";
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
  onSelect: (dest: Destination) => void;
  inline?: boolean;
  tripType?: "one-way" | "round-trip"; // <-- pass in from BookingForm
  /** Search text typed directly into the From/To trigger fields. */
  fromQuery: string;
  toQuery: string;
}

function DestinationContent({
  onClose,
  onSelect,
  tripType: externalTripType,
  fromQuery,
  toQuery,
}: {
  onClose: () => void;
  onSelect: (dest: Destination) => void;
  tripType?: "one-way" | "round-trip";
  fromQuery: string;
  toQuery: string;
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

  const fromQueryNorm = fromQuery.trim().toLowerCase();
  const toQueryNorm = toQuery.trim().toLowerCase();
  const hasQuery = fromQueryNorm !== "" || toQueryNorm !== "";

  // Only show results once the user starts typing in either field. Each
  // field searches the same route list but against its own column, so a
  // user can start their search from either end of the trip.
  const filteredRoutes = !hasQuery
    ? []
    : (routes ?? []).filter((route) => {
        const matchesFrom =
          fromQueryNorm === "" ||
          route.fromLocation.toLowerCase().includes(fromQueryNorm);
        const matchesTo =
          toQueryNorm === "" ||
          route.toLocation.toLowerCase().includes(toQueryNorm);
        return matchesFrom && matchesTo;
      });

  return (
    <>
      <div className="px-8 py-5 border-b border-gray-200 flex flex-col items-center gap-3">
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
      </div>

      <div className="flex flex-col max-h-[50vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            Loading destinations...
          </div>
        ) : !hasQuery ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            Start typing a From or To location to search destinations.
          </div>
        ) : filteredRoutes.length === 0 ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            No destinations found.
          </div>
        ) : (
          filteredRoutes.map((route) => (
            <button
              key={route.id}
              onClick={() => {
                onSelect({
                  from: route.fromLocation,
                  to: route.toLocation,
                  locationId: route.id,
                  oneWayFare: route.oneWayFare,
                  roundTripFare: route.roundTripFare,
                  outsideDistrict: route.outsideDistrict,
                });
                onClose();
              }}
              className="flex items-center justify-between px-8 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 w-full"
            >
              {/* From → To */}
              <div className="flex flex-col items-start gap-1">
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
            </button>
          ))
        )}
      </div>
    </>
  );
}

export default function DestinationPopup({
  open,
  onClose,
  onSelect,
  inline = false,
  tripType,
  fromQuery,
  toQuery,
}: DestinationPopupProps) {
  if (!open) return null;

  if (inline) {
    return (
      <DestinationContent
        onClose={onClose}
        onSelect={onSelect}
        tripType={tripType}
        fromQuery={fromQuery}
        toQuery={toQuery}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 z-10 overflow-hidden">
        <DestinationContent
          onClose={onClose}
          onSelect={onSelect}
          tripType={tripType}
          fromQuery={fromQuery}
          toQuery={toQuery}
        />
      </div>
    </div>
  );
}
