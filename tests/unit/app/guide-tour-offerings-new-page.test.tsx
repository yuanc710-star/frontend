import { render, screen, waitFor } from "@testing-library/react";
import NewTourOfferingPage from "@/app/(app)/guide/tour-offerings/new/page";
import { useMe, type Me } from "@/lib/data-access";

const replace = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace }),
}));
jest.mock("@/lib/data-access", () => ({
  useMe: jest.fn(),
}));
jest.mock("@/components/offerings/CreateOfferingForm", () => ({
  CreateOfferingForm: () => <div data-testid="create-offering-form">Create</div>,
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

describe("NewTourOfferingPage", () => {
  it("shows loading while me is loading", () => {
    setMe({ isLoading: true, me: null, hasRole: () => false });
    render(<NewTourOfferingPage />);

    expect(screen.getByText("Loading…")).toBeInTheDocument();
    expect(screen.queryByTestId("create-offering-form")).not.toBeInTheDocument();
  });

  it("renders the create form for an active guide", () => {
    render(<NewTourOfferingPage />);

    expect(screen.getByTestId("create-offering-form")).toBeInTheDocument();
    expect(replace).not.toHaveBeenCalled();
  });

  it("redirects non-guide active roles to the dashboard", async () => {
    setMe({
      me: makeMe({ activeRole: "PARTICIPANT", roles: ["PARTICIPANT"], guideStatus: null }),
      hasRole: (role: string) => role === "PARTICIPANT",
    });
    render(<NewTourOfferingPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByTestId("create-offering-form")).not.toBeInTheDocument();
  });
});
