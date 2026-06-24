import { render, screen } from "@testing-library/react";
import { UpcomingToursList } from "@/components/dashboard/participant/UpcomingToursList";
import type { BookingDetail } from "@/lib/data-access";

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

describe("UpcomingToursList", () => {
  it("renders the 'Your booked tours' heading", () => {
    render(<UpcomingToursList bookings={[]} />);
    expect(screen.getByText("Your booked tours")).toBeInTheDocument();
  });

  it("has a 'View all' link to /bookings", () => {
    render(<UpcomingToursList bookings={[]} />);
    expect(screen.getByRole("link", { name: "View all" })).toHaveAttribute("href", "/bookings");
  });

  it("shows the empty state when bookings is empty", () => {
    render(<UpcomingToursList bookings={[]} />);
    expect(screen.getByText(/No upcoming tours yet/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Browse available tours" })).toBeInTheDocument();
  });

  it("renders each booking's offering title", () => {
    const bookings = [
      makeBooking({ id: "b1", offeringTitle: "Morning Walk" }),
      makeBooking({ id: "b2", offeringTitle: "Lab Tour" }),
    ];
    render(<UpcomingToursList bookings={bookings} />);
    expect(screen.getByText("Morning Walk")).toBeInTheDocument();
    expect(screen.getByText("Lab Tour")).toBeInTheDocument();
  });

  it("shows 'View request' for WAITING_FOR_GUIDE status", () => {
    render(<UpcomingToursList bookings={[makeBooking({ status: "WAITING_FOR_GUIDE" })]} />);
    expect(screen.getByRole("button", { name: "View request" })).toBeInTheDocument();
  });

  it("shows 'Complete payment' for PENDING_PAYMENT status", () => {
    render(<UpcomingToursList bookings={[makeBooking({ status: "PENDING_PAYMENT" })]} />);
    expect(screen.getByRole("button", { name: "Complete payment" })).toBeInTheDocument();
  });

  it("shows View and Reschedule buttons for CONFIRMED status", () => {
    render(<UpcomingToursList bookings={[makeBooking({ status: "CONFIRMED" })]} />);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Reschedule" })).toBeInTheDocument();
  });

  it("shows a View button for COMPLETED status", () => {
    render(<UpcomingToursList bookings={[makeBooking({ status: "COMPLETED" })]} />);
    expect(screen.getByRole("button", { name: "View" })).toBeInTheDocument();
  });
});
