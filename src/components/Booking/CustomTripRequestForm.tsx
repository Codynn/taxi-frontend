"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useCreateBooking } from "@/lib/api/booking.api";
import { BookingModalData } from "@/hooks/useBookingStore";
import { useAuthStore } from "@/store/useAuthStore";
import {
  isBookingDateValid,
  BOOKING_DATE_INVALID_MESSAGE,
} from "@/lib/bookingDateValidation";

interface CustomTripRequestFormProps {
  defaultValues?: {
    pickupLocation?: string;
    dropoffLocation?: string;
  };
  vehicleId: string;
  modalData: BookingModalData;
}

export default function CustomTripRequestForm({
  defaultValues,
  vehicleId,
  modalData,
}: CustomTripRequestFormProps) {
  const router = useRouter();
  const { mutate: createBooking, isPending } = useCreateBooking();
  const { user, _hasHydrated } = useAuthStore();

  const [form, setForm] = useState({
    fullName: user?.name ?? "",
    contactNumber: user?.phoneNumber ?? "",
    email: user?.email ?? "",
    pickupLocation: defaultValues?.pickupLocation ?? "",
    message: "",
  });

  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const set = (key: keyof typeof form, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<typeof form> = {};
    if (!form.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!form.contactNumber.trim())
      newErrors.contactNumber = "Contact number is required";
    if (!form.pickupLocation.trim())
      newErrors.pickupLocation = "Pickup location is required";
    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!isBookingDateValid(modalData)) {
      toast.error(BOOKING_DATE_INVALID_MESSAGE);
      return;
    }

    createBooking(
      {
        fullName: form.fullName,
        contactNumber: form.contactNumber,
        email: form.email,
        message: form.message,
        pickUpLocation: form.pickupLocation,
        dropOffLocation: modalData.dropOffLocation,
        pickUpDate: modalData.pickUpDate,
        pickUpTime: modalData.pickUpDate, // fallback
        returnDate: modalData.returnDate || undefined,
        bookingType: modalData.bookingType,
        tripType: "CUSTOM_TRIP",
        driverRequired: modalData.driverRequired,
        vechicleId: vehicleId,
      },
      {
        onSuccess: () => {
          window.location.href = "/my-bookings";
        },
        onError: () => {
          toast.error(errors.message);
        },
      },
    );
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-[14px] font-poppins text-gray-800 placeholder:text-gray-400 outline-none focus:border-[#FEA800] transition-colors";
  const errorClass = "text-red-500 text-[12px] font-poppins mt-1";

  return (
    <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
      <h2 className="text-[18px] font-semibold font-poppins text-gray-900">
        Complete Your Booking Details
      </h2>

      <div>
        <label className="text-[13px] font-medium font-poppins text-gray-700 mb-1.5 block">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          className={inputClass}
          placeholder="Eg. John Doe"
          value={form.fullName}
          onChange={(e) => set("fullName", e.target.value)}
        />
        {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-[13px] font-medium font-poppins text-gray-700 mb-1.5 block">
            Contact Number <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass}
            placeholder="Enter your number"
            value={form.contactNumber}
            onChange={(e) => set("contactNumber", e.target.value)}
          />
          {errors.contactNumber && (
            <p className={errorClass}>{errors.contactNumber}</p>
          )}
        </div>
        <div>
          <label className="text-[13px] font-medium font-poppins text-gray-700 mb-1.5 block">
            Email
          </label>
          <input
            className={inputClass}
            placeholder="Eg. JohnDoe@gmail.com"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="text-[13px] font-medium font-poppins text-gray-700 mb-1.5 block">
          Pickup Location <span className="text-red-500">*</span>
        </label>
        <input
          className={inputClass}
          placeholder="Enter pickup location"
          value={form.pickupLocation}
          onChange={(e) => set("pickupLocation", e.target.value)}
        />
        {errors.pickupLocation && (
          <p className={errorClass}>{errors.pickupLocation}</p>
        )}
      </div>

      <div>
        <label className="text-[13px] font-medium font-poppins text-gray-700 mb-1.5 block">
          Message
        </label>
        <textarea
          className={`${inputClass} resize-none`}
          rows={4}
          placeholder="Enter your Message Here"
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={isPending}
        className="w-fit bg-[#FEA800] text-black font-semibold text-[14px] font-poppins px-8 py-3 rounded-full hover:bg-[#e09700] transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
        Request Custom Trip
      </button>
    </div>
  );
}
