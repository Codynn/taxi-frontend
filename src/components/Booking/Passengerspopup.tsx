"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import type { Passengers } from "@/types/booking.types";

interface PassengersPopupProps {
  open: boolean;
  onClose: () => void;
  passengers: Passengers;
  onConfirm: (p: Passengers) => void;
  inline?: boolean;
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
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Minus size={16} />
      </button>
      <span className="w-5 text-center text-base font-semibold font-poppins text-gray-900">
        {value}
      </span>
      <button
        onClick={() => onChange(value + 1)}
        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

function PassengersContent({
  passengers,
  onConfirm,
  onClose,
}: {
  passengers: Passengers;
  onConfirm: (p: Passengers) => void;
  onClose: () => void;
}) {
  const [adults, setAdults] = useState(passengers.adults);
  const [children, setChildren] = useState(passengers.children);

  return (
    <>
      <div className="px-6 py-5 border-b border-gray-100">
        <h3 className="text-base font-semibold font-sora text-gray-900 text-center">
          Passengers
        </h3>
      </div>

      <div className="px-6 py-6 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 font-poppins">
              Adults
            </p>
            <p className="text-xs text-gray-400 font-poppins mt-0.5">
              10+ years
            </p>
          </div>
          <Counter value={adults} onChange={setAdults} />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-900 font-poppins">
              Child
            </p>
            <p className="text-xs text-gray-400 font-poppins mt-0.5">
              Below 10 years
            </p>
          </div>
          <Counter value={children} onChange={setChildren} />
        </div>

        <div className="p-4 bg-gray-50 rounded-xl">
          <p className="text-xs font-semibold text-gray-700 font-poppins mb-2">
            Note
          </p>
          <p className="text-xs text-gray-500 font-poppins leading-relaxed">
            Children below 11 years may not require a separate fare if seated on
            a parent or guardian&apos;s lap. If a separate seat is required,
            they should be counted as an adult passenger.
          </p>
        </div>
      </div>

      <div className="px-6 pb-6 border-t border-gray-100 pt-4">
        <button
          onClick={() => {
            onConfirm({ adults, children });
            onClose();
          }}
          className="w-full bg-[#FEA800] text-black font-semibold text-sm font-poppins py-3.5 rounded-full hover:bg-[#FEA800]/90 transition-colors"
        >
          Confirm
        </button>
      </div>
    </>
  );
}

export default function PassengersPopup({
  open,
  onClose,
  passengers,
  onConfirm,
  inline = false,
}: PassengersPopupProps) {
  if (!open) return null;

  if (inline) {
    return (
      <PassengersContent
        passengers={passengers}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 z-10 overflow-hidden">
        <PassengersContent
          passengers={passengers}
          onConfirm={onConfirm}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
