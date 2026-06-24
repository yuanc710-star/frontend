import {
  bookingStatusVariant,
  bookingStatusLabel,
} from "@/components/dashboard/participant/booking-helpers";

describe("bookingStatusVariant", () => {
  it("returns success for CONFIRMED", () => {
    expect(bookingStatusVariant("CONFIRMED")).toBe("success");
  });

  it("returns warning for WAITING_FOR_GUIDE", () => {
    expect(bookingStatusVariant("WAITING_FOR_GUIDE")).toBe("warning");
  });

  it("returns error for PENDING_PAYMENT", () => {
    expect(bookingStatusVariant("PENDING_PAYMENT")).toBe("error");
  });

  it("returns info for COMPLETED", () => {
    expect(bookingStatusVariant("COMPLETED")).toBe("info");
  });

  it("returns info for CANCELLED", () => {
    expect(bookingStatusVariant("CANCELLED")).toBe("info");
  });
});

describe("bookingStatusLabel", () => {
  it("returns 'Confirmed' for CONFIRMED", () => {
    expect(bookingStatusLabel("CONFIRMED")).toBe("Confirmed");
  });

  it("returns 'Waiting for guide' for WAITING_FOR_GUIDE", () => {
    expect(bookingStatusLabel("WAITING_FOR_GUIDE")).toBe("Waiting for guide");
  });

  it("returns 'Payment required' for PENDING_PAYMENT", () => {
    expect(bookingStatusLabel("PENDING_PAYMENT")).toBe("Payment required");
  });

  it("returns 'Completed' for COMPLETED", () => {
    expect(bookingStatusLabel("COMPLETED")).toBe("Completed");
  });

  it("returns 'Cancelled' for CANCELLED", () => {
    expect(bookingStatusLabel("CANCELLED")).toBe("Cancelled");
  });
});
