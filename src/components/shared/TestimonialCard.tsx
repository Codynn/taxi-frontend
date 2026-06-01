import type { Testimonial } from "@/types/features/voices.types";
import { Quote, Star } from "lucide-react";
import Image from "next/image";

interface Props {
  testimonial: Testimonial;
}

export default function TestimonialCard({ testimonial }: Props) {
  const { review, name, rating } = testimonial;

  return (
    <div className="bg-[#F5F5F5] rounded-2xl p-5 sm:p-6 lg:p-7 xl:p-8 2xl:p-10 flex flex-col h-full min-h-70">
      <div className="mb-3 sm:mb-4 lg:mb-5 shrink-0">
        <Image src="/home/quote.svg" alt="" width={48} height={48} />
      </div>

      {/* Review */}
      <p
        className="
          text-gray-700 font-montserrat text-[16px] leading-relaxed flex-1
        "
      >
        {review}
      </p>

      {/* Name + Stars */}
      <div className="flex flex-col gap-1 mt-5 sm:mt-6 lg:mt-7 shrink-0">
        <span
          className="
            text-gray-900 font-montserrat font-semibold
            text-[16px]
          "
        >
          {name}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`
                ${i < rating ? "fill-[#FEA800] text-[#FEA800]" : "fill-[#C3C3C3] text-[#C3C3C3]"}
                w-3.5 h-3.5
                sm:w-4 sm:h-4
                lg:w-4 lg:h-4
                xl:w-5 xl:h-5
                2xl:w-6 2xl:h-6
              `}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
