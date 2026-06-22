import { render, screen } from "@testing-library/react";
import { Bell } from "lucide-react";
import { Spinner } from "@/components/ui/Spinner";
import { Icon } from "@/components/ui/Icon";
import { Card } from "@/components/ui/Card";
import { Slot } from "@/components/ui/Slot";
import { VisuallyHidden } from "@/components/ui/VisuallyHidden";
import { GoogleMark } from "@/components/ui/GoogleMark";

describe("Spinner", () => {
  it("renders an aria-hidden spinner with default size and merges className", () => {
    const { container } = render(<Spinner className="text-primary" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveAttribute("aria-hidden");
    expect(el).toHaveClass("animate-spin", "text-primary");
    expect(el).toHaveStyle({ width: "16px", height: "16px" });
  });

  it("honours a custom size", () => {
    const { container } = render(<Spinner size={32} />);
    expect(container.firstChild).toHaveStyle({ width: "32px", height: "32px" });
  });
});

describe("Icon", () => {
  it("renders the given lucide icon, aria-hidden, with shrink-0 + className", () => {
    const { container } = render(<Icon icon={Bell} className="text-ink" />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden");
    expect(svg).toHaveClass("shrink-0", "text-ink");
  });
});

describe("Card", () => {
  it("renders children with card + card-pad by default", () => {
    render(<Card>body</Card>);
    const el = screen.getByText("body");
    expect(el).toHaveClass("card", "card-pad");
  });

  it("drops card-pad when padded=false and merges className", () => {
    render(
      <Card padded={false} className="extra">
        body
      </Card>,
    );
    const el = screen.getByText("body");
    expect(el).toHaveClass("card", "extra");
    expect(el).not.toHaveClass("card-pad");
  });
});

describe("Slot", () => {
  it("clones the child and merges className onto it", () => {
    render(
      <Slot className="injected" data-x="1">
        <a href="/z" className="own">
          child
        </a>
      </Slot>,
    );
    const link = screen.getByRole("link", { name: "child" });
    expect(link).toHaveClass("injected", "own");
    expect(link).toHaveAttribute("data-x", "1");
    expect(link).toHaveAttribute("href", "/z");
  });

  it("returns null for a non-element child", () => {
    const { container } = render(<Slot>plain text</Slot>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("VisuallyHidden", () => {
  it("renders children inside an sr-only span", () => {
    render(<VisuallyHidden>screen reader text</VisuallyHidden>);
    const el = screen.getByText("screen reader text");
    expect(el.tagName).toBe("SPAN");
    expect(el).toHaveClass("sr-only");
  });
});

describe("GoogleMark", () => {
  it("renders an aria-hidden svg with default size and a custom className", () => {
    const { container } = render(<GoogleMark className="mark" />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden");
    expect(svg).toHaveClass("mark");
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });

  it("honours a custom size", () => {
    const { container } = render(<GoogleMark size={32} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "32");
  });
});
