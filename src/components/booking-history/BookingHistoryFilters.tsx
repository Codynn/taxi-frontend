"use client";

import { Search, ChevronDown } from "lucide-react";

const STATUS_OPTIONS = ["All Status", "Completed", "Cancelled", "Pending"];
const SORT_OPTIONS = ["latest", "oldest", "price-high", "price-low"];

interface BookingHistoryFiltersProps {
  searchQuery: string;
  onSearchChange: (v: string) => void;
  statusFilter: string;
  onStatusChange: (v: string) => void;
  sortBy: string;
  onSortChange: (v: string) => void;
}

export default function BookingHistoryFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortBy,
  onSortChange,
}: BookingHistoryFiltersProps) {
  return (
    <div className="border border-[#808080]/50 lg:rounded-full rounded-2xl p-4 flex lg:flex-row flex-col gap-3">
      {/* Search */}
      <div className="relative flex-1 bg-[#f5f5f5] rounded-full">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by vehicle Name, route"
          className="w-full  px-4 py-3 pr-12 text-[16px] font-poppins text-black placeholder:text-gray-400 outline-none border-0 focus:ring-0"
        />
        <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#808080]/50" />
      </div>

      <div className="flex  items-center gap-3 flex-wrap">
        <div className="relative bg-[#f5f5f5] rounded-full">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="appearance-none  px-4 py-2.5 pr-9 text-[16px] font-poppins text-gray-700 outline-none border-0 cursor-pointer min-w-[130px]"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-black pointer-events-none" />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[16px] text-black font-poppins">Sort By:</span>
          <div className="relative bg-[#f5f5f5] rounded-full">
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className="appearance-none  px-4 py-2.5 pr-9 text-[16px] font-poppins text-gray-700 outline-none border-0 cursor-pointer min-w-[100px]"
            >
              {SORT_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}
