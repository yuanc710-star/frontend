import { render, screen } from "@testing-library/react";
import { OfferingCard } from "@/components/tours/OfferingCard";
import type { RecommendedOffering } from "@/lib/data-access";

function makeOffering(overrides: Partial<RecommendedOffering> = {}): RecommendedOffering {
  return {
    id: "o1",
    title: "Campus Engineering Tour",
    imageUrl: null,
    isVerifiedGuide: true,
    durationMin: 45,
    priceCents: 3200,
    currency: "USD",
    universityName: "Test University",
    ...overrides,
  };
}

describe("OfferingCard", () => {
  it("renders the title as a heading", () => {
    render(<OfferingCard offering={makeOffering()} />);
    expect(screen.getByRole("heading", { name: "Campus Engineering Tour" })).toBeInTheDocument();
  });

  it("shows the duration", () => {
    render(<OfferingCard offering={makeOffering({ durationMin: 45 })} />);
    expect(screen.getByText(/45 min/)).toBeInTheDocument();
  });

  it("shows the formatted price", () => {
    render(<OfferingCard offering={makeOffering({ priceCents: 3200, currency: "USD" })} />);
    expect(screen.getByText(/\$32/)).toBeInTheDocument();
  });

  it("shows the 'Verified guide' badge when isVerifiedGuide is true", () => {
    render(<OfferingCard offering={makeOffering({ isVerifiedGuide: true })} />);
    expect(screen.getByText("Verified guide")).toBeInTheDocument();
  });

  it("omits the 'Verified guide' badge when isVerifiedGuide is false", () => {
    render(<OfferingCard offering={makeOffering({ isVerifiedGuide: false })} />);
    expect(screen.queryByText("Verified guide")).not.toBeInTheDocument();
  });

  it("renders an image when imageUrl is provided", () => {
    render(
      <OfferingCard
        offering={makeOffering({
          imageUrl: "https://example.com/campus.jpg",
          title: "Campus Tour",
        })}
      />,
    );
    const img = screen.getByRole("img", { name: "Campus Tour" });
    expect(img).toHaveAttribute("src", "https://example.com/campus.jpg");
  });

  it("renders fallback text when imageUrl is null", () => {
    render(<OfferingCard offering={makeOffering({ imageUrl: null })} />);
    expect(screen.getByText("Imported campus crop")).toBeInTheDocument();
  });

  it("renders a 'View tour' button", () => {
    render(<OfferingCard offering={makeOffering()} />);
    expect(screen.getByRole("button", { name: "View tour" })).toBeInTheDocument();
  });
});
