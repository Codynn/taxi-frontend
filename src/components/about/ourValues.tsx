"use client";

import { OUR_VALUES } from "@/constants/features/about.constants";
import { usePublicValues } from "@/hooks/useWebsiteData";
import Image from "next/image";

export default function OurValues() {
  const { data: cmsValues } = usePublicValues();

  const values =
    cmsValues && cmsValues.length > 0
      ? cmsValues.map((v) => ({
          id: v.id,
          icon: v.icon,
          title: v.title,
          description: v.description,
        }))
      : OUR_VALUES;

  return (
    <section className="lg:pt-50 pt-80 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-4xl mx-auto relative">
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={245}
            height={150}
            className="absolute left-1/2 top-1/4 lg:top-1/3 -translate-x-1/2 -translate-y-1/2 z-0"
          />

          <h2 className="relative z-10 text-[48px] font-semibold font-sora text-center text-black">
            Our<span className="px-2">Values</span>
          </h2>

          <p className="mt-4 text-[18px] text-center text-black/65 font-poppins max-w-3xl mx-auto">
            Built on trust, comfort, reliability, and better travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 mt-16">
          {values.map((item, index) => (
            <div
              key={item.id}
              className={`p-8 ${
                index !== values.length - 1
                  ? "lg:border-r border-[#C3C3C3]"
                  : ""
              }`}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6">
                {item.icon.startsWith("http") || item.icon.startsWith("/") ? (
                  <Image
                    src={
                      item.icon.startsWith("http") ? item.icon : `/${item.icon}`
                    }
                    alt={item.title}
                    width={52}
                    height={52}
                  />
                ) : (
                  <span className="text-[40px] leading-none">{item.icon}</span>
                )}
              </div>

              <h3 className="text-[20px] font-semibold font-sora text-black mb-3">
                {item.title}
              </h3>

              <p className="text-black text-[16px] font-poppins leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
