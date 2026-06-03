"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { FILTER_OPTIONS } from "@/constants/features/vehicle.constants";

interface FilterPanelProps {
  onApply?: (filters: unknown) => void;
  onReset?: () => void;
  hideHeader?: boolean;
}

const FilterGroup = ({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: { label: string; count: number }[];
  selected: string[];
  onToggle: (v: string) => void;
}) => (
  <div className="flex flex-col gap-2.5">
    <h4 className="text-[13px] font-semibold font-poppins text-black">
      {title}
    </h4>
    {options.map((opt) => (
      <div key={opt.label} className="flex items-center gap-2">
        <Checkbox
          id={`${title}-${opt.label}`}
          checked={selected.includes(opt.label)}
          onCheckedChange={() => onToggle(opt.label)}
          className="w-4 h-4 rounded-sm border-gray-300
              data-[state=checked]:bg-[#FEA800]
              data-[state=checked]:border-[#FEA800]"
          style={
            selected.includes(opt.label)
              ? {
                  backgroundColor: "#FEA800",
                  borderColor: "#FEA800",
                  color: "white",
                }
              : {}
          }
        />
        <Label
          htmlFor={`${title}-${opt.label}`}
          className="text-[13px] font-poppins text-black/80 cursor-pointer"
        >
          {opt.label} ({opt.count})
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
  const [vehicleTypes, setVehicleTypes] = useState<string[]>(["All"]);
  const [gearTypes, setGearTypes] = useState<string[]>(["All"]);
  const [fuelTypes, setFuelTypes] = useState<string[]>(["All"]);
  const [priceRange, setPriceRange] = useState<[number, number]>([
    FILTER_OPTIONS.priceRange.defaultMin,
    FILTER_OPTIONS.priceRange.defaultMax,
  ]);

  const toggle = (
    value: string,
    current: string[],
    set: (v: string[]) => void,
  ) => {
    if (value === "All") {
      set(["All"]);
      return;
    }
    const without = current.filter((v) => v !== "All");
    if (without.includes(value)) {
      const next = without.filter((v) => v !== value);
      set(next.length === 0 ? ["All"] : next);
    } else {
      set([...without, value]);
    }
  };

  const handleReset = () => {
    setVehicleTypes(["All"]);
    setGearTypes(["All"]);
    setFuelTypes(["All"]);
    setPriceRange([
      FILTER_OPTIONS.priceRange.defaultMin,
      FILTER_OPTIONS.priceRange.defaultMax,
    ]);
    onReset?.();
  };

  const handleApply = () => {
    onApply?.({ vehicleTypes, gearTypes, fuelTypes, priceRange });
  };

  return (
    <div
      className={[
        "flex flex-col lg:gap-6 gap-2 bg-white w-full",
        hideHeader ? "" : "p-5 rounded-2xl border border-gray-200",
      ].join(" ")}
    >
      {/* Header — hidden when inside the Sheet (Sheet has its own header) */}
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
        title="Vehicle Types"
        options={FILTER_OPTIONS.vehicleTypes}
        selected={vehicleTypes}
        onToggle={(v) => toggle(v, vehicleTypes, setVehicleTypes)}
      />

      <FilterGroup
        title="Gear Types"
        options={FILTER_OPTIONS.gearTypes}
        selected={gearTypes}
        onToggle={(v) => toggle(v, gearTypes, setGearTypes)}
      />

      <FilterGroup
        title="Fuel Types"
        options={FILTER_OPTIONS.fuelTypes}
        selected={fuelTypes}
        onToggle={(v) => toggle(v, fuelTypes, setFuelTypes)}
      />

      {/* Price Range */}
      <div className="flex flex-col gap-3">
        <h4 className="text-[13px] font-semibold font-poppins text-black">
          Price Range
        </h4>
        <Slider
          min={FILTER_OPTIONS.priceRange.min}
          max={FILTER_OPTIONS.priceRange.max}
          step={10}
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

      {/* Actions */}
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
