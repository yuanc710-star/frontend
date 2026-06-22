import { render, screen, waitFor } from "@testing-library/react";
import GuideTourOfferingsPage from "@/app/(app)/guide/tour-offerings/page";
import { useMe } from "@/lib/data-access";

const replace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));
jest.mock("@/lib/data-access", () => ({
  useMe: jest.fn(),
}));
jest.mock("@/components/offerings/TourOfferingsPage", () => ({
  TourOfferingsPage: () => <div data-testid="tour-offerings-page">Offerings</div>,
}));

const mockUseMe = useMe as jest.Mock;

function setMe(
  overrides: Partial<ReturnType<typeof useMe>> & {
    hasRole?: (role: string) => boolean;
  } = {},
) {
  mockUseMe.mockReturnValue({
    me: {
      activeRole: "GUIDE",
      roles: ["GUIDE"],
    },
    isLoading: false,
    hasRole: (role: string) => role === "GUIDE",
    ...overrides,
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  setMe();
});

describe("GuideTourOfferingsPage", () => {
  it("shows loading while me is loading", () => {
    setMe({ isLoading: true, me: null, hasRole: () => false });
    render(<GuideTourOfferingsPage />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByTestId("tour-offerings-page")).not.toBeInTheDocument();
  });

  it("renders the offerings workspace for an active guide", () => {
    render(<GuideTourOfferingsPage />);

    expect(screen.getByTestId("tour-offerings-page")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects non-guide active roles to the dashboard", async () => {
    setMe({
      me: { activeRole: "PARTICIPANT", roles: ["PARTICIPANT"] },
      hasRole: (role: string) => role === "PARTICIPANT",
    });
    render(<GuideTourOfferingsPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByTestId("tour-offerings-page")).not.toBeInTheDocument();
  });
});
