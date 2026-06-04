"use client";

import { useEffect, useRef } from "react";

export default function Loading() {
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<any>(null);

  useEffect(() => {
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
    return () => {
      cancelled = true;
      animRef.current?.destroy();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col items-center justify-center gap-6 px-6">
      {/* Lottie animation */}
      <div ref={containerRef} className="w-full max-w-sm min-h-[180px]" />

      {/* Text */}
      <div className="text-center">
        <p className="text-gray-700 text-base font-medium font-poppins leading-relaxed">
          Please wait while we prepare your journey and find the best available
          rides for you...
        </p>
      </div>

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
  );
}
