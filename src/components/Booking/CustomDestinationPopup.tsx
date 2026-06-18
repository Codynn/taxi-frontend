"use client";

import { useState, useMemo } from "react";
import { Search, MapPin, ArrowUpDown, X } from "lucide-react";
import { CUSTOM_TRIP_DESTINATIONS } from "@/constants/booking.constants";

interface CustomDestination {
  from: string;
  to: string;
}

interface CustomDestinationPopupProps {
  open: boolean;
  onClose: () => void;
  onSelect: (dest: CustomDestination) => void;
  inline?: boolean;
}

export default function CustomDestinationPopup({
  open,
  onClose,
  onSelect,
}: CustomDestinationPopupProps) {
  const [activeField, setActiveField] = useState<"from" | "to">("from");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return CUSTOM_TRIP_DESTINATIONS;
    return CUSTOM_TRIP_DESTINATIONS.filter((d) =>
      d.name.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  if (!open) return null;

  const handlePick = (name: string) => {
    if (activeField === "from") {
      setFrom(name);
      setQuery("");
      setActiveField("to");
    } else {
      setTo(name);
      setQuery("");
    }
  };

  const sameLocation = !!from && !!to && from === to;
  const canConfirm = from.trim() && to.trim() && !sameLocation;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onSelect({ from, to });
    onClose();
  };

  return (
    <div className="p-4 flex flex-col gap-3 max-h-[480px]">
      <div className="flex flex-col gap-2">
        <button
          onClick={() => setActiveField("from")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
            activeField === "from"
              ? "border-[#FEA800] bg-[#FEA800]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MapPin size={16} className="text-[#FEA800] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-poppins">From</p>
            <p className="text-sm font-medium text-gray-800 font-poppins truncate">
              {from || "Select pickup location"}
            </p>
          </div>
        </button>

        <div className="flex justify-center -my-1">
          <button
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            className="w-7 h-7 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm hover:bg-gray-50"
          >
            <ArrowUpDown size={13} className="text-[#FEA800]" />
          </button>
        </div>

        <button
          onClick={() => setActiveField("to")}
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left transition-colors ${
            activeField === "to"
              ? "border-[#FEA800] bg-[#FEA800]/5"
              : "border-gray-200 hover:bg-gray-50"
          }`}
        >
          <MapPin size={16} className="text-[#FEA800] shrink-0" />
          <div className="min-w-0">
            <p className="text-xs text-gray-400 font-poppins">To</p>
            <p className="text-sm font-medium text-gray-800 font-poppins truncate">
              {to || "Select drop location"}
            </p>
          </div>
        </button>
      </div>

      {sameLocation && (
        <p className="text-xs text-red-500 font-poppins">
          Pickup and drop location cannot be the same
        </p>
      )}

      <div className="relative">
        <Search
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${activeField === "from" ? "pickup" : "drop"} location`}
          className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-gray-200 text-sm font-poppins outline-none focus:border-[#FEA800] transition-colors"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col gap-1 min-h-[180px]">
        {filtered.length === 0 ? (
          <p className="text-sm text-gray-400 font-poppins text-center py-6">
            No destinations found
          </p>
        ) : (
          filtered.map((d) => (
            <button
              key={d.id}
              onClick={() => handlePick(d.name)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-left transition-colors"
            >
              <MapPin size={14} className="text-gray-400 shrink-0" />
              <span className="text-sm font-poppins text-gray-700">
                {d.name}
              </span>
            </button>
          ))
        )}
      </div>

      <button
        onClick={handleConfirm}
        disabled={!canConfirm}
        className="w-full bg-[#FEA800] text-black font-semibold text-sm font-poppins py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Confirm
      </button>
    </div>
  );
}
