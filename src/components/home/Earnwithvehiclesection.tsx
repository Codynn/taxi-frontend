import Image from "next/image";
import Link from "next/link";

export default function EarnWithVehicleSection() {
  return (
    <section className="bg-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row lg:items-center lg:justify-between gap-10">
          <div className="order-2 md:order-1 flex flex-col gap-5 max-w-2xl">
            <h2 className="font-sora font-extrabold text-black text-[48px]  leading-tight">
              Earn With{" "}
              <span className="bg-[#FEA800] px-2 rounded-sm">Your Vehicle</span>
            </h2>

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
