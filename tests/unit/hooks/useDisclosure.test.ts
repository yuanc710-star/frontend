import { act, renderHook } from "@testing-library/react";
import { useDisclosure } from "@/hooks/useDisclosure";

describe("useDisclosure", () => {
  it("defaults to closed when no initial value is supplied", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.open).toBe(false);
  });

  it("respects an explicit initial value of true", () => {
    const { result } = renderHook(() => useDisclosure(true));
    expect(result.current.open).toBe(true);
  });

  it("respects an explicit initial value of false", () => {
    const { result } = renderHook(() => useDisclosure(false));
    expect(result.current.open).toBe(false);
  });

  it("onOpen sets open to true", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.onOpen());
    expect(result.current.open).toBe(true);
  });

  it("onOpen is idempotent when already open", () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.onOpen());
    expect(result.current.open).toBe(true);
  });

  it("onClose sets open to false", () => {
    const { result } = renderHook(() => useDisclosure(true));
    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);
  });

  it("onClose is idempotent when already closed", () => {
    const { result } = renderHook(() => useDisclosure(false));
    act(() => result.current.onClose());
    expect(result.current.open).toBe(false);
  });

  it("onToggle flips the value back and forth", () => {
    const { result } = renderHook(() => useDisclosure());
    expect(result.current.open).toBe(false);

    act(() => result.current.onToggle());
    expect(result.current.open).toBe(true);

    act(() => result.current.onToggle());
    expect(result.current.open).toBe(false);
  });

  it("setOpen can set the value directly", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.setOpen(true));
    expect(result.current.open).toBe(true);
    act(() => result.current.setOpen(false));
    expect(result.current.open).toBe(false);
  });

  it("setOpen accepts an updater function", () => {
    const { result } = renderHook(() => useDisclosure());
    act(() => result.current.setOpen((o) => !o));
    expect(result.current.open).toBe(true);
  });

  it("exposes stable handler identities across renders", () => {
    const { result, rerender } = renderHook(() => useDisclosure());
    const first = {
      setOpen: result.current.setOpen,
      onOpen: result.current.onOpen,
      onClose: result.current.onClose,
      onToggle: result.current.onToggle,
    };

    // Trigger a state change + re-render.
    act(() => result.current.onToggle());
    rerender();

    expect(result.current.setOpen).toBe(first.setOpen);
    expect(result.current.onOpen).toBe(first.onOpen);
    expect(result.current.onClose).toBe(first.onClose);
    expect(result.current.onToggle).toBe(first.onToggle);
  });
});
