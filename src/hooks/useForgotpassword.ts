"use client";

import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/axios";
import { toast } from "sonner";

export function useForgotPassword(onSuccess?: () => void) {
  return useMutation({
    mutationFn: async (email: string) => {
      const { data } = await api.post("/auth/forgot-password", { email });
      return data;
    },
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (err: any) => {
      const msg =
        err?.response?.data?.message ??
        "Could not send reset email. Please try again.";
      toast.error(msg);
    },
  });
}
