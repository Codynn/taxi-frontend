"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DateRange } from "@/types/booking.types";
import {
  BS_MONTHS,
  BS_WEEKDAYS_SHORT,
  adToBs,
  bsToAd,
  bsMonthDays,
  dateToAdString,
  adStringToDate,
} from "@/lib/bs-date";

// Datepickerpopup.tsx — renders a Bikram Sambat (BS) calendar.
// Selection/storage stays in AD `YYYY/MM/DD` strings; only the grid is BS.

interface DatePickerPopupProps {
  open: boolean;
  onClose: () => void;
  dateRange: DateRange;
  onConfirm: (range: DateRange) => void;
  inline?: boolean;
  bookedDates?: Set<string>;
  /** Single-date mode: one calendar, picking a date replaces the selection. */
  single?: boolean;
}

const DAYS = BS_WEEKDAYS_SHORT;

const nowBsYear = adToBs(new Date()).year;
const YEARS = Array.from({ length: 11 }, (_, i) => nowBsYear + i);

interface CalendarGridProps {
  bsMonth: number;
  bsYear: number;
  pickup: string;
  returnDate: string;
  onSelect: (date: string) => void;
  bookedDates?: Set<string>;
}

function CalendarGrid({
  bsMonth,
  bsYear,
  pickup,
  returnDate,
  onSelect,
  bookedDates = new Set(),
}: CalendarGridProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysInMonth = bsMonthDays(bsYear, bsMonth);
  const firstWeekday = bsToAd(bsYear, bsMonth, 1).getDay();
  const cells: (number | null)[] = Array(firstWeekday)
    .fill(null)
    .concat(Array.from({ length: daysInMonth }, (_, i) => i + 1));

  const pickupDate = adStringToDate(pickup);
  const returnD = adStringToDate(returnDate);

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

          const dateObj = bsToAd(bsYear, bsMonth, day);
          dateObj.setHours(0, 0, 0, 0);
          const dateStr = dateToAdString(dateObj);

          const isPast = dateObj < today;
          const booked = bookedDates.has(dateStr);
          const disabled = isPast || booked;

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
              {isInRange && !disabled && (
                <div className="absolute inset-0 bg-[#FEA800]/15" />
              )}
              {isPickup && returnDate && (
                <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-[#FEA800]/15" />
              )}
              {isReturn && pickup && (
                <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-[#FEA800]/15" />
              )}

              {booked ? (
                <div className="relative z-10 w-9 h-9 flex items-center justify-center rounded-full bg-red-50">
                  <span className="text-sm font-poppins text-red-400 line-through">
                    {String(day).padStart(2, "0")}
                  </span>
                </div>
              ) : (
                <button
                  disabled={disabled}
                  onClick={() => onSelect(dateStr)}
                  className={[
                    "relative z-10 w-9 h-9 rounded-full text-md md:text-sm font-bold font-poppins transition-all flex items-center justify-center",
                    disabled
                      ? "text-gray-300 cursor-not-allowed"
                      : isSelected
                        ? "bg-[#FEA800] text-white font-semibold shadow-sm"
                        : "text-gray-700 hover:bg-[#FEA800]/20",
                  ].join(" ")}
                >
                  {String(day).padStart(2, "0")}
                </button>
              )}
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
  bookedDates = new Set(),
  single = false,
}: {
  dateRange: DateRange;
  onConfirm: (range: DateRange) => void;
  onClose: () => void;
  bookedDates?: Set<string>;
  single?: boolean;
}) {
  const nowBs = adToBs(new Date());
  const [leftMonth, setLeftMonth] = useState(nowBs.month);
  const [leftYear, setLeftYear] = useState(nowBs.year);
  const [pickup, setPickup] = useState(dateRange.pickup);
  const [returnDate, setReturnDate] = useState(single ? "" : dateRange.return);

  const rightMonth = (leftMonth + 1) % 12;
  const rightYear = leftMonth === 11 ? leftYear + 1 : leftYear;

  function handleSelect(date: string) {
    if (bookedDates.has(date)) return;
    // Single-date mode: picking a date confirms and closes immediately —
    // no separate "Done" step needed.
    if (single) {
      onConfirm({ pickup: date, return: "" });
      onClose();
      return;
    }
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
      <div className="px-2 pt-6 pb-4">
        <div className="flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={handlePrev}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft size={24} className="text-[#000000]" />
          </button>

          <div className="flex flex-1 items-center justify-around gap-1">
            <div className="flex items-center gap-2">
              <select
                value={leftMonth}
                onChange={(e) => setLeftMonth(Number(e.target.value))}
                className="text-md md:text-sm  font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                {BS_MONTHS.map((m, i) => (
                  <option key={m} value={i}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={leftYear}
                onChange={(e) => setLeftYear(Number(e.target.value))}
                className="text-md md:text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none cursor-pointer"
              >
                {YEARS.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {!single && (
              <div className="hidden sm:flex items-center gap-1">
                <select
                  value={rightMonth}
                  disabled
                  className="text-sm font-semibold font-poppins text-gray-900 bg-transparent border border-gray-200 rounded-lg px-3 py-1.5 outline-none"
                >
                  {BS_MONTHS.map((m, i) => (
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
            )}
          </div>

          <button
            type="button"
            onClick={handleNext}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowRight size={24} className="text-[#000000]" />
          </button>
        </div>
      </div>

      <div className="flex gap-0 px-8 pb-6">
        <CalendarGrid
          bsMonth={leftMonth}
          bsYear={leftYear}
          pickup={pickup}
          returnDate={returnDate}
          onSelect={handleSelect}
          bookedDates={bookedDates}
        />
        {!single && (
          <>
            <div className="hidden sm:block w-px bg-gray-100 mx-6" />
            <div className="hidden sm:block flex-1">
              <CalendarGrid
                bsMonth={rightMonth}
                bsYear={rightYear}
                pickup={pickup}
                returnDate={returnDate}
                onSelect={handleSelect}
                bookedDates={bookedDates}
              />
            </div>
          </>
        )}
      </div>

      {/* Single mode confirms and closes as soon as a date is picked. */}
      {!single && (
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
      )}
    </>
  );
}

export default function DatePickerPopup({
  open,
  onClose,
  dateRange,
  onConfirm,
  inline = false,
  bookedDates = new Set(),
  single = false,
}: DatePickerPopupProps) {
  if (!open) return null;

  const content = (
    <DatePickerContent
      dateRange={dateRange}
      onConfirm={onConfirm}
      onClose={onClose}
      bookedDates={bookedDates}
      single={single}
    />
  );

  if (inline) return content;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div
        className={`relative bg-white rounded-2xl shadow-2xl w-full ${
          single ? "max-w-md" : "max-w-3xl"
        } mx-4 z-10 overflow-hidden`}
      >
        {content}
      </div>
    </div>
  );
}
