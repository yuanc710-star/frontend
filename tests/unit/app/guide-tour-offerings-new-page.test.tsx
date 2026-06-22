import { render, screen, waitFor } from "@testing-library/react";
import NewTourOfferingPage from "@/app/(app)/guide/tour-offerings/new/page";
import { useMe } from "@/lib/data-access";

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
      me: { activeRole: "PARTICIPANT", roles: ["PARTICIPANT"] },
      hasRole: (role: string) => role === "PARTICIPANT",
    });
    render(<NewTourOfferingPage />);

    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(screen.queryByTestId("create-offering-form")).not.toBeInTheDocument();
  });
});
