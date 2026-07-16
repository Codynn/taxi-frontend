import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";
import { toast } from "sonner";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "AWAITING_ACCEPTANCE";

export type PaymentStatus = "UNPAID" | "PARTIALLY_PAID" | "FULLY_PAID";

export type TripType = "LONG_TRIP" | "SHORT_TRIP" | "CUSTOM_TRIP";
export type BookingType = "ROUND_TRIP" | "ONE_WAY";

export interface CreateBookingDto {
  fullName: string;
  contactNumber: string;
  email: string;
  message?: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate?: string;
  bookingType: BookingType;
  tripType: TripType;
  driverRequired: boolean;
  locationId?: string;
  vechicleId: string;
  paymentProof?: string;
}

export interface ApiBooking {
  id: string;
  fullName: string;
  contactNumber: string;
  email: string;
  message?: string;
  pickUpLocation: string;
  dropOffLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  returnDate?: string;
  bookingType: BookingType;
  tripType: TripType;
  driverRequired: boolean;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  vechicleId: string;
  paymentProof?: string | null;
  quotedPrice?: number | null;
  driverCharge?: number | null;
  vehicle?: {
    id: string;
    vechileName: string;
    vechileNumber: string;
    vechileImage: string;
    vechileFuelType: string;
    noOfSeats: number;
    hasAC: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export interface BookingListParams {
  page?: number;
  limit?: number;
  // NORMAL_TRIP is a combined backend filter matching both LONG_TRIP and
  // SHORT_TRIP, used by the merged "Normal Trip" tab in booking history.
  tripType?: TripType | "NORMAL_TRIP";
  status?: BookingStatus;
  sort?: "latest" | "oldest";
}

export interface BookingListResponse {
  success: boolean;
  data: ApiBooking[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ... types unchanged ...

// ── Create booking ──────────────────────────────────────────────
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateBookingDto) => {
      const response = await api.post<{
        success: boolean;
        data: ApiBooking;
        message: string;
      }>("booking", data);
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Booking created successfully!");
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    },
    onError: (error: Error) => {
      toast.error(
        error.message || "Failed to create booking. Please try again.",
      );
    },
  });
};

// ── Get single booking (customer, owner only) ────────────────────
export const useBookingDetail = (bookingId: string | undefined) => {
  return useQuery({
    queryKey: ["booking-detail", bookingId],
    queryFn: async () => {
      const response = await api.get<{ success: boolean; data: ApiBooking }>(
        `booking/customer/${bookingId}`,
      );
      return response.data.data;
    },
    enabled: !!bookingId,
  });
};

// ── Get my bookings (customer) ──────────────────────────────────
export const useMyBookings = (params?: BookingListParams) => {
  return useQuery({
    queryKey: ["my-bookings", params],
    queryFn: async () => {
      const response = await api.get<BookingListResponse>(
        "booking/my-bookings",
        { params: params || {} },
      );
      return response.data;
    },
  });
};
