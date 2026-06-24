import { Card, Button, StatusBadge, Link } from "@/components/ui";
import type { BookingDetail } from "@/lib/data-access/types";
import { formatTourDateTimeShort } from "@/lib/format";
import { bookingStatusVariant, bookingStatusLabel } from "./booking-helpers";

function TourListItemActions({ booking }: { booking: BookingDetail }) {
  switch (booking.status) {
    case "WAITING_FOR_GUIDE":
      return (
        <Button variant="secondary" size="sm">
          View request
        </Button>
      );
    case "CONFIRMED":
      return (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm">
            View
          </Button>
          <Button variant="ghost" size="sm">
            Reschedule
          </Button>
        </div>
      );
    case "PENDING_PAYMENT":
      return <Button size="sm">Complete payment</Button>;
    default:
      return (
        <Button variant="secondary" size="sm">
          View
        </Button>
      );
  }
}

function TourListItem({ booking }: { booking: BookingDetail }) {
  return (
    <li className="flex items-center justify-between gap-4 py-4">
      <div className="flex-1 min-w-0">
        <StatusBadge variant={bookingStatusVariant(booking.status)} className="mb-1.5">
          {bookingStatusLabel(booking.status)}
        </StatusBadge>
        <p className="font-bold text-ink text-[15px] truncate mt-1.5">{booking.offeringTitle}</p>
        <p className="text-sm text-ink-soft mt-0.5">
          {booking.universityName} ·{" "}
          {formatTourDateTimeShort(booking.scheduledAt, booking.timezone)}
        </p>
      </div>
      <TourListItemActions booking={booking} />
    </li>
  );
}

export function UpcomingToursList({ bookings }: { bookings: BookingDetail[] }) {
  return (
    <Card>
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="eyebrow mb-1">Upcoming</p>
          <h3 className="h3">Your booked tours</h3>
        </div>
        <Link href="/bookings" className="text-sm font-semibold mt-1">
          View all
        </Link>
      </div>

      {bookings.length === 0 ? (
        <p className="text-sm text-ink-soft py-6">
          No upcoming tours yet. <Link href="/tours">Browse available tours</Link> to get started.
        </p>
      ) : (
        <ul className="divide-y divide-border">
          {bookings.map((booking) => (
            <TourListItem key={booking.id} booking={booking} />
          ))}
        </ul>
      )}
    </Card>
  );
}
