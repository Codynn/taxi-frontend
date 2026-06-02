"use client";

import { useState } from "react";
import {
  TRIP_TABS,
  DEFAULT_BOOKING_STATE,
} from "@/constants/booking.constants";
import type { TripTab, BookingFormState } from "@/types/booking.types";
import BookingForm from "./Bookingform";

export default function BookingSection() {
  const [activeTab, setActiveTab] = useState<TripTab>("long");
  const [formState, setFormState] = useState<BookingFormState>(
    DEFAULT_BOOKING_STATE,
  );

  return (
    <div className="absolute  z-10 w-full flex justify-center mt-10 px-4 sm:px-6 lg:px-8 -translate-y-1/2">
      <div className="w-full max-w-6xl shadow-xl rounded-2xl overflow-visible">
        <div className="flex bg-[#F5F5F5] rounded-t-2xl overflow-hidden">
          {TRIP_TABS.map((tab, i) => {
            const isActive = activeTab === tab.value;
            const isFirst = i === 0;
            const isLast = i === TRIP_TABS.length - 1;

            return (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  setFormState({ ...formState, tripTab: tab.value });
                }}
                className={[
                  "flex-1 py-4 text-sm font-semibold font-poppins transition-all duration-200 relative",
                  isActive
                    ? "bg-white text-gray-900 z-10"
                    : "bg-[#F5F5F5] text-gray-400 hover:text-gray-600",
                  isActive && isFirst ? "rounded-tl-2xl" : "",
                  isActive && isLast ? "rounded-tr-2xl" : "",
                  !isActive && isFirst ? "rounded-tl-2xl" : "",
                  !isActive && isLast ? "rounded-tr-2xl" : "",
                ].join(" ")}
              >
                {tab.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-white" />
                )}
              </button>
            );
          })}
        </div>

        <div className="bg-white px-5 sm:px-6 py-6 rounded-b-2xl overflow-visible">
          <BookingForm
            tripTab={activeTab}
            state={formState}
            onChange={setFormState}
          />
        </div>
      </div>
    </div>
  );
}
