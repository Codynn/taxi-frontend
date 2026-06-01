"use client";

import Image from "next/image";
import type {
  VehicleCategory,
  VehicleTab,
} from "@/types/features/vehicle.types";

interface VehicleTabsProps {
  tabs: VehicleTab[];
  active: VehicleCategory;
  onChange: (v: VehicleCategory) => void;
}

export default function VehicleTabs({
  tabs,
  active,
  onChange,
}: VehicleTabsProps) {
  return (
    <div className="w-full border-b border-gray-200 overflow-x-auto scrollbar-none">
      <div className="flex items-center justify-center min-w-max">
        {tabs.map((tab) => {
          const isActive = active === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => onChange(tab.value)}
              className={[
                "relative flex items-center gap-2 px-6 py-3 text-sm font-semibold font-poppins transition-colors duration-200 whitespace-nowrap",
                isActive
                  ? "text-gray-900"
                  : "text-gray-400 hover:text-gray-600",
              ].join(" ")}
            >
              <Image
                src={`/${tab.icon}`}
                alt={tab.label}
                width={18}
                height={18}
                className={isActive ? "opacity-100" : "opacity-40"}
              />
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
