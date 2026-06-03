import Image from "next/image";

export default function RideHeroSection() {
  return (
    <section className="relative w-full overflow-hidden">
      <div className="absolute inset-0 mt-30 lg:mt-0">
        <Image
          src="/ride/ride.svg"
          alt=""
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:min-h-[85vh]">
          <div className="pt-25 pb-6 lg:py-0 flex-1 max-w-xl relative">
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={250}
              height={250}
              className="mt-8 absolute top-14 left-36 z-0 hidden lg:block"
            />

            <Image
              src="/about/rectangle.svg"
              alt=""
              width={250}
              height={150}
              className="mt-8 absolute -top-5 left-13 z-0 hidden lg:block"
            />

            {/* small */}

            <Image
              src="/about/rectangle.svg"
              alt=""
              width={200}
              height={150}
              className="mt-8 absolute top-18 left-6 z-0 block lg:hidden"
            />

            <Image
              src="/about/rectangle.svg"
              alt=""
              width={200}
              height={150}
              className="mt-8 absolute top-30 left-22 z-0 block lg:hidden"
            />

            <h1 className="relative font-sora font-extrabold text-black lg:text-white leading-tight text-[40px] lg:text-[60px]">
              Find Your <br /> Perfect Ride
            </h1>
          </div>

          {/* RIGHT — car image: below text on mobile, right side on desktop */}
          <div className="flex-1 flex items-end justify-center lg:justify-end self-end pt-30 lg:pt-0">
            <Image
              src="/ride/car.svg"
              alt="Car"
              width={680}
              height={420}
              className="w-full max-w-[340px] sm:max-w-[480px] lg:max-w-[680px] h-auto object-contain"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
