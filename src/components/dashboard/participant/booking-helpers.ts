import type { BookingStatus } from "@/lib/data-access/types";
import type { StatusVariant } from "@/components/ui";

export function bookingStatusVariant(status: BookingStatus): StatusVariant {
  switch (status) {
    case "CONFIRMED":
      return "success";
    case "WAITING_FOR_GUIDE":
      return "warning";
    case "PENDING_PAYMENT":
      return "error";
    default:
      return "info";
  }
}

export function bookingStatusLabel(status: BookingStatus): string {
  switch (status) {
    case "CONFIRMED":
      return "Confirmed";
    case "WAITING_FOR_GUIDE":
      return "Waiting for guide";
    case "PENDING_PAYMENT":
      return "Payment required";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
  }
}
