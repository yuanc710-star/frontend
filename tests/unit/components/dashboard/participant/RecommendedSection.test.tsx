import { render, screen } from "@testing-library/react";
import { RecommendedSection } from "@/components/dashboard/participant/RecommendedSection";
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

describe("RecommendedSection", () => {
  it("renders nothing when offerings is empty", () => {
    const { container } = render(<RecommendedSection offerings={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the 'Keep exploring' heading when offerings are present", () => {
    render(<RecommendedSection offerings={[makeOffering()]} />);
    expect(screen.getByText("Keep exploring")).toBeInTheDocument();
    expect(screen.getByText("Recommended")).toBeInTheDocument();
  });

  it("has a 'See all tours' link to /tours", () => {
    render(<RecommendedSection offerings={[makeOffering()]} />);
    expect(screen.getByRole("link", { name: "See all tours" })).toHaveAttribute("href", "/tours");
  });

  it("renders an OfferingCard for each offering", () => {
    const offerings = [
      makeOffering({ id: "o1", title: "Morning Walk" }),
      makeOffering({ id: "o2", title: "Lab Tour" }),
    ];
    render(<RecommendedSection offerings={offerings} />);
    expect(screen.getByText("Morning Walk")).toBeInTheDocument();
    expect(screen.getByText("Lab Tour")).toBeInTheDocument();
  });
});
