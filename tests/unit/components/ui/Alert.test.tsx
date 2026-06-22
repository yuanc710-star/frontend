import { render, screen } from "@testing-library/react";
import { Alert, type AlertVariant } from "@/components/ui/Alert";

describe("Alert", () => {
  it("defaults to role='alert' and the info variant", () => {
    render(<Alert>Heads up</Alert>);
    const el = screen.getByRole("alert");
    expect(el).toHaveClass("alert", "alert-info");
  });

  it("renders children", () => {
    render(<Alert>Something happened</Alert>);
    expect(screen.getByText("Something happened")).toBeInTheDocument();
  });

  it.each([
    ["info", "alert-info"],
    ["warning", "alert-warning"],
    ["success", "alert-success"],
    ["error", "alert-error"],
  ] as [AlertVariant, string][])(
    "variant %s applies %s and a leading icon",
    (variant, expected) => {
      const { container } = render(<Alert variant={variant}>msg</Alert>);
      const el = screen.getByRole("alert");
      expect(el).toHaveClass(expected);
      // Each variant renders exactly one decorative leading svg icon.
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBe(1);
      expect(icons[0]).toHaveAttribute("aria-hidden");
    },
  );

  it("allows overriding the role (e.g. status)", () => {
    render(
      <Alert role="status" variant="success">
        ok
      </Alert>,
    );
    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it("merges a custom className and forwards arbitrary props", () => {
    render(
      <Alert className="extra" data-testid="my-alert">
        x
      </Alert>,
    );
    const el = screen.getByTestId("my-alert");
    expect(el).toHaveClass("alert", "extra");
  });
});
