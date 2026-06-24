import { render, screen } from "@testing-library/react";
import { NextTourCard } from "@/components/dashboard/participant/NextTourCard";
import type { BookingDetail } from "@/lib/data-access";

function makeBooking(overrides: Partial<BookingDetail> = {}): BookingDetail {
  return {
    id: "b1",
    status: "CONFIRMED",
    // Far-future date: join window not yet open.
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

describe("NextTourCard", () => {
  it("renders the 'Next Tour' label", () => {
    render(<NextTourCard booking={null} />);
    expect(screen.getByText("Next Tour")).toBeInTheDocument();
  });

  it("shows the empty state when booking is null", () => {
    render(<NextTourCard booking={null} />);
    expect(screen.getByText("You have no upcoming tours booked.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Find a Tour" })).toBeInTheDocument();
  });

  it("renders the offering title when a booking is provided", () => {
    render(<NextTourCard booking={makeBooking()} />);
    expect(screen.getByText("Campus Tour")).toBeInTheDocument();
  });

  it("renders the guide and university meta line", () => {
    render(<NextTourCard booking={makeBooking()} />);
    expect(screen.getByText(/Test University/)).toBeInTheDocument();
    expect(screen.getByText(/Jane Guide/)).toBeInTheDocument();
  });

  it("shows the 'Confirmed' status badge for a CONFIRMED booking", () => {
    render(<NextTourCard booking={makeBooking({ status: "CONFIRMED" })} />);
    expect(screen.getByText("Confirmed")).toBeInTheDocument();
  });

  it("shows 'Waiting for guide' badge for a WAITING_FOR_GUIDE booking", () => {
    render(<NextTourCard booking={makeBooking({ status: "WAITING_FOR_GUIDE" })} />);
    expect(screen.getByText("Waiting for guide")).toBeInTheDocument();
  });

  it("shows a disabled 'Join opens soon' button for a far-future booking", () => {
    render(<NextTourCard booking={makeBooking()} />);
    const btn = screen.getByRole("button", { name: "Join opens soon" });
    expect(btn).toBeDisabled();
  });

  it("does not render a join button once the tour has ended", () => {
    // scheduledAt in the past + short duration means the tour is long over.
    render(
      <NextTourCard
        booking={makeBooking({
          scheduledAt: "2020-01-01T10:00:00Z",
          durationMin: 60,
        })}
      />,
    );
    expect(screen.queryByRole("button", { name: /join/i })).not.toBeInTheDocument();
  });

  it("renders an image when offeringImageUrl is set", () => {
    render(
      <NextTourCard
        booking={makeBooking({
          offeringImageUrl: "https://example.com/campus.jpg",
          offeringTitle: "Campus Tour",
        })}
      />,
    );
    const img = screen.getByRole("img", { name: "Campus Tour" });
    expect(img).toHaveAttribute("src", "https://example.com/campus.jpg");
  });
});
