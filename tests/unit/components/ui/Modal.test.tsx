import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Modal } from "@/components/ui/Modal";

afterEach(() => {
  // useScrollLock mutates body style; reset between tests.
  document.body.style.overflow = "";
});

describe("Modal", () => {
  it("renders nothing while closed", () => {
    const { container } = render(
      <Modal open={false} onClose={jest.fn()}>
        <p>hi</p>
      </Modal>,
    );
    expect(container).toBeEmptyDOMElement();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a role='dialog' with aria-modal when open", () => {
    render(
      <Modal open onClose={jest.fn()}>
        <p>content</p>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("content")).toBeInTheDocument();
  });

  it("wires aria-labelledby from labelledBy", () => {
    render(
      <Modal open onClose={jest.fn()} labelledBy="title-1">
        <h2 id="title-1">Title</h2>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute(
      "aria-labelledby",
      "title-1",
    );
  });

  it("merges className onto the panel", () => {
    render(
      <Modal open onClose={jest.fn()} className="max-w-md">
        <p>x</p>
      </Modal>,
    );
    expect(screen.getByText("x").parentElement).toHaveClass("max-w-md");
  });

  it("calls onClose when the backdrop is clicked", async () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <p>x</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("dismissOnBackdrop=false suppresses backdrop close", async () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} dismissOnBackdrop={false}>
        <p>x</p>
      </Modal>,
    );
    await userEvent.click(screen.getByRole("button", { name: "Dismiss" }));
    expect(onClose).not.toHaveBeenCalled();
  });

  it("closes on Escape (useDismiss)", async () => {
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose}>
        <p>x</p>
      </Modal>,
    );
    await userEvent.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("locks body scroll while open and restores it on close", () => {
    const { rerender } = render(
      <Modal open onClose={jest.fn()}>
        <p>x</p>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");

    rerender(
      <Modal open={false} onClose={jest.fn()}>
        <p>x</p>
      </Modal>,
    );
    expect(document.body.style.overflow).not.toBe("hidden");
  });
});
