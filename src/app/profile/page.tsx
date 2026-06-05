import type { Metadata } from "next";
import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import ProfileForm from "@/components/shared/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Popular Rides",
  description: "View and update your Popular Rides profile details.",
};

export default function ProfilePage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-28 pb-16 px-4">
        <div className="max-w-7xl mx-auto w-full px-2 sm:px-4 md:px-6">
          <div className="relative mb-3">
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={310}
              height={150}
              className="absolute -top-1 -left-32 z-0 hidden lg:block"
              aria-hidden
            />
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={250}
              height={150}
              className="absolute -top-1 -left-6 z-0 hidden md:block lg:hidden"
              aria-hidden
            />
            <Image
              src="/about/rectangle.svg"
              alt=""
              width={200}
              height={120}
              className="absolute -top-1 -left-4 z-0 block md:hidden"
              aria-hidden
            />
            <h1 className="relative z-10 text-[42px] font-semibold font-sora leading-tight text-black">
              Profile
            </h1>
          </div>

          <p className="mb-8 text-[15px] text-gray-600 font-poppins">
            View and Update your profile details.
          </p>

          <ProfileForm />
        </div>
      </section>
    </main>
  );
}
