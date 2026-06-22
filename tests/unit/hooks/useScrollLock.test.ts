import { renderHook } from "@testing-library/react";
import { useScrollLock } from "@/hooks/useScrollLock";

afterEach(() => {
  document.body.style.overflow = "";
});

describe("useScrollLock", () => {
  it("sets body overflow to hidden while active", () => {
    renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("does NOT touch overflow when inactive", () => {
    document.body.style.overflow = "scroll";
    renderHook(() => useScrollLock(false));
    expect(document.body.style.overflow).toBe("scroll");
  });

  it("restores the previous overflow value on unmount", () => {
    document.body.style.overflow = "auto";
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("restores an empty (default) overflow when none was previously set", () => {
    document.body.style.overflow = "";
    const { unmount } = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("locks when toggled from inactive to active", () => {
    document.body.style.overflow = "visible";
    const { rerender } = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: false },
    });
    expect(document.body.style.overflow).toBe("visible");

    rerender({ active: true });
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores the previous value when toggled from active to inactive", () => {
    document.body.style.overflow = "visible";
    const { rerender } = renderHook(({ active }) => useScrollLock(active), {
      initialProps: { active: true },
    });
    expect(document.body.style.overflow).toBe("hidden");

    rerender({ active: false });
    // Cleanup of the active effect restores what was captured before locking.
    expect(document.body.style.overflow).toBe("visible");
  });

  it("with two simultaneous locks, body stays hidden until both unmount", () => {
    // Outer captures "" then sets hidden. Inner captures "hidden" then sets hidden.
    document.body.style.overflow = "";
    const outer = renderHook(() => useScrollLock(true));
    const inner = renderHook(() => useScrollLock(true));
    expect(document.body.style.overflow).toBe("hidden");

    // Inner unmounts first: it restores what it captured ("hidden").
    inner.unmount();
    expect(document.body.style.overflow).toBe("hidden");

    // Outer unmounts: restores the original "".
    outer.unmount();
    expect(document.body.style.overflow).toBe("");
  });
});
