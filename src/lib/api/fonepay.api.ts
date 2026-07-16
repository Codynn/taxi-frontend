import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface FonepayIntentResult {
  qrMessage: string;
  prn: string;
  websocketId: string;
  transactionId: string;
}

export async function initiateFonepayPayment(
  bookingId: string,
): Promise<FonepayIntentResult> {
  const res = await api.post<{ success: boolean; data: FonepayIntentResult }>(
    `fonepay/initiate/${bookingId}`,
  );
  return res.data.data;
}

export interface FonepayVerifyResult {
  booking: { id: string; status: string; paymentStatus: string };
  transaction: FonepayTransaction;
  fonepay: { paymentStatus: string; paymentMessage?: string };
}

export async function verifyFonepayPayment(
  prn: string,
): Promise<FonepayVerifyResult> {
  const res = await api.post<{ success: boolean; data: FonepayVerifyResult }>(
    `fonepay/verify/${prn}`,
  );
  return res.data.data;
}

export interface FonepayTransaction {
  id: string;
  bookingId: string;
  prn: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED";
  fonepayTraceId: number | null;
  paymentMessage: string | null;
  createdAt: string;
  updatedAt: string;
}

export async function getFonepayTransactions(
  bookingId: string,
): Promise<FonepayTransaction[]> {
  const res = await api.get<{ success: boolean; data: FonepayTransaction[] }>(
    `fonepay/transactions/${bookingId}`,
  );
  return res.data.data;
}

export function useFonepayTransactions(bookingId: string | undefined) {
  return useQuery({
    queryKey: ["fonepay-transactions", bookingId],
    queryFn: () => getFonepayTransactions(bookingId as string),
    enabled: !!bookingId,
  });
}
