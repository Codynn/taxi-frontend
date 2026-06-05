"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

interface SearchRideLoaderProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchRideLoader({
  open,
  onClose,
}: SearchRideLoaderProps) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    async function loadLottie() {
      try {
        const lottie = (await import("lottie-web")).default;
        if (cancelled || !containerRef.current) return;
        animRef.current = lottie.loadAnimation({
          container: containerRef.current,
          renderer: "svg",
          loop: true,
          autoplay: true,
          path: "/animations/car.json",
        });
      } catch (e) {
        console.error("Lottie failed to load", e);
      }
    }

    loadLottie();

    const timer = setTimeout(() => {
      onClose();
      router.push("/choose-ride");
    }, 2000);

    return () => {
      cancelled = true;
      animRef.current?.destroy();
      animRef.current = null;
      clearTimeout(timer);
    };
  }, [open, onClose, router]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center  px-4">
      <div className="bg-white rounded-3xl w-full max-w-lg px-8 pt-10 pb-10 flex flex-col items-center gap-6 shadow-2xl">
        {/* Lottie animation */}
        <div ref={containerRef} className="w-full max-w-sm min-h-[180px]" />

        {/* Text */}
        <p className="text-center text-gray-700 text-base font-medium font-poppins leading-relaxed">
          Please wait while we prepare your journey and find the best available
          rides for you...
        </p>

        {/* Animated dots */}
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-2 h-2 rounded-full bg-[#FEA800] animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
