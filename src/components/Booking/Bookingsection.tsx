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
    <div className="absolute top-200 left-1/2 -translate-x-1/2 -translate-y-1/2  z-20 -mt-6 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-2xl shadow-1xl overflow-hidden">
        <div className="flex border-b border-gray-100">
          {TRIP_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value);
                setFormState({ ...formState, tripTab: tab.value });
              }}
              className={`flex-1 py-4 text-sm font-semibold font-poppins transition-colors ${
                activeTab === tab.value
                  ? "text-gray-900 border-b-2 border-gray-900"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-5 sm:p-6">
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
