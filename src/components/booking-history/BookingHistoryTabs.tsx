"use client";

import { TripTab } from "@/types/booking.types";

const TRIP_TABS: { value: TripTab; label: string }[] = [
  { value: "long", label: "Long Trip" },
  { value: "short", label: "Short Trip" },
  { value: "custom", label: "Custom Trip" },
];

interface BookingHistoryTabsProps {
  activeTab: TripTab;
  onChange: (v: TripTab) => void;
}

export default function BookingHistoryTabs({
  activeTab,
  onChange,
}: BookingHistoryTabsProps) {
  return (
    <div className="w-full border-b border-gray-200 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-center min-w-max">
        {TRIP_TABS.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={[
                "relative px-6 py-3 text-[14px] font-semibold font-poppins transition-colors duration-200 whitespace-nowrap",
                isActive
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#FEA800] rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
