"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { api } from "@/lib/axios";
import { POST_LOGIN_REDIRECT_KEY } from "@/constants/features/auth.constants";

// Read (and clear) the page the user was on before Google sign-in.
function consumeRedirect(): string {
  let dest = "/";
  try {
    const saved = localStorage.getItem(POST_LOGIN_REDIRECT_KEY);
    if (saved && saved.startsWith("/") && !saved.startsWith("/oauth")) {
      dest = saved;
    }
    localStorage.removeItem(POST_LOGIN_REDIRECT_KEY);
  } catch {
    /* ignore storage errors */
  }
  return dest;
}

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

      const dest = consumeRedirect();

      api
        .get("/user/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data?.data) {
            setAuth(res.data.data, token);
          }
          toast.success("Signed in with Google!");
          window.location.href = dest;
        })
        .catch(() => {
          toast.success("Signed in with Google!");
          window.location.href = dest;
        });
    } else if (error) {
      consumeRedirect();
      toast.error(decodeURIComponent(error) || "Google sign-in failed.");
      window.location.href = "/";
    } else {
      window.location.href = "/";
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
