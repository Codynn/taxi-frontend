import Image from "next/image";
import { REFUND_POLICY_CONTENT } from "@/constants/features/refundPolicy.constants";
import Navbar from "@/components/layout/navbar";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Refund Policy",
  description:
    "Read Popular Ride's refund and cancellation policy. Understand how refunds are processed for cancelled bookings and what conditions apply.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <main>
      <Navbar />

      <section className="py-12 md:py-16 lg:py-20 px-4">
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6 py-10">
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
              {REFUND_POLICY_CONTENT.title}
            </h1>
          </div>

          <p className="mb-8 md:mb-10 text-[16px] text-black font-poppins leading-7">
            {REFUND_POLICY_CONTENT.intro}
          </p>

          <div className="space-y-8 md:space-y-10">
            {REFUND_POLICY_CONTENT.sections.map((section) => (
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
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 text-[16px] font-poppins text-black mb-3">
                    {section.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}

                {section.content?.map((group) => (
                  <div key={group.subtitle} className="mb-3">
                    <p className="text-[16px] font-poppins font-medium text-black">
                      {group.subtitle}
                    </p>
                    <p className="text-[16px] font-poppins text-black leading-7">
                      {group.text}
                    </p>
                  </div>
                ))}

                {section.footer && (
                  <p className="mt-2 text-[16px] font-poppins text-black leading-7">
                    {section.footer}
                  </p>
                )}

                {section.footerItems && (
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 text-[16px] font-poppins text-black mt-2">
                    {section.footerItems.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
