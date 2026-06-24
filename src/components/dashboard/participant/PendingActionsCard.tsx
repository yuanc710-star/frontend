import type { ReactNode } from "react";
import { Card, Button } from "@/components/ui";
import type { BookingDetail, PendingActions } from "@/lib/data-access/types";
import { formatTourTime } from "@/lib/format";

function CounterBox({ count, label }: { count: number; label: string }) {
  return (
    <div className="flex-1 flex flex-col items-center gap-1 rounded-[10px] bg-ivory border border-border py-3 px-2 text-center">
      <span className="text-2xl font-bold text-ink">{count}</span>
      <span className="text-[12px] text-ink-soft leading-tight">{label}</span>
    </div>
  );
}

function ActionItem({
  label,
  description,
  children,
}: {
  label: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 rounded-[10px] border border-border p-3">
      <div className="flex items-start gap-2.5 flex-1 min-w-0">
        <span className="mt-[5px] h-2 w-2 shrink-0 rounded-full bg-warning" />
        <div>
          <p className="text-[13px] font-bold text-ink">{label}</p>
          <p className="text-[12px] text-ink-soft mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

interface PendingActionsCardProps {
  actions: PendingActions;
  waitingBooking?: BookingDetail | null;
}

export function PendingActionsCard({ actions, waitingBooking }: PendingActionsCardProps) {
  const showReview = actions.reviewsToWrite > 0;
  const showGuideResponse = actions.waitingForGuide > 0 && !!waitingBooking;

  return (
    <Card>
      <p className="eyebrow mb-1">Needs your attention</p>
      <h3 className="h3 mb-4">Pending actions</h3>

      <div className="flex gap-2 mb-4">
        <CounterBox count={actions.paymentsToFinish} label="Payments to finish" />
        <CounterBox count={actions.waitingForGuide} label="Waiting for guide" />
        <CounterBox count={actions.reviewsToWrite} label="Review to write" />
      </div>

      {(showReview || showGuideResponse) && (
        <div className="flex flex-col gap-3">
          {showReview && (
            <ActionItem
              label="Share your tour feedback"
              description="Your tour is ready to review."
            >
              <Button variant="secondary" size="sm">
                Leave a Review
              </Button>
            </ActionItem>
          )}

          {showGuideResponse && waitingBooking && (
            <ActionItem
              label="Guide response pending"
              description={
                waitingBooking.guideResponseDeadline
                  ? `${waitingBooking.guideName} has until ${formatTourTime(waitingBooking.guideResponseDeadline, waitingBooking.timezone)} to respond.`
                  : `Waiting for ${waitingBooking.guideName} to respond.`
              }
            >
              <Button variant="secondary" size="sm">
                View
              </Button>
            </ActionItem>
          )}
        </div>
      )}
    </Card>
  );
}
