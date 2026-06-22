import { act, renderHook } from "@testing-library/react";
import { fireEvent } from "@testing-library/dom";
import { useDropdown } from "@/hooks/useDropdown";

beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});

describe("useDropdown", () => {
  it("starts closed", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.open).toBe(false);
  });

  it("exposes the composed surface (handlers + prop bundles)", () => {
    const { result } = renderHook(() => useDropdown());
    expect(typeof result.current.setOpen).toBe("function");
    expect(typeof result.current.close).toBe("function");
    expect(typeof result.current.toggle).toBe("function");
    expect(typeof result.current.openNow).toBe("function");
    expect(typeof result.current.scheduleClose).toBe("function");
    expect(typeof result.current.cancelClose).toBe("function");
    expect(typeof result.current.triggerProps.onMouseEnter).toBe("function");
    expect(typeof result.current.triggerProps.onMouseLeave).toBe("function");
    expect(typeof result.current.contentProps.onMouseEnter).toBe("function");
    expect(typeof result.current.contentProps.onMouseLeave).toBe("function");
  });

  it("openNow opens immediately", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    expect(result.current.open).toBe(true);
  });

  it("opens via the trigger's onMouseEnter", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.triggerProps.onMouseEnter());
    expect(result.current.open).toBe(true);
  });

  it("toggle flips open state", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.toggle());
    expect(result.current.open).toBe(true);
    act(() => result.current.toggle());
    expect(result.current.open).toBe(false);
  });

  it("close sets open to false", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    act(() => result.current.close());
    expect(result.current.open).toBe(false);
  });

  it("closes after the close delay when leaving the trigger", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    expect(result.current.open).toBe(true);

    act(() => result.current.triggerProps.onMouseLeave());
    expect(result.current.open).toBe(true); // still open during the delay
    act(() => jest.advanceTimersByTime(150));
    expect(result.current.open).toBe(false);
  });

  it("honors a custom closeDelay", () => {
    const { result } = renderHook(() => useDropdown({ closeDelay: 400 }));
    act(() => result.current.openNow());
    act(() => result.current.scheduleClose());

    act(() => jest.advanceTimersByTime(399));
    expect(result.current.open).toBe(true);
    act(() => jest.advanceTimersByTime(1));
    expect(result.current.open).toBe(false);
  });

  it("moving from trigger to content cancels the pending close", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.triggerProps.onMouseEnter());
    act(() => result.current.triggerProps.onMouseLeave());
    act(() => jest.advanceTimersByTime(50));
    act(() => result.current.contentProps.onMouseEnter());
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.open).toBe(true);
  });

  it("closes on Escape while open (Esc composition via useDismiss)", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    expect(result.current.open).toBe(true);

    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(result.current.open).toBe(false);
  });

  it("Escape is a no-op while closed (dismiss listener not enabled)", () => {
    const { result } = renderHook(() => useDropdown());
    expect(result.current.open).toBe(false);
    act(() => {
      fireEvent.keyDown(window, { key: "Escape" });
    });
    expect(result.current.open).toBe(false);
  });

  it("ignores non-Escape keys while open", () => {
    const { result } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    act(() => {
      fireEvent.keyDown(window, { key: "Enter" });
    });
    expect(result.current.open).toBe(true);
  });

  it("does not leak a pending close timer after unmount", () => {
    const { result, unmount } = renderHook(() => useDropdown());
    act(() => result.current.openNow());
    act(() => result.current.scheduleClose());
    expect(() => {
      unmount();
      jest.advanceTimersByTime(1000);
    }).not.toThrow();
  });
});
