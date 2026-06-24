import { render, screen } from "@testing-library/react";
import { PendingActionsCard } from "@/components/dashboard/participant/PendingActionsCard";
import type { BookingDetail, PendingActions } from "@/lib/data-access";

const EMPTY_ACTIONS: PendingActions = {
  paymentsToFinish: 0,
  waitingForGuide: 0,
  reviewsToWrite: 0,
};

function makeBooking(overrides: Partial<BookingDetail> = {}): BookingDetail {
  return {
    id: "b1",
    status: "WAITING_FOR_GUIDE",
    scheduledAt: "2099-12-01T10:00:00Z",
    timezone: "America/Los_Angeles",
    offeringId: "o1",
    offeringTitle: "Campus Tour",
    offeringImageUrl: null,
    guideName: "Jane Guide",
    guideResponseDeadline: null,
    universityName: "Test University",
    durationMin: 60,
    priceCents: 2000,
    currency: "USD",
    ...overrides,
  };
}

describe("PendingActionsCard", () => {
  it("renders the heading and eyebrow", () => {
    render(<PendingActionsCard actions={EMPTY_ACTIONS} />);
    expect(screen.getByText("Pending actions")).toBeInTheDocument();
    expect(screen.getByText("Needs your attention")).toBeInTheDocument();
  });

  it("renders all three counter labels", () => {
    render(<PendingActionsCard actions={EMPTY_ACTIONS} />);
    expect(screen.getByText("Payments to finish")).toBeInTheDocument();
    expect(screen.getByText("Waiting for guide")).toBeInTheDocument();
    expect(screen.getByText("Review to write")).toBeInTheDocument();
  });

  it("renders the numeric counter values", () => {
    const actions: PendingActions = {
      paymentsToFinish: 2,
      waitingForGuide: 1,
      reviewsToWrite: 3,
    };
    render(<PendingActionsCard actions={actions} />);
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("shows the review action item when reviewsToWrite > 0", () => {
    render(<PendingActionsCard actions={{ ...EMPTY_ACTIONS, reviewsToWrite: 1 }} />);
    expect(screen.getByText("Share your tour feedback")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Leave a Review" })).toBeInTheDocument();
  });

  it("hides the review action item when reviewsToWrite is 0", () => {
    render(<PendingActionsCard actions={EMPTY_ACTIONS} />);
    expect(screen.queryByText("Share your tour feedback")).not.toBeInTheDocument();
  });

  it("shows the guide response item when waitingForGuide > 0 and waitingBooking is set", () => {
    render(
      <PendingActionsCard
        actions={{ ...EMPTY_ACTIONS, waitingForGuide: 1 }}
        waitingBooking={makeBooking()}
      />,
    );
    expect(screen.getByText("Guide response pending")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });

  it("hides the guide response item when waitingBooking is null", () => {
    render(
      <PendingActionsCard
        actions={{ ...EMPTY_ACTIONS, waitingForGuide: 1 }}
        waitingBooking={null}
      />,
    );
    expect(screen.queryByText("Guide response pending")).not.toBeInTheDocument();
  });

  it("hides the guide response item when waitingForGuide is 0 even with a booking", () => {
    render(<PendingActionsCard actions={EMPTY_ACTIONS} waitingBooking={makeBooking()} />);
    expect(screen.queryByText("Guide response pending")).not.toBeInTheDocument();
  });

  it("shows the deadline time when guideResponseDeadline is set", () => {
    render(
      <PendingActionsCard
        actions={{ ...EMPTY_ACTIONS, waitingForGuide: 1 }}
        waitingBooking={makeBooking({
          guideName: "Jane Guide",
          guideResponseDeadline: "2099-12-01T12:00:00Z",
        })}
      />,
    );
    expect(screen.getByText(/Jane Guide has until/)).toBeInTheDocument();
  });

  it("shows fallback waiting text when guideResponseDeadline is null", () => {
    render(
      <PendingActionsCard
        actions={{ ...EMPTY_ACTIONS, waitingForGuide: 1 }}
        waitingBooking={makeBooking({ guideResponseDeadline: null })}
      />,
    );
    expect(screen.getByText(/Waiting for Jane Guide to respond/)).toBeInTheDocument();
  });
});
