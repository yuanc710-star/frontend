import { render, screen } from "@testing-library/react";
import { AppShell } from "@/components/site/AppShell";

// AppShell is pure chrome. Stub the heavy children so this stays an isolated
// unit test of the layout composition (no auth gate, no data fetching).
jest.mock("@/components/site/SiteHeader", () => ({
  SiteHeader: () => <div data-testid="site-header" />,
}));
jest.mock("@/components/site/AccountSidebar", () => ({
  AccountSidebar: () => <div data-testid="account-sidebar" />,
}));

describe("AppShell", () => {
  it("renders the header, the account sidebar, and the children", () => {
    render(
      <AppShell>
        <p>Page body</p>
      </AppShell>,
    );

    expect(screen.getByTestId("site-header")).toBeInTheDocument();
    expect(screen.getByTestId("account-sidebar")).toBeInTheDocument();
    expect(screen.getByText("Page body")).toBeInTheDocument();
  });

  it("places the children inside the member grid <section> (no auth gate)", () => {
    render(
      <AppShell>
        <p>Child content</p>
      </AppShell>,
    );

    const child = screen.getByText("Child content");
    // The body content lives in a <section> sibling of the sidebar.
    const section = child.closest("section");
    expect(section).not.toBeNull();
    expect(section).toContainElement(child);
  });

  it("renders chrome unconditionally — children always show", () => {
    render(
      <AppShell>
        <span data-testid="always">x</span>
      </AppShell>,
    );

    // No useMe gate: the child is present regardless of any auth state.
    expect(screen.getByTestId("always")).toBeInTheDocument();
    expect(screen.getByTestId("site-header")).toBeInTheDocument();
  });
});
