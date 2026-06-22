import { fireEvent, render, screen } from "@testing-library/react";
import { AuthOptions } from "@/components/signup/AuthOptions";

describe("AuthOptions", () => {
  it("offers the Google sign-in path", () => {
    render(<AuthOptions />);
    expect(screen.getByRole("button", { name: /continue with google/i })).toBeInTheDocument();
  });

  it("does not collect a password or email itself", () => {
    render(<AuthOptions />);
    expect(screen.queryByLabelText(/email address/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
  });

  describe("clicking Continue with Google", () => {
    const realLocation = window.location;
    let assign: jest.Mock;

    beforeEach(() => {
      assign = jest.fn();
      Object.defineProperty(window, "location", {
        configurable: true,
        value: { assign },
      });
    });
    afterEach(() => {
      Object.defineProperty(window, "location", { configurable: true, value: realLocation });
    });

    it("redirects to the BFF /auth/login with returnTo + intent", () => {
      render(<AuthOptions intent="signup" returnTo="/onboarding/guide" />);
      fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));
      expect(assign).toHaveBeenCalledTimes(1);
      const url = assign.mock.calls[0][0] as string;
      expect(url).toContain("/auth/login?");
      expect(url).toContain("intent=signup");
      expect(url).toContain(encodeURIComponent("/onboarding/guide"));
    });

    it("defaults to a signin intent and the dashboard return", () => {
      render(<AuthOptions />);
      fireEvent.click(screen.getByRole("button", { name: /continue with google/i }));
      const url = assign.mock.calls[0][0] as string;
      expect(url).toContain("intent=signin");
      expect(url).toContain(encodeURIComponent("/dashboard"));
    });
  });
});
