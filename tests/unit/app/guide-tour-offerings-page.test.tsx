import { render, screen, waitFor } from "@testing-library/react";
import GuideTourOfferingsPage from "@/app/(app)/guide/tour-offerings/page";
import { useMe, type Me } from "@/lib/data-access";

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

function makeMe(overrides: Partial<Me> = {}): Me {
  return {
    id: "u1",
    roles: ["GUIDE"],
    activeRole: "GUIDE",
    participantType: null,
    guideStatus: "APPROVED",
    accountStatus: "ACTIVE",
    firstName: null,
    lastName: null,
    displayName: null,
    email: null,
    ageBand: null,
    createdAt: null,
    ...overrides,
  };
}

function setMe(
  overrides: Partial<ReturnType<typeof useMe>> & {
    hasRole?: (role: string) => boolean;
  } = {},
) {
  mockUseMe.mockReturnValue({
    me: makeMe(),
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
      me: makeMe({ activeRole: "PARTICIPANT", roles: ["PARTICIPANT"], guideStatus: null }),
      hasRole: (role: string) => role === "PARTICIPANT",
    });
    render(<GuideTourOfferingsPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByTestId("tour-offerings-page")).not.toBeInTheDocument();
  });
});
