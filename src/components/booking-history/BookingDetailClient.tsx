"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, XCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Navbar from "@/components/layout/navbar";
import { useBookingDetail } from "@/lib/api/booking.api";
import {
  initiateFonepayPayment,
  verifyFonepayPayment,
  useFonepayTransactions,
  type FonepayIntentResult,
} from "@/lib/api/fonepay.api";

type FonepayState =
  | "idle"
  | "creating"
  | "waiting"
  | "verifying"
  | "success"
  | "failed";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-700",
  CONFIRMED: "bg-blue-100 text-blue-700",
  IN_PROGRESS: "bg-purple-100 text-purple-700",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  AWAITING_ACCEPTANCE: "bg-orange-100 text-orange-700",
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  UNPAID: "bg-red-100 text-red-700",
  PARTIALLY_PAID: "bg-orange-100 text-orange-700",
  FULLY_PAID: "bg-green-100 text-green-700",
};

export default function BookingDetailClient({
  bookingId,
}: {
  bookingId: string;
}) {
  const { data: booking, isLoading, refetch } = useBookingDetail(bookingId);
  const { data: transactions, refetch: refetchTransactions } =
    useFonepayTransactions(bookingId);

  const [fonepayState, setFonepayState] = useState<FonepayState>("idle");
  const [fonepayIntent, setFonepayIntent] = useState<FonepayIntentResult | null>(
    null,
  );
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  const runVerification = async (prn: string) => {
    setFonepayState("verifying");
    try {
      const result = await verifyFonepayPayment(prn);
      refetchTransactions();
      if (result.booking.paymentStatus === "FULLY_PAID") {
        wsRef.current?.close();
        setFonepayState("success");
        refetch();
      } else {
        setFonepayState("waiting");
      }
    } catch {
      setFonepayState("waiting");
    }
  };

  const connectSocket = (websocketId: string, prn: string) => {
    const ws = new WebSocket(websocketId);
    wsRef.current = ws;
    ws.onmessage = (event) => {
      try {
        const outer = JSON.parse(event.data);
        let txStatus = outer?.transactionStatus;
        if (typeof txStatus === "string") txStatus = JSON.parse(txStatus);
        if (txStatus && typeof txStatus.paymentSuccess !== "undefined") {
          runVerification(prn);
        }
      } catch {
        // Ignore malformed/unexpected socket frames.
      }
    };
  };

  const handlePay = async () => {
    setFonepayState("creating");
    try {
      const intent = await initiateFonepayPayment(bookingId);
      setFonepayIntent(intent);
      setFonepayState("waiting");
      refetchTransactions();
      connectSocket(intent.websocketId, intent.prn);
    } catch {
      setFonepayState("failed");
    }
  };

  if (isLoading) {
    return (
      <main className="w-full bg-white min-h-screen">
        <Navbar forceWhite />
        <div className="flex items-center justify-center py-32">
          <Loader2 className="w-6 h-6 animate-spin text-black/50" />
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="w-full bg-white min-h-screen">
        <Navbar forceWhite />
        <div className="max-w-3xl mx-auto px-4 py-32 text-center">
          <p className="text-[15px] font-poppins text-black/60">
            Booking not found.
          </p>
        </div>
      </main>
    );
  }

  const driverCharge = booking.driverRequired
    ? (booking.driverCharge ?? 0)
    : 0;
  const total = (booking.quotedPrice ?? 0) + driverCharge;
  const canPay =
    booking.paymentStatus !== "FULLY_PAID" && booking.quotedPrice != null;

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar forceWhite />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 pt-25 flex flex-col gap-5">
        <Link
          href="/my-bookings"
          className="flex items-center gap-2 text-[16px] font-poppins text-black w-fit"
        >
          <ArrowLeft className="w-10 h-10 text-[#FEA900] bg-[#FEF1D8] p-2 rounded-full" />
          Back to My Bookings
        </Link>

        <div className="bg-[#f5f5f5] rounded-2xl p-5">
          <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
            <h1 className="text-[20px] font-bold font-sora text-black">
              Booking #{booking.id.slice(0, 8)}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className={`text-[11px] font-semibold font-poppins px-2.5 py-1 rounded-full ${STATUS_COLORS[booking.status] ?? ""}`}
              >
                {booking.status.replace(/_/g, " ")}
              </span>
              <span
                className={`text-[11px] font-semibold font-poppins px-2.5 py-1 rounded-full ${PAYMENT_STATUS_COLORS[booking.paymentStatus] ?? ""}`}
              >
                {booking.paymentStatus.replace(/_/g, " ")}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[14px] font-poppins text-black/80">
            <p>
              <span className="text-black/50">Pickup:</span>{" "}
              {booking.pickUpLocation}
            </p>
            <p>
              <span className="text-black/50">Dropoff:</span>{" "}
              {booking.dropOffLocation}
            </p>
            {booking.quotedPrice != null && (
              <p>
                <span className="text-black/50">Total:</span> Rs{" "}
                {total.toLocaleString()}
              </p>
            )}
          </div>
        </div>

        {canPay && (
          <div className="bg-[#f5f5f5] rounded-2xl p-5">
            <h2 className="text-[18px] font-bold font-sora text-black mb-4">
              Pay with Fonepay
            </h2>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              {fonepayState === "idle" && (
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full py-3 rounded-full bg-black text-white font-semibold font-poppins text-[14px] hover:bg-black/80 transition-colors"
                >
                  Pay with Fonepay
                </button>
              )}

              {fonepayState === "creating" && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="w-5 h-5 text-black animate-spin" />
                  <span className="text-[13px] font-poppins text-black/70">
                    Preparing payment...
                  </span>
                </div>
              )}

              {fonepayState === "waiting" && fonepayIntent && (
                <div className="flex flex-col items-center gap-3">
                  <div className="bg-white rounded-xl p-3 border border-gray-200">
                    <QRCodeSVG value={fonepayIntent.qrMessage} size={180} />
                  </div>
                  <p className="text-[13px] font-poppins text-black/70 text-center">
                    Scan with your banking app to pay. This page will update
                    automatically once payment is confirmed.
                  </p>
                  <button
                    type="button"
                    onClick={() => runVerification(fonepayIntent.prn)}
                    className="text-[13px] font-poppins font-semibold text-[#FEA800] underline"
                  >
                    I&apos;ve completed the payment — check status
                  </button>
                </div>
              )}

              {fonepayState === "verifying" && (
                <div className="flex items-center justify-center gap-2 py-4">
                  <Loader2 className="w-5 h-5 text-black animate-spin" />
                  <span className="text-[13px] font-poppins text-black/70">
                    Verifying payment...
                  </span>
                </div>
              )}

              {fonepayState === "success" && (
                <div className="flex items-center justify-center gap-2 py-4 text-green-600">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[13px] font-poppins font-semibold">
                    Payment confirmed
                  </span>
                </div>
              )}

              {fonepayState === "failed" && (
                <div className="flex flex-col items-center gap-2 py-2">
                  <p className="text-[13px] font-poppins text-red-600 text-center">
                    Something went wrong. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={handlePay}
                    className="text-[13px] font-poppins font-semibold text-[#FEA800] underline"
                  >
                    Retry
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {transactions && transactions.length > 0 && (
          <div className="bg-[#f5f5f5] rounded-2xl p-5">
            <h2 className="text-[18px] font-bold font-sora text-black mb-4">
              Payment History
            </h2>
            <div className="flex flex-col gap-2">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="bg-white rounded-xl p-3 border border-gray-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-2">
                    {tx.status === "SUCCESS" ? (
                      <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                    ) : tx.status === "FAILED" ? (
                      <XCircle className="w-4 h-4 text-red-500 shrink-0" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-gray-400 shrink-0" />
                    )}
                    <div>
                      <p className="text-[13px] font-poppins text-black">
                        Rs {tx.amount.toLocaleString()}{" "}
                        <span className="text-black/40">· {tx.prn}</span>
                      </p>
                      {tx.paymentMessage && (
                        <p className="text-[12px] font-poppins text-black/50">
                          {tx.paymentMessage}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-poppins text-black/40 shrink-0">
                    {new Date(tx.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
