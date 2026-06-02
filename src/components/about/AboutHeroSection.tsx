import Image from "next/image";
import Navbar from "../layout/navbar";

export default function AboutHeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden bg-white">
      <div className="absolute inset-0">
        <Image
          src="/about/about.png"
          alt="About Us hero background"
          fill
          priority
          className="object-cover object-center"
        />
        {/* <div className="absolute inset-0 bg-white/60" /> */}
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <Image
          src="/about/rectangle.svg"
          alt="Hero Car"
          width={310}
          height={150}
          className="mt-8 absolute top-45 -left-10 z-0 hidden lg:block"
        />

        <Image
          src="/about/rectangle.svg"
          alt="Hero Car"
          width={200}
          height={150}
          className="mt-8 absolute top-26 -left-15 z-0 block lg:hidden"
        />

        <div className="flex flex-1 items-center max-w-7xl mx-auto w-full lg:px-6 lg:px-8 pl-4 pb-25  lg:py-0 z-10">
          <div className="max-w-[520px]">
            <h1 className="font-sora font-extrabold text-black leading-tight text-4xl md:text-5xl lg:text-6xl">
              <span className="px-2 rounded-sm ">About</span> Us
            </h1>

            <p className="lg:mt-6 mt-2 text-[#000000] text-[16px]  lg:leading-relaxed font-medium font-poppins max-w-[240px] lg:max-w-[490px]">
              Making travel across Nepal simpler, safer, and more reliable
              through smart vehicle booking. From work trips to family travel,
              vacations, or daily rides, Popular Ride connects you with trusted
              vehicles and a smooth booking experience — anytime you need it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
