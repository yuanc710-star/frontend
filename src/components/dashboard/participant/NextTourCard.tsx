import { useState } from "react";
import { Card, Button, StatusBadge } from "@/components/ui";
import type { BookingDetail } from "@/lib/data-access/types";
import { formatTourDate, formatTourTime, formatTimeUntil } from "@/lib/format";
import { bookingStatusVariant, bookingStatusLabel } from "./booking-helpers";

function JoinButton({ booking }: { booking: BookingDetail }) {
  const [now] = useState(() => Date.now());
  const start = new Date(booking.scheduledAt).getTime();
  const openAt = start - 5 * 60 * 1000;
  const closeAt = start + booking.durationMin * 60 * 1000;

  if (now >= closeAt) return null;

  const canJoin = now >= openAt;
  return (
    <Button disabled={!canJoin} className="flex-1">
      {canJoin ? "Join now" : "Join opens soon"}
    </Button>
  );
}

export function NextTourCard({ booking }: { booking: BookingDetail | null }) {
  if (!booking) {
    return (
      <Card>
        <p className="eyebrow mb-4">Next Tour</p>
        <div className="flex flex-col items-center gap-4 py-8 text-center">
          <p className="text-sm text-ink-soft">You have no upcoming tours booked.</p>
          <Button>Find a Tour</Button>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <p className="eyebrow mb-4">Next Tour</p>

      <div className="flex gap-5">
        {/* Tour image */}
        <div className="w-[130px] shrink-0 rounded-[10px] overflow-hidden bg-canvas flex items-center justify-center text-center min-h-[150px]">
          {booking.offeringImageUrl ? (
            <img
              src={booking.offeringImageUrl}
              alt={booking.offeringTitle}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[11px] text-ink-soft px-3 leading-relaxed">
              Imported editorial campus crop
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          <StatusBadge variant={bookingStatusVariant(booking.status)}>
            {bookingStatusLabel(booking.status)}
          </StatusBadge>

          <h2 className="h3 mt-2 mb-1 leading-snug">{booking.offeringTitle}</h2>
          <p className="text-sm text-ink-soft mb-4">
            {booking.universityName} · {booking.guideName}
          </p>

          {/* Date and countdown */}
          <div className="flex gap-3 mb-4">
            <div className="flex-1 rounded-[10px] border border-border bg-ivory px-3 py-2.5">
              <p className="text-[13px] font-bold text-ink">
                {formatTourDate(booking.scheduledAt, booking.timezone)}
              </p>
              <p className="text-[12px] text-ink-soft mt-0.5">
                {formatTourTime(booking.scheduledAt, booking.timezone)}
              </p>
            </div>
            <div className="flex-1 rounded-[10px] border border-border bg-ivory px-3 py-2.5">
              <p className="text-[13px] font-bold text-ink">
                {formatTimeUntil(booking.scheduledAt)}
              </p>
              <p className="text-[12px] text-ink-soft mt-0.5">Join opens 5 minutes before</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-2 mb-2">
            <JoinButton booking={booking} />
            <Button variant="secondary" className="flex-1">
              View / Manage
            </Button>
          </div>

          {/* Low-emphasis links */}
          <div className="flex gap-4 mt-1">
            <Button variant="ghost" size="sm">
              Reschedule
            </Button>
            <Button variant="ghost" size="sm">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
