"use client";

import type { Destination } from "@/types/booking.types";
import { Clock, Map, MapPin, Search } from "lucide-react";
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
  /** Which single field this dialog is picking — the trip type is already
   * chosen outside, so only one of From/To is shown at a time. */
  activeField: "from" | "to";
  /** Sets just the From location (no route/fare picked yet). Used in "from" mode. */
  onSelectFrom: (from: string) => void;
  /** The already-chosen From, used to scope the "to" list to routes that
   * actually start there. */
  currentFrom?: string;
  inline?: boolean;
}

function DestinationContent({
  onClose,
  onSelect,
  onSelectFrom,
  activeField,
  currentFrom,
}: {
  onClose: () => void;
  onSelect: (dest: Destination) => void;
  onSelectFrom: (from: string) => void;
  activeField: "from" | "to";
  currentFrom?: string;
}) {
  const { data: routes, isLoading } = useLocations();

  const [search, setSearch] = useState("");
  const query = search.trim().toLowerCase();

  const fromOptions = Array.from(
    new Set((routes ?? []).map((r) => r.fromLocation)),
  )
    .filter((from) => query === "" || from.toLowerCase().includes(query))
    .sort((a, b) => a.localeCompare(b));

  const toRoutes = (routes ?? []).filter((route) => {
    const matchesFrom = !currentFrom || route.fromLocation === currentFrom;
    const matchesTo =
      query === "" || route.toLocation.toLowerCase().includes(query);
    return matchesFrom && matchesTo;
  });

  return (
    <>
      <div className="px-8 py-5 border-b border-gray-200 flex flex-col items-center gap-3 max-h-[500px] overflow-y-scroll">
        <h3 className="text-base font-semibold font-sora text-gray-900">
          {activeField === "from"
            ? "Select Pickup Location"
            : "Select Drop Location"}
        </h3>

        <div className="relative w-full">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            autoFocus
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              activeField === "from"
                ? "From (e.g. Tulsipur)"
                : "To (e.g. Kathmandu)"
            }
            // iOS Safari auto-zooms the page when focusing an input whose
            // font-size is under 16px — text-[16px] avoids that.
            className="w-full rounded-full border border-gray-200 bg-gray-50 py-2 pl-9 pr-4 text-[16px] font-poppins text-gray-800 outline-none focus:border-[#FEA800]"
          />
        </div>
      </div>

      <div className="flex flex-col max-h-[50vh] overflow-y-auto">
        {isLoading ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            Loading destinations...
          </div>
        ) : activeField === "from" ? (
          fromOptions.length === 0 ? (
            <div className="py-8 text-center text-sm font-poppins text-gray-400">
              No locations found.
            </div>
          ) : (
            fromOptions.map((from) => (
              <button
                key={from}
                onClick={() => {
                  onSelectFrom(from);
                  onClose();
                }}
                className="flex items-center px-8 py-4 hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 w-full text-left"
              >
                <span className="text-xl md:text-sm font-medium text-gray-800 font-poppins flex flex-row items-center gap-2">
                  <MapPin color="orange" /> {from}
                </span>
              </button>
            ))
          )
        ) : toRoutes.length === 0 ? (
          <div className="py-8 text-center text-sm font-poppins text-gray-400">
            No destinations found.
          </div>
        ) : (
          toRoutes.map((route) => (
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
              <span className="text-xl md:text-sm font-medium text-gray-800 font-poppins flex flex-row items-center gap-2">
                <MapPin color="orange" /> {route.toLocation}
              </span>

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
  onSelectFrom,
  activeField,
  currentFrom,
  inline = false,
}: DestinationPopupProps) {
  if (!open) return null;

  if (inline) {
    return (
      <DestinationContent
        onClose={onClose}
        onSelect={onSelect}
        onSelectFrom={onSelectFrom}
        activeField={activeField}
        currentFrom={currentFrom}
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
          onSelectFrom={onSelectFrom}
          activeField={activeField}
          currentFrom={currentFrom}
        />
      </div>
    </div>
  );
}
