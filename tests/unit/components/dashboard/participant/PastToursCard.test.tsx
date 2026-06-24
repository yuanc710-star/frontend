import { render, screen } from "@testing-library/react";
import { PastToursCard } from "@/components/dashboard/participant/PastToursCard";

describe("PastToursCard", () => {
  it("renders the History eyebrow and heading", () => {
    render(<PastToursCard />);
    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText("Your past tours")).toBeInTheDocument();
  });

  it("renders the descriptive copy", () => {
    render(<PastToursCard />);
    expect(screen.getByText(/Review completed tours/)).toBeInTheDocument();
  });

  it("has a link to /tour-history labelled 'My Tours'", () => {
    render(<PastToursCard />);
    const link = screen.getByRole("link", { name: "My Tours" });
    expect(link).toHaveAttribute("href", "/tour-history");
  });
});
