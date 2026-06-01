import Image from "next/image";
import type { VehicleFeature } from "@/types/features/vehicle.types";

export default function VehicleFeatureBadge({ icon, label }: VehicleFeature) {
  return (
    <div className="flex items-center gap-1.5">
      <Image
        src={`/${icon}`}
        alt={label}
        width={16}
        height={16}
        className="shrink-0 opacity-70"
      />
      <span className="text-[12px] text-[#000000]/70 font-poppins">
        {label}
      </span>
    </div>
  );
}
