"use client";

import {
  OUR_STORY_CONTENT,
  STORY_STATS,
} from "@/constants/features/about.constants";
import Image from "next/image";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { usePublicWebsiteData } from "@/hooks/useWebsiteData";
import { Stat } from "@/types/website.types";

function usePublicStats() {
  return useQuery({
    queryKey: ["cms-stats"],
    staleTime: 1000 * 60 * 5,
    queryFn: async () => {
      const res = await api.get<{ success: boolean; data: Stat[] }>(
        "/cms/stats",
      );
      return res.data.data;
    },
  });
}

export default function OurStory() {
  const { data: websiteData } = usePublicWebsiteData();
  const { data: cmsStats } = usePublicStats();

  const description = websiteData?.aboutPageOurStoryDescription?.trim() || null;

  const stats =
    cmsStats && cmsStats.length > 0
      ? cmsStats.map((s) => ({ value: s.stat, label: s.statLabel }))
      : STORY_STATS;

  const paragraphs = description
    ? description.split("\n").filter(Boolean)
    : OUR_STORY_CONTENT.paragraphs;

  return (
    <section className="lg:pt-50 pt-80 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 z-10 relative">
        <div className="max-w-4xl mx-auto relative">
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={245}
            height={150}
            className="absolute left-1/2 top-1/8 lg:top-1/6 -translate-x-1/2 -translate-y-1/2 z-0 w-[245px] h-auto"
          />

          <h2 className="relative z-10 text-[48px] font-semibold font-sora text-center text-[#000000]">
            Our<span className="px-2">Story</span>
          </h2>

          {paragraphs.map((paragraph, index) => (
            <p
              key={index}
              className="mt-4 text-sm md:text-[16px] text-center text-[#000000]/65 font-poppins max-w-3xl mx-auto leading-relaxed"
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-14 pt-20 lg:pt-8 max-w-7xl mx-auto w-full flex flex-col items-center gap-10 lg:gap-20 lg:flex-row justify-center">
          <Image
            src="/about/background.svg"
            alt=""
            width={1200}
            height={400}
            className="absolute left-1/2 -bottom-50 -translate-x-1/2 -translate-y-1/2 -z-10 lg:block hidden"
          />

          <Image
            src="/home/backgroundmobile.svg"
            alt=""
            width={300}
            height={800}
            className="absolute left-1/2 top-[70%] -translate-x-1/2 -translate-y-1/2 -z-10 block lg:hidden"
          />

          {stats.map((stat, index) => (
            <div key={index} className="mt-10 flex flex-col items-center gap-2">
              <div className="relative inline-flex items-center justify-center">
                <div className="absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[100px] z-0">
                  <Image
                    src="/about/rectangle.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="relative z-10 text-[42px] font-semibold font-sora text-[#000000]">
                  {stat.value}
                </span>
              </div>
              <p className="text-[16px] font-medium font-poppins text-[#000000] text-center">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
