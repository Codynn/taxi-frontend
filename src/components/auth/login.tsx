"use client";

import Image from "next/image";
import { X, ShieldCheck, Clock, MapPin } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { Button } from "@/components/ui/button";
import { POST_LOGIN_REDIRECT_KEY } from "@/constants/features/auth.constants";
import { useAuthModal } from "@/context/Authmodalcontext";

export default function LoginModal() {
  const { closeModal } = useAuthModal();

  const handleGoogleLogin = () => {
    // Remember the current page so we can return here after Google sign-in.
    try {
      localStorage.setItem(
        POST_LOGIN_REDIRECT_KEY,
        window.location.pathname + window.location.search,
      );
    } catch {
      /* ignore storage errors */
    }
    const baseUrl = `${window.location.protocol}//${window.location.host}`;
    const redirectTo = `${baseUrl}/oauth/google`;
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    window.location.href = `${apiBase}/auth/initiate-google-auth?role=CUSTOMER&redirectTo=${encodeURIComponent(redirectTo)}`;
  };

  return (
    <>
      <DialogPrimitive.Overlay className="fixed inset-0 bg-black/40 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />

      <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[820px] rounded-2xl overflow-hidden shadow-2xl focus:outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
        <DialogPrimitive.Title className="sr-only">
          Sign in to Lokpriya Taxi
        </DialogPrimitive.Title>
        <div className="flex min-h-[460px]">
          {/* Left — full image */}
          <div className="hidden md:block w-[45%] shrink-0 relative">
            <Image
              src="/home/family2.png"
              alt="Happy family in taxi"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          {/* Right — content */}
          <div className="flex flex-col flex-1 px-6 md:px-10 py-8 bg-white relative">
            <DialogPrimitive.Close
              onClick={closeModal}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-[#FE4830] transition-colors focus:outline-none"
            >
              <X size={24} />
            </DialogPrimitive.Close>

            <div className="mb-8 mt-2">
              <Image
                src="/logo/logo.svg"
                alt="Popular Rides"
                width={120}
                height={40}
                className="mb-5"
              />
              <h2 className="text-[24px] font-bold font-poppins text-black leading-tight">
                Welcome to Lokpriya Taxi
              </h2>
              <p className="text-[13px] font-poppins text-gray-600 mt-1.5">
                Sign in with Google to book your ride in seconds.
              </p>
            </div>

            {/* Simple graphics / value points to fill the space */}
            <div className="flex flex-col gap-4 mb-8">
              <Feature
                icon={<ShieldCheck size={18} />}
                title="Secure & fast"
                desc="One tap sign-in with your Google account — no passwords."
              />
              <Feature
                icon={<MapPin size={18} />}
                title="Book across Nepal"
                desc="Reserve cars, jeeps, and taxis for any route."
              />
              <Feature
                icon={<Clock size={18} />}
                title="Track your bookings"
                desc="View and manage your trips anytime."
              />
            </div>

            <div className="mt-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleGoogleLogin}
                className="w-full h-12 rounded-full border-2 border-[#FFB119] text-gray-800 font-semibold text-[14px] flex items-center justify-center gap-2.5 hover:bg-gray-50 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path
                    fill="#EA4335"
                    d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                  />
                  <path
                    fill="#34A853"
                    d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                  />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Continue with Google
              </Button>

              <p className="text-center text-[11px] font-poppins text-gray-400 mt-3">
                We only use Google to verify your identity.
              </p>
            </div>
          </div>
        </div>
      </DialogPrimitive.Content>
    </>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="h-9 w-9 shrink-0 rounded-xl bg-[#FEA800]/10 flex items-center justify-center text-[#FEA800]">
        {icon}
      </div>
      <div>
        <p className="text-[14px] font-semibold font-poppins text-black leading-tight">
          {title}
        </p>
        <p className="text-[12px] font-poppins text-gray-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}
