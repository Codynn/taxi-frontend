"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import Cookies from "js-cookie";
import { useAuthStore } from "@/store/useAuthStore";
import {
  customerSignup,
  customerLogin,
  type SignupPayload,
  type LoginPayload,
} from "@/lib/api/auth.api";

// ─── Cookie helper ─────────────────────────────────────────────────────────────

function saveTokenToCookie(token: string, remember: boolean) {
  Cookies.set("token", token, {
    expires: remember ? 30 : 7,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export function clearToken() {
  Cookies.remove("token");
}

// ─── Signup Mutation ───────────────────────────────────────────────────────────

interface UseSignupOptions {
  onSuccess?: () => void;
}

export function useSignup({ onSuccess }: UseSignupOptions = {}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: SignupPayload) => customerSignup(payload),

    onSuccess: (data) => {
      const { token, user } = data.data;
      saveTokenToCookie(token, false);
      setAuth(user, token);
      toast.success(data.message ?? "Account created successfully!");
      onSuccess?.();
    },

    onError: (error: unknown) => {
      console.error("[useSignup] raw error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Signup failed. Please try again.";
      toast.error(message);
    },
  });
}

// ─── Login Mutation ────────────────────────────────────────────────────────────

interface UseLoginOptions {
  onSuccess?: () => void;
}

export function useLogin({ onSuccess }: UseLoginOptions = {}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: ({
      payload,
      remember,
    }: {
      payload: LoginPayload;
      remember: boolean;
    }) => customerLogin(payload).then((res) => ({ res, remember })),

    onSuccess: ({ res, remember }) => {
      const { token, user } = res.data;
      saveTokenToCookie(token, remember);
      // user from login includes photo from Google if oauth
      setAuth(user, token);
      toast.success(res.message ?? "Welcome back!");
      onSuccess?.();
    },

    onError: (error: unknown) => {
      console.error("[useLogin] raw error:", error);
      const message =
        error instanceof Error
          ? error.message
          : "Login failed. Please check your credentials.";
      toast.error(message);
    },
  });
}
