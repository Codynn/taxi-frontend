"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  Loader2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import Navbar from "@/components/layout/navbar";
import { useBookingDetail } from "@/lib/api/booking.api";
import { downloadCanvas } from "@/lib/downloadImage";
import {
  initiateFonepayPayment,
  verifyFonepayPayment,
  useFonepayTransactions,
  type FonepayIntentResult,
  useFonepayBanks,
  type FonepayBank,
} from "@/lib/api/fonepay.api";

type FonepayState =
  | "idle"
  | "creating"
  | "waiting"
  | "verifying"
  | "success"
  | "failed";

const INITIAL_HISTORY_LIMIT = 5;

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

  const { data: banks, isLoading: loadingBanks } = useFonepayBanks();

  const [fonepayState, setFonepayState] = useState<FonepayState>("idle");
  const [fonepayIntent, setFonepayIntent] =
    useState<FonepayIntentResult | null>(null);
  const [selectedBank, setSelectedBank] = useState<FonepayBank | null>(null);
  const [isOpeningApp, setIsOpeningApp] = useState(false);
  const [deepLinkMayHaveFailed, setDeepLinkMayHaveFailed] = useState(false);
  const [bankSearch, setBankSearch] = useState("");
  const [showQr, setShowQr] = useState(false);
  const [showAllHistory, setShowAllHistory] = useState(false);
  const [qrExpiresAt, setQrExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const wsRef = useRef<WebSocket | null>(null);
  const qrCanvasRef = useRef<HTMLCanvasElement>(null);

  // Fonepay QR sessions expire 15 minutes after creation server-side — tick
  // a countdown so the user knows before it silently stops working instead
  // of finding out only after a failed "check status" click.
  useEffect(() => {
    if (fonepayState !== "waiting" || !qrExpiresAt) return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [fonepayState, qrExpiresAt]);

  const qrExpired = qrExpiresAt != null && now >= qrExpiresAt;
  const qrRemainingLabel =
    qrExpiresAt != null && !qrExpired
      ? (() => {
          const totalSec = Math.max(0, Math.round((qrExpiresAt - now) / 1000));
          const m = Math.floor(totalSec / 60);
          const s = totalSec % 60;
          return `${m}:${String(s).padStart(2, "0")}`;
        })()
      : null;

  useEffect(() => {
    return () => {
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, []);

  // If the user leaves mid-payment and comes back (or just reloads), resume
  // showing the still-open pending attempt instead of dropping them back to
  // a blank "Pay with Fonepay" button — the backend already reuses this same
  // transaction if they click pay again, so this just saves that extra step.
  const resumedRef = useRef(false);
  useEffect(() => {
    if (resumedRef.current) return;
    if (!transactions || fonepayState !== "idle") return;
    resumedRef.current = true;

    const pending = transactions.find(
      (tx) => tx.status === "PENDING" && tx.qrMessage,
    );
    if (!pending) return;

    const expiresAt = new Date(pending.createdAt).getTime() + 15 * 60 * 1000;
    if (Date.now() >= expiresAt) return;

    setFonepayIntent({
      qrMessage: pending.qrMessage!,
      prn: pending.prn,
      websocketId: pending.websocketId ?? "",
      transactionId: pending.id,
      isReused: true,
    });
    setFonepayState("waiting");
    setQrExpiresAt(expiresAt);
    setNow(Date.now());
    if (pending.websocketId) {
      connectSocket(pending.websocketId, pending.prn);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, fonepayState]);

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
      setQrExpiresAt(Date.now() + 15 * 60 * 1000);
      setNow(Date.now());
      refetchTransactions();

      // Only connect to websocket if it's a new transaction
      if (!intent.isReused && intent.websocketId) {
        connectSocket(intent.websocketId, intent.prn);
      }
    } catch {
      setFonepayState("failed");
    }
  };

  // Function to open the selected banking app via deep link
  const openBankingApp = (bank: FonepayBank) => {
    if (!fonepayIntent) return;

    setIsOpeningApp(true);
    setSelectedBank(bank);
    setDeepLinkMayHaveFailed(false);

    // Per Fonepay's spec, intentScheme is already a full scheme+host
    // (e.g. "LXBLNPKA://payment") — just append the qrPayload query param.
    const deepLinkUrl = `${bank.intentScheme}?qrPayload=${encodeURIComponent(
      fonepayIntent.qrMessage,
    )}`;

    // For Android, we need to open with the package name
    const isAndroid = /android/i.test(navigator.userAgent);
    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isMobile = isAndroid || isIOS;

    if (isAndroid && bank.packageName) {
      try {
        const [scheme, rest] = bank.intentScheme.split("://");
        const intentUrl = `intent://${rest}?qrPayload=${encodeURIComponent(
          fonepayIntent.qrMessage,
        )}#Intent;scheme=${scheme};package=${bank.packageName};end;`;
        window.location.href = intentUrl;
      } catch (error) {
        console.error("Failed to open Android app:", error);
        window.location.href = deepLinkUrl;
      }
    } else if (isIOS) {
      window.location.href = deepLinkUrl;
    } else {
      window.open(deepLinkUrl, "_blank");
    }

    // If the OS actually switches to the banking app, this tab gets
    // backgrounded — if it's still visible after a couple seconds, the app
    // most likely isn't installed, so surface a hint instead of leaving the
    // user staring at "Opening..." with no explanation.
    if (isMobile) {
      setTimeout(() => {
        if (document.visibilityState === "visible") {
          setDeepLinkMayHaveFailed(true);
        }
      }, 2000);
    }

    setTimeout(() => {
      setIsOpeningApp(false);
    }, 5000);
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

  const driverCharge = booking.driverRequired ? (booking.driverCharge ?? 0) : 0;
  const total = (booking.quotedPrice ?? 0) + driverCharge;
  const canPay =
    booking.paymentStatus !== "FULLY_PAID" &&
    booking.quotedPrice != null &&
    booking.status !== "CANCELLED";

  // Pending attempts are represented by the active payment section above
  // (and are transparently reused rather than piling up), so the history
  // list only needs to show attempts that actually concluded.
  const finalizedTransactions = (transactions ?? []).filter(
    (tx) => tx.status !== "PENDING",
  );
  const visibleTransactions = showAllHistory
    ? finalizedTransactions
    : finalizedTransactions.slice(0, INITIAL_HISTORY_LIMIT);

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

          {booking.status === "PENDING" &&
            booking.paymentStatus !== "FULLY_PAID" && (
              <p className="text-[12px] font-poppins text-black/50 mb-4 -mt-2">
                Your booking will move to{" "}
                <span className="font-semibold text-black">Confirmed</span>{" "}
                automatically once payment is completed below.
              </p>
            )}

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
              Pay with Checkout by Fonepay
            </h2>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              {fonepayState === "idle" && (
                <button
                  type="button"
                  onClick={handlePay}
                  className="w-full py-3 rounded-full bg-[#ce2027] text-white font-semibold font-poppins text-[14px] hover:bg-[#b01c22] transition-colors"
                >
                  Continue with Checkout by Fonepay
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

              {fonepayState === "waiting" && fonepayIntent && qrExpired && (
                <div className="flex flex-col items-center gap-3 py-4">
                  <p className="text-[13px] font-poppins text-red-600 text-center">
                    This payment QR has expired.
                  </p>
                  <button
                    type="button"
                    onClick={handlePay}
                    className="text-[13px] font-poppins font-semibold text-[#FEA800] underline"
                  >
                    Generate a new QR
                  </button>
                </div>
              )}

              {fonepayState === "waiting" && fonepayIntent && !qrExpired && (
                <div className="flex flex-col gap-4">
                  {/* Bank List Section — primary payment method */}
                  <div>
                    <p className="text-[14px] font-poppins font-semibold text-black mb-3">
                      Select your bank or wallet to pay instantly:
                    </p>

                    {loadingBanks ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="w-5 h-5 text-[#ce2027] animate-spin" />
                        <span className="ml-2 text-[13px] font-poppins text-black/50">
                          Loading banks...
                        </span>
                      </div>
                    ) : banks && banks.length > 0 ? (
                      <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <div className="p-2.5 border-b border-gray-200 bg-white">
                          <input
                            type="text"
                            value={bankSearch}
                            onChange={(e) => setBankSearch(e.target.value)}
                            placeholder="Search..."
                            className="w-full text-[13px] font-poppins text-black placeholder:text-black/40 bg-[#f5f5f5] rounded-full px-4 py-2 outline-none focus:ring-1 focus:ring-[#ce2027]"
                          />
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                          {banks
                            .filter((bank) =>
                              bank.bankName
                                .toLowerCase()
                                .includes(bankSearch.trim().toLowerCase()),
                            )
                            .map((bank) => (
                              <button
                                key={bank.bankCode}
                                type="button"
                                onClick={() => openBankingApp(bank)}
                                disabled={isOpeningApp}
                                className={`
                                  w-full flex items-center gap-3 px-3.5 py-3 text-left
                                  transition-colors duration-150
                                  ${
                                    selectedBank?.bankCode === bank.bankCode
                                      ? "bg-[#fbe9ea]"
                                      : "bg-white hover:bg-[#f5f5f5]"
                                  }
                                  ${isOpeningApp ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                                `}
                              >
                                {bank.bankIcon ? (
                                  <img
                                    src={bank.bankIcon}
                                    alt={bank.bankName}
                                    className="w-9 h-9 rounded-md object-contain shrink-0 bg-white border border-gray-100"
                                    onError={(e) => {
                                      (
                                        e.target as HTMLImageElement
                                      ).style.display = "none";
                                    }}
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-md shrink-0 bg-[#f5f5f5]" />
                                )}
                                <span className="flex-1 text-[13px] font-poppins font-medium text-black">
                                  {bank.bankName}
                                </span>
                                <ExternalLink className="w-3.5 h-3.5 text-black/25 shrink-0" />
                              </button>
                            ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-[13px] font-poppins text-black/50 text-center py-4">
                        No banks available. Please use the QR code above.
                      </p>
                    )}
                  </div>

                  {/* QR Code Section — secondary, collapsed by default */}
                  <div className="border-t border-gray-200 pt-3">
                    <button
                      type="button"
                      onClick={() => setShowQr((v) => !v)}
                      className="w-full text-center text-[12.5px] font-poppins text-black/50 hover:text-black/70"
                    >
                      {showQr
                        ? "Hide QR code"
                        : "Prefer to scan a QR code instead?"}
                    </button>

                    {showQr && (
                      <div className="flex flex-col items-center gap-2.5 mt-3">
                        <div className="bg-white rounded-xl p-2.5 border border-gray-200">
                          <QRCodeCanvas
                            ref={qrCanvasRef}
                            value={fonepayIntent.qrMessage}
                            size={130}
                          />
                        </div>
                        {qrRemainingLabel && (
                          <p className="text-[11px] font-poppins text-black/40">
                            Expires in {qrRemainingLabel}
                          </p>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            if (qrCanvasRef.current) {
                              downloadCanvas(
                                qrCanvasRef.current,
                                "fonepay-qr.png",
                              );
                            }
                          }}
                          className="flex items-center gap-1.5 text-[12px] font-poppins font-semibold text-black/50 hover:text-black/70 underline"
                        >
                          <Download className="w-3 h-3" />
                          Download QR
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Status Message */}
                  <div className="mt-2">
                    <p className="text-[13px] font-poppins text-black/70 text-center">
                      {isOpeningApp
                        ? `Opening ${selectedBank?.bankName || "your banking app"}...`
                        : fonepayIntent.isReused
                          ? "Continuing existing payment. Scan the QR or select your bank above."
                          : "Select your bank above to pay instantly. This page will update automatically once payment is confirmed."}
                    </p>
                    {deepLinkMayHaveFailed && (
                      <div className="flex items-start gap-2.5 mt-2 p-3 rounded-xl bg-[#fbe9ea] border border-[#ce2027]/20">
                        <div className="flex-1">
                          <p className="text-[12.5px] font-poppins font-semibold text-black">
                            Mobile banking app not found
                          </p>
                          <p className="text-[12px] font-poppins text-black/60 mt-0.5">
                            {selectedBank?.bankName || "The selected"} service
                            or digital wallet is currently unavailable. Try a
                            different bank, or scan the QR code above.
                          </p>
                          <button
                            type="button"
                            onClick={() => {
                              if (selectedBank) openBankingApp(selectedBank);
                            }}
                            className="mt-1.5 text-[12px] font-poppins font-semibold text-[#ce2027] underline"
                          >
                            Try Again
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => setDeepLinkMayHaveFailed(false)}
                          aria-label="Dismiss"
                          className="text-black/30 hover:text-black/60 shrink-0"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => runVerification(fonepayIntent.prn)}
                      className="w-full text-center text-[13px] font-poppins font-semibold text-[#ce2027] underline mt-2"
                    >
                      I&apos;ve completed the payment — check status
                    </button>
                  </div>
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
                    Payment confirmed successfully!
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

        {finalizedTransactions.length > 0 && (
          <div className="bg-[#f5f5f5] rounded-2xl p-5">
            <h2 className="text-[18px] font-bold font-sora text-black mb-4">
              Payment History
            </h2>
            <div className="flex flex-col gap-2">
              {visibleTransactions.map((tx) => (
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
            {finalizedTransactions.length > INITIAL_HISTORY_LIMIT && (
              <button
                type="button"
                onClick={() => setShowAllHistory((v) => !v)}
                className="mt-3 text-[13px] font-poppins font-semibold text-[#FEA800] underline"
              >
                {showAllHistory
                  ? "Show less"
                  : `Show ${finalizedTransactions.length - INITIAL_HISTORY_LIMIT} more`}
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
