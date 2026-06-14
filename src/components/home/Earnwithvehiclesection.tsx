import Image from "next/image";
import Link from "next/link";

export default function EarnWithVehicleSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-10">
          <div className="order-2 md:order-1 flex flex-col gap-5 max-w-2xl">
            <div className="relative  pt-10">
              <Image
                src="/about/rectangle.svg"
                alt=""
                width={480}
                height={50}
                className="absolute top-8 left-[47%] -translate-x-1/2 z-0 lg:block hidden"
                aria-hidden
              />
              <Image
                src="/about/rectangle.svg"
                alt=""
                width={220}
                height={150}
                className="absolute top-10 left-[8%] z-0 lg:hidden md:hidden block"
                aria-hidden
              />
              <Image
                src="/about/rectangle.svg"
                alt=""
                width={320}
                height={150}
                className="absolute top-10 left-[8%] z-0 lg:hidden hidden sm:block"
                aria-hidden
              />
              <h2 className="relative z-10 mt-2 text-[20px] md:text-[32px] lg:text-[48px] font-semibold font-sora text-[#000000]">
                Earn With <span className="px-2 rounded-sm">Your Vehicle</span>
              </h2>
            </div>

            <p className="font-poppins text-[#000000]/65 text-[16px]  leading-relaxed">
              List your vehicle on our platform and turn everyday availability
              into a reliable source of income through verified trip bookings.
            </p>

            <div>
              <Link
                href="/become-a-partner"
                className="inline-block bg-[#FEA800] text-black font-semibold font-poppins text-sm px-7 py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors"
              >
                Become a Partner
              </Link>
            </div>
          </div>

          <div className="order-1 md:order-2 w-full md:w-[48%] rounded-2xl overflow-hidden">
            <Image
              src="/home/driver2.png"
              alt="Partner driver standing in front of taxi"
              width={900}
              height={700}
              className="w-full h-auto object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
