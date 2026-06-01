"use client";

import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";

export function useLogout() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  function logout() {
    Cookies.remove("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth-storage");
    }
    clearAuth();
  }

  return { logout };
}
