import { SectionHeading, Link } from "@/components/ui";
import type { ParticipantDashboard, PendingActions } from "@/lib/data-access";
import { NextTourCard } from "./participant/NextTourCard";
import { UpcomingToursList } from "./participant/UpcomingToursList";
import { PendingActionsCard } from "./participant/PendingActionsCard";
import { RecommendedSection } from "./participant/RecommendedSection";
import { PastToursCard } from "./participant/PastToursCard";

const EMPTY_ACTIONS: PendingActions = {
  paymentsToFinish: 0,
  waitingForGuide: 0,
  reviewsToWrite: 0,
};

/**
 * Participant dashboard slice — presentational. The /v1/dashboard aggregate already
 * composed everything (DashboardPage fetches once and branches on `kind`), so this
 * only renders its slice; no data fetching here. Sibling of GuideSummary.
 */
export function ParticipantSummary({ data }: { data: ParticipantDashboard }) {
  const p = data.participant;
  const nextTour = data.nextTour ?? null;
  const upcomingBookings = data.upcomingBookings ?? [];
  const pendingActions = data.pendingActions ?? EMPTY_ACTIONS;
  const recommendedOfferings = data.recommendedOfferings ?? [];

  const waitingBooking = upcomingBookings.find((b) => b.status === "WAITING_FOR_GUIDE") ?? null;

  return (
    <div>
      {/* Welcome header */}
      <div className="flex items-start justify-between mb-8">
        <SectionHeading
          eyebrow="Participant Dashboard"
          title={`Welcome back${p.displayName ? `, ${p.displayName}` : ""}.`}
          lead="Manage your next tour, finish anything that needs attention, and keep exploring."
        />
        <Link href="/tours" variant="primary" className="shrink-0 mt-2">
          Find a Tour
        </Link>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-[1fr_300px] gap-6 items-start">
        {/* Left column: booking timeline + recommendations */}
        <div className="flex flex-col gap-6">
          <NextTourCard booking={nextTour} />
          <UpcomingToursList bookings={upcomingBookings} />
          <RecommendedSection offerings={recommendedOfferings} />
        </div>

        {/* Right column: attention items + history */}
        <div className="flex flex-col gap-6">
          <PendingActionsCard actions={pendingActions} waitingBooking={waitingBooking} />
          <PastToursCard />
        </div>
      </div>
    </div>
  );
}
