import Image from "next/image";
import {
  WHY_CHOOSE_US_CONTENT,
  WHY_CHOOSE_US_FEATURES,
} from "@/constants/features/whyChooseUs.constants";
import FeatureItem from "../why-choose-us/FeatureItem";

export default function WhyChooseUsSection() {
  const { heading, highlightedWord, description, image, imageAlt } =
    WHY_CHOOSE_US_CONTENT;

  const [topRow, bottomRow] = [
    WHY_CHOOSE_US_FEATURES.slice(0, 2),
    WHY_CHOOSE_US_FEATURES.slice(2, 4),
  ];

  return (
    <section className="bg-white py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative text-center pt-10">
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={420}
            height={50}
            className="absolute top-10 left-[58%] -translate-x-1/2 z-0 lg:block hidden"
            aria-hidden
          />
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={200}
            height={150}
            className="absolute top-10 left-[34%] z-0 lg:hidden md:hidden block"
            aria-hidden
          />
          <Image
            src="/about/rectangle.svg"
            alt=""
            width={300}
            height={150}
            className="absolute top-10 left-[38%] z-0 lg:hidden hidden sm:block"
            aria-hidden
          />
          <h2 className="relative z-10 mt-2 text-[20px] md:text-[32px] lg:text-[48px] font-semibold font-sora text-[#000000]">
            {heading} <span className="px-2 rounded-sm">{highlightedWord}</span>
          </h2>
        </div>
        <p className="mt-4 text-sm md:text-base text-gray-500 font-poppins max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>

        {/* Desktop */}
        <div className="hidden lg:block relative">
          {/* SVG bg — covers only the right portion, full height of feature grid */}
          <div className="absolute right-0 top-0 bottom-0 left-[25%]  rounded-3xl overflow-hidden -z-0">
            <Image
              src="/home/background.svg"
              alt=""
              fill
              className="object-fill"
              priority
            />
          </div>

          <div className="relative flex items-center">
            {/* Photo — overlaps the SVG from the left */}
            <div
              className="w-[42%]  shrink-0 relative z-10 rounded-3xl overflow-hidden"
              style={{ height: "420px" }}
            >
              <Image
                src={`/${image}`}
                alt={imageAlt}
                fill
                className="object-cover object-center"
                priority
              />
            </div>

            <div className="flex-1 z-10 grid grid-cols-2 py-6">
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
          </div>
        </div>

        {/* Mobile */}
        <div className="flex flex-col gap-0 lg:hidden">
          <div className="relative w-full h-[320px] rounded-2xl overflow-hidden mb-6">
            <Image
              src={`/${image}`}
              alt={imageAlt}
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="relative" style={{ minHeight: 800 }}>
            <Image
              src="/home/backgroundmobile.svg"
              alt="background"
              fill
              className="object-fill"
            />
            <div className="relative z-10 flex flex-col">
              {WHY_CHOOSE_US_FEATURES.map((feature) => (
                <FeatureItem key={feature.id} {...feature} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
