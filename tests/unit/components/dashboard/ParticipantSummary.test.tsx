import { render, screen } from "@testing-library/react";
import { ParticipantSummary } from "@/components/dashboard/ParticipantSummary";
import type { ParticipantDashboard, BookingDetail, RecommendedOffering } from "@/lib/data-access";

function makeBooking(overrides: Partial<BookingDetail> = {}): BookingDetail {
  return {
    id: "b1",
    status: "CONFIRMED",
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

function makeOffering(id = "o1"): RecommendedOffering {
  return {
    id,
    title: `Offering ${id}`,
    imageUrl: null,
    isVerifiedGuide: false,
    durationMin: 30,
    priceCents: 1500,
    currency: "USD",
    universityName: "Test U",
  };
}

function makeData(overrides: Partial<ParticipantDashboard> = {}): ParticipantDashboard {
  return {
    kind: "participant",
    participant: { displayName: "Grace Hopper" },
    nextTour: null,
    upcomingBookings: [],
    pendingActions: { paymentsToFinish: 0, waitingForGuide: 0, reviewsToWrite: 0 },
    recommendedOfferings: [],
    createdAt: "2025-03-15T00:00:00Z",
    ...overrides,
  };
}

describe("ParticipantSummary", () => {
  it("renders the welcome heading with displayName", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(screen.getByText("Welcome back, Grace Hopper.")).toBeInTheDocument();
  });

  it("renders 'Welcome back.' when displayName is absent", () => {
    render(<ParticipantSummary data={makeData({ participant: {} })} />);
    expect(screen.getByText("Welcome back.")).toBeInTheDocument();
  });

  it("renders the lead paragraph", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(
      screen.getByText(
        "Manage your next tour, finish anything that needs attention, and keep exploring.",
      ),
    ).toBeInTheDocument();
  });

  it("always renders the NextTourCard section", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(screen.getByText("Next Tour")).toBeInTheDocument();
  });

  it("always renders the UpcomingToursList section", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(screen.getByText("Your booked tours")).toBeInTheDocument();
  });

  it("always renders the PendingActionsCard section", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(screen.getByText("Pending actions")).toBeInTheDocument();
  });

  it("always renders the PastToursCard section", () => {
    render(<ParticipantSummary data={makeData()} />);
    expect(screen.getByText("Your past tours")).toBeInTheDocument();
  });

  it("renders RecommendedSection when recommendedOfferings is non-empty", () => {
    render(<ParticipantSummary data={makeData({ recommendedOfferings: [makeOffering("o1")] })} />);
    expect(screen.getByText("Keep exploring")).toBeInTheDocument();
  });

  it("omits RecommendedSection when recommendedOfferings is empty", () => {
    render(<ParticipantSummary data={makeData({ recommendedOfferings: [] })} />);
    expect(screen.queryByText("Keep exploring")).not.toBeInTheDocument();
  });

  it("omits RecommendedSection when recommendedOfferings is absent", () => {
    const data = makeData();
    delete data.recommendedOfferings;
    render(<ParticipantSummary data={data} />);
    expect(screen.queryByText("Keep exploring")).not.toBeInTheDocument();
  });

  it("passes the WAITING_FOR_GUIDE booking as waitingBooking to PendingActionsCard", () => {
    const waitingBooking = makeBooking({
      status: "WAITING_FOR_GUIDE",
      guideName: "Alex Kim",
    });
    render(
      <ParticipantSummary
        data={makeData({
          upcomingBookings: [waitingBooking],
          pendingActions: { paymentsToFinish: 0, waitingForGuide: 1, reviewsToWrite: 0 },
        })}
      />,
    );
    expect(screen.getByText("Guide response pending")).toBeInTheDocument();
    expect(screen.getByText(/Alex Kim/)).toBeInTheDocument();
  });

  it("passes nextTour to NextTourCard", () => {
    render(
      <ParticipantSummary
        data={makeData({ nextTour: makeBooking({ offeringTitle: "Night Walk" }) })}
      />,
    );
    expect(screen.getByText("Night Walk")).toBeInTheDocument();
  });
});
