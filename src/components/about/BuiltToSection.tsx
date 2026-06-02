import Image from "next/image";
import { WHY_CHOOSE_US_FEATURES } from "@/constants/features/whyChooseUs.constants";
import FeatureItem from "../why-choose-us/FeatureItem";

export default function BuiltToSection() {
  const [topRow, bottomRow] = [
    WHY_CHOOSE_US_FEATURES.slice(0, 2),
    WHY_CHOOSE_US_FEATURES.slice(2, 4),
  ];

  return (
    <section className="bg-[#FAFAFA] overflow-hidden">
      <div className="max-w-7xl mx-auto pl-4 lg:pl-0 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="hidden lg:flex items-center gap-12">
          <div className="w-1/2 shrink-0 grid grid-cols-2">
            {[topRow, bottomRow].map((row, ri) =>
              row.map((feature, fi) => {
                const isLastRow = ri === 1;
                const isRight = fi === 1;
                return (
                  <div
                    key={feature.id}
                    className={[
                      "border-gray-300/50",
                      !isLastRow ? "border-b" : "",
                      !isRight ? "border-r" : "",
                    ].join(" ")}
                  >
                    <FeatureItem {...feature} />
                  </div>
                );
              }),
            )}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <h2 className="text-[48px] font-semibold font-sora text-gray-900 leading-tight">
              <span className="relative inline-block mr-2">
                <div className="absolute left-1/5 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[100px] z-0">
                  <Image
                    src="/about/rectangle.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>

                <span className="relative z-10">Built to</span>
              </span>{" "}
              Make Every Journey Easier and{" "}
              <span className="relative inline-block">
                <span className="relative z-10">More Convenient</span>

                <div className="absolute left-1/7 top-1/2 -translate-x-1/2 -translate-y-1/2 w-120 h-20 z-0">
                  <Image
                    src="/about/rectangle.svg"
                    alt=""
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </span>
            </h2>
            <p className="mt-6 text-[16px] text-[#000000] font-poppins leading-relaxed">
              We focus on creating a smooth travel experience by helping users
              quickly find the right ride for their journey. With route-based
              search, multiple vehicle options, and an easy booking process,
              travelers can plan trips with confidence and convenience.
            </p>
            <p className="mt-4 text-[16px] text-gray-500 font-poppins leading-relaxed">
              Whether it&apos;s a short city ride or a long-distance journey,
              our platform is designed to make travel planning simpler, faster,
              and more reliable.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:hidden">
          <div className="mb-8">
            <h2 className="text-[36px]  font-semibold font-sora text-[#000000] leading-tight">
              <span className="relative inline-block mr-1">
                <div className="absolute left-1/5 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[100px] z-0">
                  <Image
                    src="/about/rectangle.svg"
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="relative z-10">Built to</span>
              </span>{" "}
              Make Every Journey Easier and{" "}
              <span className="relative inline-block">
                <span className="relative z-10">More Convenient</span>
                <div className="absolute left-1/7 top-1/2 -translate-x-1/2 -translate-y-1/2 w-90 h-10 z-0">
                  <Image
                    src="/about/rectangle.svg"
                    alt=""
                    fill
                    priority
                    className="object-cover"
                  />
                </div>
              </span>
            </h2>
            <p className="mt-4 text-[16px] text-[#000000] font-poppins leading-relaxed">
              We focus on creating a smooth travel experience by helping users
              quickly find the right ride for their journey. With route-based
              search, multiple vehicle options, and an easy booking process,
              travelers can plan trips with confidence and convenience.
            </p>
            <p className="mt-3 text-[16px] text-[#000000] font-poppins leading-relaxed">
              Whether it&apos;s a short city ride or a long-distance journey,
              our platform is designed to make travel planning simpler, faster,
              and more reliable.
            </p>
          </div>

          <div className="flex flex-col divide-y divide-gray-300/50">
            {WHY_CHOOSE_US_FEATURES.map((feature) => (
              <FeatureItem key={feature.id} {...feature} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative w-full lg:h-[800px] md:h-[560px] h-[300px]">
        <Image
          src="/about/trusting.svg"
          alt="Driven by Trust"
          fill
          className="object-cover object-center hidden lg:block"
          priority
        />
        <Image
          src="/about/trustingmobile.svg"
          alt="Driven by Trust"
          fill
          className="object-contain lg:hidden"
          priority
        />
      </div>
    </section>
  );
}
