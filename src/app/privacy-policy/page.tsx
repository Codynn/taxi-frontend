import Image from "next/image";
import { PRIVACY_POLICY_CONTENT } from "@/constants/features/privacyPolicy.constants";
import Navbar from "@/components/layout/navbar";
import { createMetadata } from "@/lib/utils/metadata";

export const metadata = createMetadata({
  title: "Privacy Policy",
  description:
    "Read Popular Ride's privacy policy. Learn how Lokpriya Taxi Pvt. Ltd. collects, uses, and protects your personal information when you use our services.",
  path: "/privacy-policy",
});

export default function PrivacyPolicyPage() {
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
              className="mt-8 absolute -top-8 -left-32 z-0 hidden md:hidden lg:block"
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
              {PRIVACY_POLICY_CONTENT.title}
            </h1>
          </div>

          <p className="mb-8 md:mb-10 text-[16px] text-black font-poppins leading-7">
            {PRIVACY_POLICY_CONTENT.intro}
          </p>

          <div className="space-y-8 md:space-y-10">
            {PRIVACY_POLICY_CONTENT.sections.map((section) => (
              <div key={section.title}>
                <h2 className="text-[16px] font-poppins font-semibold mb-3 md:mb-4">
                  {section.title}
                </h2>

                {section.description && (
                  <p className="mb-4 text-[16px] font-poppins text-black leading-7">
                    {section.description}
                  </p>
                )}

                {section.content?.map((group) => (
                  <div key={group.subtitle} className="mb-4">
                    <h3 className="font-medium text-[16px] font-poppins mb-2">
                      {group.subtitle}
                    </h3>
                    <ul className="list-disc pl-5 md:pl-6 space-y-1 text-[16px] font-poppins text-black">
                      {group.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}

                {section.items && (
                  <ul className="list-disc pl-5 md:pl-6 space-y-1 text-[16px] font-poppins text-black">
                    {section.items.map((item) => (
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
