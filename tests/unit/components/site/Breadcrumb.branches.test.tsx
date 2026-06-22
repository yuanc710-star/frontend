import { render, screen } from "@testing-library/react";

jest.mock("next/link", () => ({
  __esModule: true,
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href}>{children}</a>
  ),
}));

import { Breadcrumb } from "@/components/site/Breadcrumb";

describe("Breadcrumb link/span branches", () => {
  it("links non-last items with an href and renders spans otherwise", () => {
    render(
      <Breadcrumb
        items={[
          { label: "Home", href: "/" }, // non-last + href → link
          { label: "Mid" }, // non-last, no href → span
          { label: "Last", href: "/last" }, // last + href → span (current page)
        ]}
      />,
    );
    expect(screen.getByRole("link", { name: "Home" })).toHaveAttribute("href", "/");
    expect(screen.queryByRole("link", { name: "Mid" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Last" })).not.toBeInTheDocument();
    expect(screen.getByText("Last")).toHaveAttribute("aria-current", "page");
  });
});
