import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Drawer } from "@/components/ui/Drawer";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("Drawer", () => {
  it("is always mounted (renders the dialog even when closed)", () => {
    render(
      <Drawer open={false} onClose={jest.fn()} ariaLabel="Nav">
        <p>panel</p>
      </Drawer>,
    );
    expect(screen.getByRole("dialog", { name: "Nav" })).toBeInTheDocument();
    expect(screen.getByText("panel")).toBeInTheDocument();
  });

  it("applies the open translate class when open and closed translate when closed", () => {
    const { rerender } = render(
      <Drawer open onClose={jest.fn()}>
        <p>p</p>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("translate-x-0");

    rerender(
      <Drawer open={false} onClose={jest.fn()}>
        <p>p</p>
      </Drawer>,
    );
    // left side default → closed slides to -translate-x-full
    expect(screen.getByRole("dialog")).toHaveClass("-translate-x-full");
  });

  it("side='right' positions on the right and uses translate-x-full when closed", () => {
    render(
      <Drawer open={false} onClose={jest.fn()} side="right">
        <p>p</p>
      </Drawer>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveClass("right-0", "translate-x-full");
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = jest.fn();
    const { container } = render(
      <Drawer open onClose={onClose}>
        <p>p</p>
      </Drawer>,
    );
    // The backdrop is the first child div (aria-hidden).
    const backdrop = container.querySelector('[aria-hidden]') as HTMLElement;
    await userEvent.click(backdrop);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape while open (useDismiss)", async () => {
    const onClose = jest.fn();
    render(
      <Drawer open onClose={onClose}>
        <p>p</p>
      </Drawer>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT close on Escape while closed (dismiss disabled)", async () => {
    const onClose = jest.fn();
    render(
      <Drawer open={false} onClose={onClose}>
        <p>p</p>
      </Drawer>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).not.toHaveBeenCalled();
  });

  it("locks body scroll while open", () => {
    const { rerender } = render(
      <Drawer open onClose={jest.fn()}>
        <p>p</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Drawer open={false} onClose={jest.fn()}>
        <p>p</p>
      </Drawer>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
