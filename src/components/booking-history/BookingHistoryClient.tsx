"use client";

import { useState } from "react";
import Navbar from "@/components/layout/navbar";
import { BookingRecord, TripTab } from "@/types/booking.types";
import BookingHistoryHeader from "./BookingHistoryHeader";
import BookingHistoryFilters from "./BookingHistoryFilters";
import BookingHistoryTabs from "./BookingHistoryTabs"; // 👈 add
import BookingHistoryPagination from "./BookingHistoryPagination";
import BookingHistoryList from "./BookingHistoryList";

interface BookingHistoryClientProps {
  initialBookings: BookingRecord[];
}

const ITEMS_PER_PAGE = 6;
const TOTAL_PAGES = 20;

export default function BookingHistoryClient({
  initialBookings,
}: BookingHistoryClientProps) {
  const [activeTab, setActiveTab] = useState<TripTab>("long");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [sortBy, setSortBy] = useState("latest");
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = initialBookings.filter((b) => {
    const matchesTab = b.tripType === activeTab;
    const matchesStatus =
      statusFilter === "All Status" || b.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      b.vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.to.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesStatus && matchesSearch;
  });

  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const totalPages = Math.max(
    TOTAL_PAGES,
    Math.ceil(filtered.length / ITEMS_PER_PAGE),
  );

  return (
    <main className="w-full bg-white min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col gap-6">
        <BookingHistoryHeader />
        <BookingHistoryFilters
          searchQuery={searchQuery}
          onSearchChange={(v) => {
            setSearchQuery(v);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusChange={(v) => {
            setStatusFilter(v);
            setCurrentPage(1);
          }}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <BookingHistoryTabs
          activeTab={activeTab}
          onChange={(v) => {
            setActiveTab(v);
            setCurrentPage(1);
          }}
        />
        <BookingHistoryList bookings={paginated} />
        {filtered.length > 0 && (
          <BookingHistoryPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>
    </main>
  );
}
