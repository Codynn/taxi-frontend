"use client";

import Image from "next/image";
import { useConfiguration } from "@/lib/api/configuration.api";
import SupportContactLinks from "@/components/shared/SupportContactLinks";

export default function BookingHistoryHeader() {
  const { data: configuration } = useConfiguration();

  return (
    <div>
      <div className="relative mb-8 md:mb-10">
        <Image
          src="/about/rectangle.svg"
          alt=""
          width={325}
          height={150}
          className="mt-8 absolute -top-8 -left-30 z-0 hidden lg:block"
        />
        <Image
          src="/about/rectangle.svg"
          alt=""
          width={240}
          height={100}
          className="mt-8 absolute -top-10 -left-25 z-0 block md:hidden lg:hidden"
        />

        <h1 className="relative z-10 text-[32px] lg:text-[48px] font-semibold font-sora leading-tight">
          Booking History
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-[16px] text-black font-poppins">
          View and manage all your past and completed bookings
        </p>

        {(configuration?.whatsappNumber || configuration?.supportPhoneNumber) && (
          <div className="flex flex-col gap-1.5">
            <p className="text-[12px] text-black/50 font-poppins">
              Need help with a booking?
            </p>
            <SupportContactLinks
              whatsappNumber={configuration?.whatsappNumber}
              phoneNumber={configuration?.supportPhoneNumber}
            />
          </div>
        )}
      </div>
    </div>
  );
}
