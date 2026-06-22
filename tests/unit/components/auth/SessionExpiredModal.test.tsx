import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SessionExpiredModal } from "@/components/auth/SessionExpiredModal";
import { requireAuth, cancelAuth, resetAuthGate } from "@/lib/auth";

// next/image -> a plain <img> so the modal mounts cleanly in jsdom.
jest.mock("next/image", () => ({
  __esModule: true,
  // eslint-disable-next-line jsx-a11y/alt-text
  default: (props: Record<string, unknown>) => <img {...props} />,
}));

/**
 * The modal opens by subscribing to the framework-agnostic auth gate singleton
 * (`subscribeAuthGate`). The real trigger is `requireAuth()` (called by the API
 * layer on a re-auth 401); `cancelAuth()` closes it. We drive the real gate here
 * rather than mocking it, since that is exactly what flips the modal open/closed.
 */

/**
 * Open the gate the way the API layer does, but swallow the expected
 * AuthCancelledError so cancelling (in the test or in cleanup) doesn't surface
 * as an unhandled promise rejection that fails the test.
 */
function triggerAuthGate() {
  requireAuth({ force: true }).catch(() => {});
}

beforeEach(() => {
  // Clear any pending/suppressed state leaked from a previous test, and make
  // sure the gate is closed before each render.
  act(() => {
    cancelAuth();
    resetAuthGate();
  });
});

describe("SessionExpiredModal — visibility", () => {
  it("is hidden by default (no re-auth pending)", () => {
    render(<SessionExpiredModal />);

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Sign in to continue"),
    ).not.toBeInTheDocument();
  });

  it("opens when the auth gate is triggered (requireAuth)", () => {
    render(<SessionExpiredModal />);

    act(() => {
      // force: true clears any post-cancel suppression from beforeEach.
      triggerAuthGate();
    });

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Sign in to continue")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Continue with Google/ }),
    ).toBeInTheDocument();
  });

  it("closes again when the gate is cancelled", () => {
    render(<SessionExpiredModal />);

    act(() => triggerAuthGate());
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    act(() => cancelAuth());
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("SessionExpiredModal — actions", () => {
  it("clicking Cancel closes the modal", async () => {
    const user = userEvent.setup();
    render(<SessionExpiredModal />);

    act(() => triggerAuthGate());
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("Continue with Google redirects the current tab to the sign-in flow", async () => {
    const user = userEvent.setup();
    const assign = jest.fn();
    const original = window.location;
    Object.defineProperty(window, "location", {
      configurable: true,
      value: {
        ...original,
        pathname: "/dashboard",
        search: "?tab=tours",
        assign,
      },
    });

    try {
      render(<SessionExpiredModal />);
      act(() => triggerAuthGate());

      await user.click(
        screen.getByRole("button", { name: /Continue with Google/ }),
      );

      expect(assign).toHaveBeenCalledWith(
        "/auth/login?intent=signin&returnTo=%2Fdashboard%3Ftab%3Dtours",
      );
      // Shows the redirecting state and disables the button.
      expect(
        screen.getByRole("button", { name: /Redirecting/ }),
      ).toBeDisabled();
    } finally {
      Object.defineProperty(window, "location", {
        configurable: true,
        value: original,
      });
    }
  });
});
