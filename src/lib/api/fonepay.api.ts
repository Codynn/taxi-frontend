import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export interface FonepayIntentResult {
  qrMessage: string;
  prn: string;
  websocketId: string;
  transactionId: string;
  isReused?: boolean;
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
  // NEW: these fields may be present if the transaction has them
  qrMessage?: string | null;
  websocketId?: string | null;
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

export interface FonepayBank {
  bankName: string;
  bankCode: string;
  bankIcon: string;
  packageName: string;
  // Custom URL scheme to deep-link into the bank/wallet app, e.g.
  // "LXBLNPKA://payment". Build the full link as
  // `${intentScheme}?qrPayload=${encodeURIComponent(qrMessage)}`.
  intentScheme: string;
}

export async function getFonepayBanks(query: {
  mobileNo?: string;
  paymentMode?: string;
}): Promise<FonepayBank[]> {
  const res = await api.get<{ success: boolean; data: FonepayBank[] }>(
    `fonepay/banks`,
    {
      params: query || {},
    },
  );
  return res.data.data;
}

export function useFonepayBanks(query: {
  mobileNo?: string;
  paymentMode?: string;
}) {
  return useQuery({
    queryKey: ["fonepay-banks", query],
    queryFn: () => getFonepayBanks(query),
    staleTime: 1000 * 60 * 30,
    enabled: !!query.mobileNo,
  });
}
