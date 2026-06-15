"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";

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

      api
        .get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.data) {
            setAuth(res.data.data, token);
          }
          toast.success("Signed in with Google!");
          router.replace("/");
        })
        .catch(() => {
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
        <div className="h-10 w-10 rounded-full border-4 border-[#FEA800] border-t-transparent animate-spin" />
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
            <div className="h-10 w-10 rounded-full border-4 border-[#FEA800] border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500 font-medium">Loading…</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackHandler />
    </Suspense>
  );
}
