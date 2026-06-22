import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface Configuration {
  id: string;
  paymentQrImage: string | null;
  defaultDriverCharge: number;
  createdAt: string;
  updatedAt: string;
}

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
