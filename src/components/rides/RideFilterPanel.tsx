"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export interface AppliedFilters {
  gearTypes: string[];
  fuelTypes: string[];
  priceRange: [number, number];
  hasAC?: boolean;
}

interface FilterPanelProps {
  onApply?: (filters: AppliedFilters) => void;
  onReset?: () => void;
  hideHeader?: boolean;
}

const GEAR_TYPES = ["Automatic", "Manual"];
const FUEL_TYPES = ["Petrol", "Diesel", "Electric"];
const PRICE_MIN = 0;
const PRICE_MAX = 10000;

const FilterGroup = ({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (v: string) => void;
}) => (
  <div className="flex flex-col gap-2.5">
    <h4 className="text-[13px] font-semibold font-poppins text-black">
      {title}
    </h4>
    {["All", ...options].map((opt) => (
      <div key={opt} className="flex items-center gap-2">
        <Checkbox
          id={`${title}-${opt}`}
          checked={
            opt === "All" ? selected.length === 0 : selected.includes(opt)
          }
          onCheckedChange={() => onToggle(opt)}
          className="w-4 h-4 rounded-sm border-gray-300
            data-[state=checked]:bg-[#FEA800]
            data-[state=checked]:border-[#FEA800]"
          style={
            (opt === "All" ? selected.length === 0 : selected.includes(opt))
              ? {
                  backgroundColor: "#FEA800",
                  borderColor: "#FEA800",
                  color: "white",
                }
              : {}
          }
        />
        <Label
          htmlFor={`${title}-${opt}`}
          className="text-[13px] font-poppins text-black/80 cursor-pointer"
        >
          {opt}
        </Label>
      </div>
    ))}
  </div>
);

export default function RideFilterPanel({
  onApply,
  onReset,
  hideHeader = false,
}: FilterPanelProps) {
  const [gearTypes, setGearTypes] = useState<string[]>([]);
  const [fuelTypes, setFuelTypes] = useState<string[]>([]);
  const [hasAC, setHasAC] = useState<boolean | undefined>(undefined);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    PRICE_MIN,
    PRICE_MAX,
  ]);

  const toggle = (
    value: string,
    current: string[],
    set: (v: string[]) => void,
  ) => {
    if (value === "All") {
      set([]);
      return;
    }
    set(
      current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value],
    );
  };

  const handleReset = () => {
    setGearTypes([]);
    setFuelTypes([]);
    setHasAC(undefined);
    setPriceRange([PRICE_MIN, PRICE_MAX]);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.({ gearTypes, fuelTypes, priceRange, hasAC });
  };

  return (
    <div
      className={[
        "flex flex-col lg:gap-6 gap-4 bg-white w-full",
        hideHeader ? "" : "p-5 rounded-2xl border border-gray-200",
      ].join(" ")}
    >
      {!hideHeader && (
        <div className="flex items-center justify-between">
          <h3 className="text-[15px] font-semibold font-poppins text-black">
            Filters
          </h3>
          <button
            onClick={handleReset}
            className="text-[13px] text-[#FEA800] font-poppins font-medium hover:underline"
          >
            Clear All
          </button>
        </div>
      )}

      <FilterGroup
        title="Gear Types"
        options={GEAR_TYPES}
        selected={gearTypes}
        onToggle={(v) => toggle(v, gearTypes, setGearTypes)}
      />

      <FilterGroup
        title="Fuel Types"
        options={FUEL_TYPES}
        selected={fuelTypes}
        onToggle={(v) => toggle(v, fuelTypes, setFuelTypes)}
      />

      {/* AC Filter */}
      <div className="flex flex-col gap-2.5">
        <h4 className="text-[13px] font-semibold font-poppins text-black">
          Air Conditioning
        </h4>
        {[
          { label: "All", value: undefined },
          { label: "With AC", value: true },
          { label: "Without AC", value: false },
        ].map((opt) => (
          <div key={opt.label} className="flex items-center gap-2">
            <Checkbox
              id={`ac-${opt.label}`}
              checked={hasAC === opt.value}
              onCheckedChange={() => setHasAC(opt.value)}
              className="w-4 h-4 rounded-sm border-gray-300
                data-[state=checked]:bg-[#FEA800]
                data-[state=checked]:border-[#FEA800]"
              style={
                hasAC === opt.value
                  ? {
                      backgroundColor: "#FEA800",
                      borderColor: "#FEA800",
                      color: "white",
                    }
                  : {}
              }
            />
            <Label
              htmlFor={`ac-${opt.label}`}
              className="text-[13px] font-poppins text-black/80 cursor-pointer"
            >
              {opt.label}
            </Label>
          </div>
        ))}
      </div>

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[13px] font-semibold font-poppins text-black">
          Price Range
        </h4>
        <Slider
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={50}
          value={priceRange}
          onValueChange={(v) => setPriceRange(v as [number, number])}
          className="
            [&_[role=slider]]:bg-[#FEA800]
            [&_[role=slider]]:border-[#FEA800]
            [&_[role=slider]]:shadow-none
            [&_.absolute]:bg-[#FEA800]
          "
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 flex-1">
            <span className="text-[12px] text-gray-500 font-poppins">Rs</span>
            <span className="text-[13px] font-poppins font-medium">
              {priceRange[0]}
            </span>
          </div>
          <span className="text-[12px] text-gray-500 font-poppins">To</span>
          <div className="flex items-center gap-1 border border-gray-200 rounded-lg px-3 py-1.5 flex-1">
            <span className="text-[12px] text-gray-500 font-poppins">Rs</span>
            <span className="text-[13px] font-poppins font-medium">
              {priceRange[1]}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-1">
        <button
          onClick={handleReset}
          className="flex-1 border border-gray-300 text-black text-[13px] font-poppins font-medium py-2.5 rounded-full hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApply}
          className="flex-1 bg-[#FEA800] text-white text-[13px] font-poppins font-medium py-2.5 rounded-full hover:bg-[#e09700] transition-colors"
        >
          Apply Filter
        </button>
      </div>
    </div>
  );
}
