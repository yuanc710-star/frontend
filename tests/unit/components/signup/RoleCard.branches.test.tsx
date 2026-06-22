import { render, screen } from "@testing-library/react";

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt }: { alt: string }) => <img alt={alt} />,
}));

import { RoleCard } from "@/components/signup/RoleCard";

const base = {
  image: "/x.png",
  imageAlt: "alt",
  badge: "Badge",
  badgeVariant: "info" as const,
  title: "Title",
  subtitle: "Subtitle",
  points: ["p1", "p2"],
  cta: "Continue",
  ctaVariant: "primary" as const,
};

describe("RoleCard CTA branch", () => {
  it("renders a navigating Link when ctaHref is set", () => {
    render(<RoleCard {...base} ctaHref="/signup/participant" />);
    expect(screen.getByRole("link", { name: "Continue" })).toHaveAttribute(
      "href",
      "/signup/participant",
    );
  });

  it("renders an inert Button when ctaHref is absent", () => {
    render(<RoleCard {...base} />);
    expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Continue" })).not.toBeInTheDocument();
  });
});
