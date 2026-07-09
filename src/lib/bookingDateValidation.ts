import type { BookingModalData } from "@/hooks/useBookingStore";

/**
 * The date/location selection made earlier in the booking flow is persisted
 * in localStorage and can go stale if the user leaves and returns much later
 * (their chosen pickup date may now be in the past). Re-validate before
 * letting the user proceed instead of only failing later with a confusing
 * backend error ("pickUpDate cannot be in the past").
 */
export function isBookingDateValid(modalData: BookingModalData): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pickUpDate = new Date(modalData.pickUpDate);
  pickUpDate.setHours(0, 0, 0, 0);
  if (isNaN(pickUpDate.getTime()) || pickUpDate < today) return false;

  if (modalData.returnDate) {
    const returnDate = new Date(modalData.returnDate);
    returnDate.setHours(0, 0, 0, 0);
    if (isNaN(returnDate.getTime()) || returnDate < pickUpDate) return false;
  }

  return true;
}

export const BOOKING_DATE_INVALID_MESSAGE =
  "Your chosen pickup date is invalid — it may be in the past. Please go back and select a new date.";
