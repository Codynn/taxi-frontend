import Image from "next/image";
import { TERMS_AND_CONDITIONS_CONTENT } from "@/constants/features/termsAndConditions.constants";
import Navbar from "@/components/layout/navbar";

export default function TermsAndConditionsPage() {
  return (
    <main>
      <Navbar />

      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6 py-10">
          {/* Title with rectangle.svg highlight on "Terms" */}
          <div className="relative mb-8 md:mb-10">
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={310}
              height={150}
              className="mt-8 absolute -top-8 -left-32 z-0 hidden lg:block"
            />
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={250}
              height={150}
              className="mt-8 absolute -top-8 -left-25 z-0 block md:hidden lg:hidden"
            />
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={250}
              height={150}
              className="mt-8 absolute -top-8 -left-25 z-0 hidden md:block lg:hidden"
            />

            <h1 className="relative z-10 text-[38px] lg:text-[48px] font-semibold font-sora leading-tight">
              {TERMS_AND_CONDITIONS_CONTENT.title}
            </h1>
          </div>

          <p className="mb-8 md:mb-10 text-[16px] text-black font-poppins leading-7">
            {TERMS_AND_CONDITIONS_CONTENT.intro}
          </p>

          <div className="space-y-8 md:space-y-10">
            {TERMS_AND_CONDITIONS_CONTENT.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-[16px] font-poppins font-semibold mb-3 md:mb-4">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="mb-4 text-[16px] font-poppins text-black leading-7">
                    {section.description}
                  </p>
                )}

                {section.items && (
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 text-[16px] font-poppins text-black">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.footer && (
                  <p className="mt-3 text-[16px] font-poppins text-black leading-7">
                    {section.footer}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
