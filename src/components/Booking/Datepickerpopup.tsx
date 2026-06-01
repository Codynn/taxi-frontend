"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DateRange } from "@/types/booking.types";

interface DatePickerPopupProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onConfirm: (range: DateRange) => void;
  inline?: boolean; // ← add this
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
const YEARS = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() + i,
);

function getDaysInMonth(month: number, year: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(month: number, year: number) {
  return new Date(year, month, 1).getDay();
}

function toDateObj(str: string): Date | null {
  if (!str) return null;
  const [y, m, d] = str.split("/").map(Number);
  return new Date(y, m - 1, d);
}

function toStr(date: Date): string {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}`;
}

interface CalendarGridProps {
  month: number;
  year: number;
  pickup: string;
  returnDate: string;
  onSelect: (date: string) => void;
}

function CalendarGrid({
  month,
  year,
  pickup,
  returnDate,
  onSelect,
}: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(month, year);
  const firstDay = getFirstDayOfMonth(month, year);
  const cells: (number | null)[] = Array(firstDay)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const pickupDate = toDateObj(pickup);
  const returnD = toDateObj(returnDate);

  return (
    <div className="flex-1">
      <div className="grid grid-cols-7 mb-3">
        {DAYS.map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-gray-400 font-poppins py-1"
          >
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, i) => {
          if (!day) return <div key={i} className="h-10" />;

          const dateObj = new Date(year, month, day);
          const dateStr = toStr(dateObj);

          const isPickup = pickup === dateStr;
          const isReturn = returnDate === dateStr;
          const isSelected = isPickup || isReturn;

          const isInRange =
            pickupDate && returnD && dateObj > pickupDate && dateObj < returnD;

          return (
            <div
              key={i}
              className="relative flex items-center justify-center h-10"
            >
              {isInRange && (
                <div className="absolute inset-0 bg-[#FEA800]/15" />
              )}
              {isPickup && returnDate && (
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FEA800]/15" />
              )}
              {isReturn && pickup && (
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#FEA800]/15" />
              )}
              <button
                onClick={() => onSelect(dateStr)}
                className={[
                  "relative z-10 w-9 h-9 rounded-full text-sm font-poppins transition-all flex items-center justify-center",
                  isSelected
                    ? "bg-[#FEA800] text-white font-semibold shadow-sm"
                    : "text-gray-700 hover:bg-[#FEA800]/20",
                ].join(" ")}
              >
                {String(day).padStart(2, "0")}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DatePickerContent({
  dateRange,
  onConfirm,
  onClose,
}: {
  dateRange: DateRange;
  onConfirm: (range: DateRange) => void;
  onClose: () => void;
}) {
  const now = new Date();
  const [leftMonth, setLeftMonth] = useState(now.getMonth());
  const [leftYear, setLeftYear] = useState(now.getFullYear());
  const [pickup, setPickup] = useState(dateRange.pickup);
  const [returnDate, setReturnDate] = useState(dateRange.return);

  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  function handleSelect(date: string) {
    if (!pickup || (pickup && returnDate)) {
      setPickup(date);
      setReturnDate("");
    } else {
      if (date < pickup) {
        setReturnDate(pickup);
        setPickup(date);
      } else {
        setReturnDate(date);
      }
    }
  }

  function handlePrev() {
    if (leftMonth === 0) {
      setLeftMonth(11);
      setLeftYear((y) => y - 1);
    } else setLeftMonth((m) => m - 1);
  }

  function handleNext() {
    if (leftMonth === 11) {
      setLeftMonth(0);
      setLeftYear((y) => y + 1);
    } else setLeftMonth((m) => m + 1);
  }

  return (
    <>
      <div className="px-8 pt-6 pb-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handlePrev}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft size={24} className="text-[#000000]" />
          </button>

          <div className="flex flex-1 items-center justify-around gap-4">
            <div className="flex items-center gap-2">
              <select
                value={leftMonth}
                onChange={(e) => setLeftMonth(Number(e.target.value))}
                className="text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
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
                className="text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <select
                value={rightMonth}
                disabled
                className="text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={rightYear}
                disabled
                className="text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowRight size={24} className="text-[#000000]" />
          </button>
        </div>
      </div>

      <div className="flex gap-0 px-8 pb-6">
        <CalendarGrid
          month={leftMonth}
          year={leftYear}
          pickup={pickup}
          returnDate={returnDate}
          onSelect={handleSelect}
        />
        <div className="hidden sm:block w-px bg-gray-100 mx-6" />
        <div className="hidden sm:block flex-1">
          <CalendarGrid
            month={rightMonth}
            year={rightYear}
            pickup={pickup}
            returnDate={returnDate}
            onSelect={handleSelect}
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-100">
        <button
          onClick={() => {
            setPickup("");
            setReturnDate("");
          }}
          className="px-7 py-2.5 text-sm font-semibold font-poppins text-[#FEA800] border border-[#FEA800] rounded-full hover:bg-gray-50 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={() => {
            onConfirm({ pickup, return: returnDate });
            onClose();
          }}
          className="px-10 py-2.5 text-sm font-semibold font-poppins text-black bg-[#FEA800] rounded-full hover:bg-[#FEA800]/90 transition-colors"
        >
          Done
        </button>
      </div>
    </>
  );
}

export default function DatePickerPopup({
  open,
  onClose,
  dateRange,
  onConfirm,
  inline = false, // ← add this
}: DatePickerPopupProps) {
  if (!open) return null;

  if (inline) {
    return (
      <DatePickerContent
        dateRange={dateRange}
        onConfirm={onConfirm}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl mx-4 z-10 overflow-hidden">
        <DatePickerContent
          dateRange={dateRange}
          onConfirm={onConfirm}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
