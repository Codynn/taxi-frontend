import Image from "next/image";

export default function BookingHistoryHeader() {
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

      <p className="text-[16px] text-black font-poppins">
        View and manage all your past and completed bookings
      </p>
    </div>
  );
}
