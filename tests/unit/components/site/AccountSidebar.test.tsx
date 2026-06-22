import { render, screen } from "@testing-library/react";
import { AccountSidebar } from "@/components/site/AccountSidebar";

// AccountSidebar is a thin rail wrapper around AccountNav. Stub AccountNav so we
// test the wrapper in isolation (AccountNav has its own data deps + tests).
jest.mock("@/components/site/AccountNav", () => ({
  AccountNav: () => <div data-testid="account-nav" />,
}));

describe("AccountSidebar", () => {
  it("renders the AccountNav inside an <aside> rail", () => {
    render(<AccountSidebar />);

    const nav = screen.getByTestId("account-nav");
    expect(nav).toBeInTheDocument();

    const aside = nav.closest("aside");
    expect(aside).not.toBeNull();
    expect(aside).toContainElement(nav);
  });
});
