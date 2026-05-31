"use client";

import { useState } from "react";
import type { Passengers } from "@/types/booking.types";

interface PassengersPopupProps {
  open: boolean;
  onClose: () => void;
  passengers: Passengers;
  onConfirm: (p: Passengers) => void;
}

function Counter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onChange(Math.max(0, value - 1))}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
      >
        −
      </button>
      <span className="w-4 text-center text-base font-semibold font-poppins">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg"
      >
        +
      </button>
    </div>
  );
}

export default function PassengersPopup({
  open,
  onClose,
  passengers,
  onConfirm,
}: PassengersPopupProps) {
  const [adults, setAdults] = useState(passengers.adults);
  const [children, setChildren] = useState(passengers.children);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 p-6 z-10">
        <h3 className="text-base font-semibold font-sora text-gray-900 pb-4 border-b border-gray-100">
          Passengers
        </h3>

        <div className="mt-4 flex flex-col gap-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 font-poppins">
                Adults
              </p>
              <p className="text-xs text-gray-400 font-poppins">10+ years</p>
            </div>
            <Counter value={adults} onChange={setAdults} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-900 font-poppins">
                Child
              </p>
              <p className="text-xs text-gray-400 font-poppins">
                Below 10 years
              </p>
            </div>
            <Counter value={children} onChange={setChildren} />
          </div>
        </div>

        <div className="mt-5 p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-700 font-poppins mb-1">
            Note
          </p>
          <p className="text-xs text-gray-500 font-poppins leading-relaxed">
            Children below 11 years may not require a separate fare if seated on
            a parent or guardian's lap. If a separate seat is required, they
            should be counted as an adult passenger.
          </p>
        </div>

        <button
          onClick={() => {
            onConfirm({ adults, children });
            onClose();
          }}
          className="mt-5 w-full bg-[#FEA800] text-black font-semibold text-sm font-poppins py-3 rounded-full hover:bg-[#FEA800]/90 transition-colors"
        >
          Confirm
        </button>
      </div>
    </div>
  );
}
