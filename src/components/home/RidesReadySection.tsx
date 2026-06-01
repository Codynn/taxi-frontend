"use client";

import { useState } from "react";
import {
  VEHICLES,
  VEHICLE_TABS,
  RIDES_READY_CONTENT,
} from "@/constants/features/vehicle.constants";
import type { VehicleCategory } from "@/types/features/vehicle.types";
import VehicleTabs from "../vehicles/VehicleTabs";
import VehicleCard from "../vehicles/VehicleCard";

export default function RidesReadySection() {
  const [activeTab, setActiveTab] = useState<VehicleCategory>("cars");

  const { heading, highlightedWord, description, browseAllLabel } =
    RIDES_READY_CONTENT;

  const filtered = VEHICLES.filter((v) => v.category === activeTab);

  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-[48px] font-semibold font-sora text-gray-900 leading-tight">
            {heading}{" "}
            <span className="bg-[#FEA800] px-2 rounded-sm">
              {highlightedWord}
            </span>
          </h2>
          <p className="mt-3 text-sm md:text-base text-gray-500 font-poppins max-w-xl mx-auto">
            {description}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <VehicleTabs
            tabs={VEHICLE_TABS}
            active={activeTab}
            onChange={setActiveTab}
          />
        </div>

        {/* Cards grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filtered.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 font-poppins text-sm">
            No vehicles available in this category yet.
          </div>
        )}

        {/* Browse All */}
        <div className="flex justify-center mt-10">
          <button className="border border-[#FEA800] text-[#FEA800] text-[16px] font-semibold font-poppins px-8 py-2.5 rounded-full hover:bg-[#FEA800]/10 transition-colors">
            {browseAllLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
