import Image from "next/image";
import type { BookingFormState } from "@/types/booking.types";

interface Props {
  bookingState: BookingFormState;
  variant: "desktop" | "mobile";
}

export default function CheckoutBookingSummary({
  bookingState,
  variant,
}: Props) {
  const totalPassengers =
    bookingState.passengers.adults + bookingState.passengers.children;

  const isMobile = variant === "mobile";

  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden">
      <div className={isMobile ? "px-4 pt-4 pb-4" : "px-5 pt-5 pb-4"}>
        <h2
          className={`font-medium font-sora text-black mb-4 ${
            isMobile ? "text-[18px]" : "text-[18px]"
          }`}
        >
          Booking Summary
        </h2>

        {/* Trip type row */}
        <div className="flex bg-[#f5f5f5] rounded-xl overflow-hidden mb-4">
          <div className="flex-1 px-4 py-3 text-center border-r border-gray-200">
            <span className="text-[16px] font-poppins text-black">
              {bookingState.tripType === "round-trip"
                ? "Round Trip"
                : "One Way"}
            </span>
          </div>
          <div className="flex-1 px-4 py-3 text-center">
            <span className="text-[16px] font-poppins text-black">
              {bookingState.driverType === "with-driver"
                ? "With Driver"
                : "Self Drive"}
            </span>
          </div>
        </div>

        {isMobile ? (
          /* Mobile: From + swap + To in one row */
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Image
                src="/ride/locationgreen.svg"
                alt="from"
                width={36}
                height={36}
                className="shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-poppins">From</p>
                <p className="text-[16px] text-black font-poppins truncate">
                  {bookingState.destination.from || "Kathmandu"}
                </p>
              </div>
            </div>

            <svg
              width="28"
              height="20"
              viewBox="0 0 28 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 6H24M24 6L19 1M24 6L19 11"
                stroke="#FEA800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M24 14H4M4 14L9 9M4 14L9 19"
                stroke="#FEA800"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="flex items-center gap-2 flex-1 min-w-0">
              <Image
                src="/ride/locationred.svg"
                alt="to"
                width={36}
                height={36}
                className="shrink-0"
              />
              <div className="min-w-0">
                <p className="text-[12px] font-poppins">To</p>
                <p className="text-[16px] text-black font-poppins truncate">
                  {bookingState.destination.to || "Pokhara"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* Desktop: From, dashed line, To stacked */
          <>
            <div className="flex items-start gap-3 mb-1">
              <Image
                src="/ride/locationgreen.svg"
                alt="from"
                width={32}
                height={32}
                className="shrink-0 mt-1"
              />
              <div>
                <p className="text-[12px] text-gray-500 font-poppins">From</p>
                <p className="text-[16px] font-semibold text-black font-poppins">
                  {bookingState.destination.from || "Enter pickup location"}
                </p>
                <p className="text-[13px] text-black/65 font-poppins">
                  {bookingState.dateRange.pickup || "2083/02/07-08:00 AM"}
                </p>
              </div>
            </div>

            <div className="ml-4 w-px h-6 border-l-2 border-dashed border-gray-300 my-1" />

            <div className="flex items-start gap-3 mb-4">
              <Image
                src="/ride/locationred.svg"
                alt="to"
                width={32}
                height={32}
                className="shrink-0 mt-1"
              />
              <div>
                <p className="text-[12px] font-poppins">To</p>
                <p className="text-[16px] text-black font-poppins">
                  {bookingState.destination.to || "Enter drop location"}
                </p>
                <p className="text-[12px] font-poppins">
                  {bookingState.dateRange.return || "2083/02/07-08:00 AM"}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="w-full h-px bg-[#808080]/50" />

        {/* Passengers */}
        <div className="flex items-center gap-3 rounded-xl px-4 py-3">
          <Image
            src="/ride/passenger.svg"
            alt="passengers"
            width={28}
            height={28}
            className="shrink-0"
          />
          <div>
            <p className="text-[12px] text-gray-500 font-poppins">
              Total Passengers
            </p>
            <p className="text-[15px] font-semibold text-black font-poppins">
              {totalPassengers > 0
                ? `${totalPassengers} Passenger${totalPassengers !== 1 ? "s" : ""}`
                : "1 Passenger"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
