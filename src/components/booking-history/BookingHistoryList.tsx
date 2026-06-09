import Image from "next/image";
import VehicleFeatureBadge from "@/components/vehicles/VehicleFeatureBadge";
import { BookingRecord, BookingStatus } from "@/types/booking.types";

function StatusBadge({ status }: { status: BookingStatus }) {
  const styles: Record<BookingStatus, string> = {
    Completed: "bg-green-100 text-green-600",
    Cancelled: "bg-red-100 text-red-500",
    Pending: "bg-yellow-100 text-yellow-600",
  };
  return (
    <span
      className={`text-[12px] font-medium font-poppins px-3 py-1 rounded-full ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function BookingCardDesktop({ booking }: { booking: BookingRecord }) {
  return (
    <div className="hidden lg:flex bg-white rounded-2xl border border-[#808080]/50 overflow-hidden">
      <div className="flex flex-col justify-between p-5 w-[350px] shrink-0 ">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[12px] text-black font-poppins">
            {booking.bookingNumber}
          </span>
          <StatusBadge status={booking.status} />
        </div>
        <p className="text-[16px] font-semibold font-poppins text-black mb-4">
          {booking.from}
          <span className="mx-2 text-black">→</span>
          {booking.to}
        </p>
        <div className="flex gap-6">
          <div>
            <p className="text-[12px] text-black font-poppins mb-0.5">Pickup</p>
            <p className="text-[16px] text-black font-poppins">
              {booking.pickup}
            </p>
          </div>
          <div>
            <p className="text-[12px] text-black font-poppins mb-0.5">Return</p>
            <p className="text-[16px] text-black font-poppins">
              {booking.return}
            </p>
          </div>
        </div>
      </div>

      <div className="w-px h-35 bg-[#808080]/50 my-auto shrink-0" />

      <div className="flex flex-1 items-center gap-4 p-5  min-w-0">
        <div className="relative w-[180px] h-[110px] shrink-0 rounded-xl overflow-hidden">
          <Image
            src={`${booking.vehicle.image}`}
            alt={booking.vehicle.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <h3 className="text-[16px] font-semibold text-black font-poppins">
              {booking.vehicle.name}
            </h3>
            <p className="text-[14px] text-black font-poppins">
              {booking.vehicle.plateNumber}
            </p>
          </div>
          <div className="bg-[#f5f5f5] rounded-xl px-4 py-3 flex flex-wrap gap-x-5 gap-y-2">
            {booking.vehicle.features.map((f) => (
              <VehicleFeatureBadge
                key={f.label}
                label={f.label}
                icon={f.icon}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="w-px h-35 bg-[#808080]/50 my-auto shrink-0" />

      <div className="flex flex-col justify-center items-start px-6 py-5 shrink-0">
        <p className="text-[12px] text-black font-poppins mb-1">Paid</p>
        <p className="text-[24px] font-bold text-[#FEA800] font-poppins">
          {booking.currency} {booking.paid.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// ── Mobile Card ────────────────────────────────────────────────────────────
function BookingCardMobile({ booking }: { booking: BookingRecord }) {
  return (
    <div className="lg:hidden bg-white rounded-2xl border border-[#808080]/50 p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-[12px] text-black font-poppins">
          {booking.bookingNumber}
        </span>
        <StatusBadge status={booking.status} />
      </div>

      {/* Route */}
      <p className="text-[16px] font-semibold font-poppins text-black">
        {booking.from}
        <span className="mx-2">→</span>
        {booking.to}
      </p>

      <div className="flex gap-8">
        <div>
          <p className="text-[12px] text-black font-poppins mb-0.5">Pickup</p>
          <p className="text-[14px] text-black font-poppins">
            {booking.pickup}
          </p>
        </div>
        <div>
          <p className="text-[12px] text-black font-poppins mb-0.5">Return</p>
          <p className="text-[14px] text-black font-poppins">
            {booking.return}
          </p>
        </div>
      </div>

      <div className="h-px bg-[#808080]/50" />

      <div className="flex gap-3">
        <div className="relative w-[120px] h-[80px] shrink-0 rounded-xl overflow-hidden">
          <Image
            src={`${booking.vehicle.image}`}
            alt={booking.vehicle.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h3 className="text-[16px] font-semibold text-black font-poppins">
            {booking.vehicle.name}
          </h3>
          <p className="text-[12px] text-black font-poppins">
            {booking.vehicle.plateNumber}
          </p>
          <div className="bg-[#f5f5f5] rounded-xl px-3 py-2 flex flex-wrap gap-x-4 gap-y-1.5">
            {booking.vehicle.features.map((f) => (
              <VehicleFeatureBadge
                key={f.label}
                label={f.label}
                icon={f.icon}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="h-px bg-[#808080]/50" />

      <div>
        <p className="text-[12px] text-black font-poppins mb-0.5">Paid</p>
        <p className="text-[22px] font-bold text-[#FEA800] font-poppins">
          {booking.currency} {booking.paid.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

interface BookingHistoryListProps {
  bookings: BookingRecord[];
}

export default function BookingHistoryList({
  bookings,
}: BookingHistoryListProps) {
  if (bookings.length === 0) {
    return (
      <div className="text-center py-16 text-black font-poppins text-[16px]">
        No bookings found.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <div key={booking.id}>
          <BookingCardDesktop booking={booking} />
          <BookingCardMobile booking={booking} />
        </div>
      ))}
    </div>
  );
}
