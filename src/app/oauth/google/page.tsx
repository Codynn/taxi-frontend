"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

function GoogleCallbackHandler() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (token) {
      Cookies.set("token", token, {
        expires: 7,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });

      // 2. Fetch full user profile from /auth/me — includes photo from Google
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((r) => r.json())
        .then((res) => {
          console.log("🔍 /auth/me response:", res); // full response
          console.log("🔍 user data:", res?.data); // user object
          console.log("🔍 photo:", res?.data?.photo);

          if (res?.data) {
            // res.data has id, name, email, photo, role — all fields from DB
            setAuth(res.data, token);
          }
          toast.success("Signed in with Google!");
          router.replace("/");
        })
        .catch(() => {
          // Even if /auth/me fails, we still have the token — let useAuthInit handle it
          toast.success("Signed in with Google!");
          router.replace("/");
        });
    } else if (error) {
      toast.error(decodeURIComponent(error) || "Google sign-in failed.");
      router.replace("/");
    } else {
      router.replace("/");
    }
  }, [searchParams, router, setAuth]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 rounded-full border-4 border-[#294F98] border-t-transparent animate-spin" />
        <p className="text-sm text-gray-500 font-medium">
          Signing you in with Google…
        </p>
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-white">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 rounded-full border-4 border-[#294F98] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading…</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  );
}
