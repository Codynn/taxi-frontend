import Image from "next/image";
import {
  JOURNEY_STEPS,
  HOW_IT_WORKS_CONTENT,
} from "@/constants/journey.constants";
import type { JourneyStep } from "@/types/journey.types";

function StepCard({ step }: { step: JourneyStep }) {
  return (
    <div className="relative flex flex-col  gap-3 p-1 bg-[#ffffff] rounded-2xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Image src={step.icon} alt={step.title} width={48} height={48} />

        <span className="text-[4rem] font-medium text-[#F5F5F5] font-sora leading-none">
          {step.step}
        </span>
      </div>

      <div className="z-10">
        <h3 className="text-[20px] font-semibold text-[#000000] font-sora">
          {step.title}
        </h3>
        <p className="mt-1 text-[14px] text-[#000000] font-poppins leading-relaxed">
          {step.description}
        </p>
      </div>
    </div>
  );
}

export default function HowItWorksSection() {
  const { heading, highlightedWord, description, driverImage, driverImageAlt } =
    HOW_IT_WORKS_CONTENT;

  const [before, after] = heading.split(highlightedWord);

  return (
    <section className="bg-[#FEA800]/10 lg:pt-50 pt-80 pb-0">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center pt-6">
          <h2 className="text-3xl md:text-[48px] font-semibold font-sora text-[#000000] ">
            {before}
            <span className="bg-[#FEA800] px-2 rounded-sm">
              {highlightedWord}
            </span>
            {after}
          </h2>
          <p className="mt-4 text-sm md:text-[16px] text-[#000000]/65 font-poppins max-w-4xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
          {JOURNEY_STEPS.map((step) => (
            <StepCard key={step.id} step={step} />
          ))}
        </div>
      </div>

      <div className="mt-14 w-full">
        <Image
          src={driverImage}
          alt={driverImageAlt}
          width={1920}
          height={700}
          className="w-full h-[300px] sm:h-[450px] lg:h-[560px] object-cover object-center"
          priority
        />
      </div>
    </section>
  );
}
