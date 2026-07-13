import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface Configuration {
  id: string;
  paymentQrImage: string | null;
  defaultDriverCharge: number;
  bankName: string | null;
  bankAccountName: string | null;
  bankAccountNumber: string | null;
  paymentPhoneNumber: string | null;
  whatsappNumber: string | null;
  supportPhoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");

/**
 * Resolve a stored upload URL against the current API base.
 * Stored values may be absolute with a stale host (e.g. localhost baked in at
 * upload time) or a relative `/upload/...` path. We always keep just the path
 * and prefix the current API base so images load from wherever the API lives.
 */
export const resolveUploadUrl = (
  stored?: string | null,
): string | undefined => {
  if (!stored) return undefined;
  let path = stored;
  if (/^https?:\/\//i.test(stored)) {
    try {
      path = new URL(stored).pathname;
    } catch {
      return stored;
    }
  }
  if (!path.startsWith("/")) path = `/${path}`;
  return `${API_BASE}${path}`;
};

// ── Get site configuration (payment QR + default driver charge) ──
export const useConfiguration = () => {
  return useQuery({
    queryKey: ["configuration"],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: Configuration }>(
        "configuration",
      );
      return response.data.data;
    },
  });
};

// ── Upload a file and return its absolute URL ──
export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  const response = await api.post<{ url: string }>("upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  const base = (process.env.NEXT_PUBLIC_API_URL ?? "").replace(/\/+$/, "");
  return `${base}${response.data.url}`;
};
