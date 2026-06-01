"use client";

import { useEffect } from "react";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useLogout";

// Module-level flag — never resets on remount, only on full page reload
// This is intentional: /user/me should fire exactly once per browser session
let hasFired = false;

export function useAuthInit() {
  const { setAuth, token, _hasHydrated } = useAuthStore();
  const { logout } = useLogout();

  useEffect(() => {
    if (!_hasHydrated) return;

    if (hasFired) return;
    hasFired = true;

    const cookieToken = Cookies.get("token");
    const activeToken = cookieToken ?? token ?? null;

    fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
      headers: activeToken ? { Authorization: `Bearer ${activeToken}` } : {},
    })
      .then((r) => {
        if (r.status === 401) {
          logout();
          return null;
        }
        return r.json();
      })
      .then((res) => {
        if (!res) return;
        if (res?.data) {
          if (!cookieToken && activeToken) {
            Cookies.set("token", activeToken, {
              expires: 7,
              secure: process.env.NODE_ENV === "production",
              sameSite: "strict",
              path: "/",
            });
          }
          setAuth(res.data, activeToken!);
        } else {
          logout();
        }
      })
      .catch(() => {});
  }, [_hasHydrated]);
}
