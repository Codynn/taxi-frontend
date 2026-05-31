"use client";

import { useState } from "react";
import type { DateRange } from "@/types/booking.types";

interface DatePickerPopupProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onConfirm: (range: DateRange) => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

interface CalendarProps {
  month: number;
  year: number;
  selected: string;
  onSelect: (date: string) => void;
}

function Calendar({ month, year, selected, onSelect }: CalendarProps) {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const cells = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  return (
    <div className="flex-1 min-w-0">
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs text-gray-400 font-poppins py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateStr = `${year}/${String(month + 1).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
          const isSelected = selected === dateStr;
          return (
            <button
              key={i}
              onClick={() => onSelect(dateStr)}
              className={`w-8 h-8 mx-auto rounded-full text-sm font-poppins transition-colors flex items-center justify-center ${
                isSelected
                  ? "bg-[#FEA800] text-white font-semibold"
                  : "text-gray-700 hover:bg-[#FEA800]/10"
              }`}
            >
              {String(day).padStart(2, "0")}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function DatePickerPopup({
  open,
  onClose,
  dateRange,
  onConfirm,
}: DatePickerPopupProps) {
  const now = new Date();
  const [leftMonth, setLeftMonth] = useState(now.getMonth());
  const [leftYear, setLeftYear] = useState(now.getFullYear());
  const [pickup, setPickup] = useState(dateRange.pickup);
  const [returnDate, setReturnDate] = useState(dateRange.return);

  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 p-6 z-10">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => {
              if (leftMonth === 0) {
                setLeftMonth(11);
                setLeftYear((y) => y - 1);
              } else setLeftMonth((m) => m - 1);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ‹
          </button>

          <div className="flex flex-1 justify-around">
            <div className="flex items-center gap-2">
              <select
                value={leftMonth}
                onChange={(e) => setLeftMonth(Number(e.target.value))}
                className="text-sm font-semibold font-poppins border-none outline-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={leftYear}
                onChange={(e) => setLeftYear(Number(e.target.value))}
                className="text-sm font-semibold font-poppins border-none outline-none"
              >
                {Array.from({ length: 5 }, (_, i) => now.getFullYear() + i).map(
                  (y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ),
                )}
              </select>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-semibold font-poppins">
                {MONTHS[rightMonth]}
              </span>
              <span className="text-sm font-semibold font-poppins">
                {rightYear}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              if (leftMonth === 11) {
                setLeftMonth(0);
                setLeftYear((y) => y + 1);
              } else setLeftMonth((m) => m + 1);
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
          >
            ›
          </button>
        </div>

        <div className="flex gap-6">
          <Calendar
            month={leftMonth}
            year={leftYear}
            selected={pickup}
            onSelect={setPickup}
          />
          <div className="hidden sm:block w-px bg-gray-100" />
          <div className="hidden sm:block flex-1">
            <Calendar
              month={rightMonth}
              year={rightYear}
              selected={returnDate}
              onSelect={setReturnDate}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
          <button
            onClick={() => {
              setPickup("");
              setReturnDate("");
            }}
            className="px-6 py-2 text-sm font-semibold font-poppins text-gray-700 border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => {
              onConfirm({ pickup, return: returnDate });
              onClose();
            }}
            className="px-6 py-2 text-sm font-semibold font-poppins text-black bg-[#FEA800] rounded-full hover:bg-[#FEA800]/90 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
