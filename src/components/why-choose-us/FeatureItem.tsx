import Image from "next/image";
import type { WhyChooseUsFeature } from "@/types/features/whyChooseUs.types";

export default function FeatureItem({
  icon,
  title,
  description,
}: WhyChooseUsFeature) {
  return (
    <div className="flex flex-col items-center text-center px-4 py-7 gap-2">
      <div className="w-16 h-16 rounded-full  flex items-center justify-center shrink-0">
        <Image src={`/${icon}`} alt={title} width={38} height={38} />
      </div>
      <h3 className="text-[17px] font-semibold text-gray-900 font-sora">
        {title}
      </h3>
      <p className="text-[13px] text-gray-500 font-sora leading-relaxed max-w-[220px]">
        {description}
      </p>
    </div>
  );
}
