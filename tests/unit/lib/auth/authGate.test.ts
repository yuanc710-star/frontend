import {
  subscribeAuthGate,
  requireAuth,
  completeAuth,
  cancelAuth,
  resetAuthGate,
  AuthCancelledError,
} from "@/lib/auth/authGate";

// The auth gate is a module-level singleton, so its internal state (pending
// promise, listeners, suppressed flag) leaks across tests. Reset it explicitly
// between tests by completing any pending gate and clearing suppression.
afterEach(() => {
  // Settle any open gate so a leaked pending promise can't poison the next test.
  completeAuth();
  resetAuthGate();
});

describe("AuthCancelledError", () => {
  it("is an Error subclass with the expected name and default message", () => {
    const err = new AuthCancelledError();
    expect(err).toBeInstanceOf(Error);
    expect(err).toBeInstanceOf(AuthCancelledError);
    expect(err.name).toBe("AuthCancelledError");
    expect(err.message).toBe("Sign-in was cancelled.");
  });

  it("accepts a custom message", () => {
    expect(new AuthCancelledError("nope").message).toBe("nope");
  });
});

describe("requireAuth", () => {
  it("emits open(true) to subscribers the first time it is called", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    requireAuth();

    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(true);
    unsubscribe();
  });

  it("returns a pending promise that does not resolve on its own", async () => {
    const p = requireAuth();
    const settled = jest.fn();
    p.then(settled, settled);
    // Flush microtasks; the promise must still be pending.
    await Promise.resolve();
    expect(settled).not.toHaveBeenCalled();
  });

  it("shares one pending promise and opens the modal only once for concurrent calls", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    const a = requireAuth();
    const b = requireAuth();

    expect(a).toBe(b);
    // emit(true) only fires when a new pending promise is created.
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });
});

describe("completeAuth", () => {
  it("resolves the pending promise and emits open(false)", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    const p = requireAuth();
    listener.mockClear(); // ignore the open(true) from requireAuth

    completeAuth();

    await expect(p).resolves.toBeUndefined();
    expect(listener).toHaveBeenCalledWith(false);
    unsubscribe();
  });

  it("is safe to call when no gate is pending (no throw, emits close)", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    expect(() => completeAuth()).not.toThrow();
    expect(listener).toHaveBeenCalledWith(false);
    unsubscribe();
  });

  it("clears the pending promise so a later requireAuth opens a fresh gate", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    requireAuth();
    completeAuth();
    listener.mockClear();

    requireAuth(); // a brand-new gate must re-open
    expect(listener).toHaveBeenCalledWith(true);
    unsubscribe();
  });
});

describe("cancelAuth", () => {
  it("rejects the pending promise with AuthCancelledError and emits close", async () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    const p = requireAuth();
    listener.mockClear();

    cancelAuth();

    await expect(p).rejects.toBeInstanceOf(AuthCancelledError);
    expect(listener).toHaveBeenCalledWith(false);
    unsubscribe();
  });

  it("suppresses subsequent requireAuth calls (background 401s reject immediately)", async () => {
    requireAuth();
    cancelAuth();

    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    // While suppressed, requireAuth rejects without opening the modal.
    await expect(requireAuth()).rejects.toBeInstanceOf(AuthCancelledError);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("requireAuth({ force: true }) bypasses suppression and re-opens the modal", () => {
    requireAuth();
    cancelAuth();

    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    const p = requireAuth({ force: true });
    expect(listener).toHaveBeenCalledWith(true);
    // It returns a real pending promise (not a rejection).
    expect(p).toBeInstanceOf(Promise);
    unsubscribe();
  });
});

describe("resetAuthGate", () => {
  it("clears post-cancel suppression so requireAuth opens the modal again", () => {
    requireAuth();
    cancelAuth();
    resetAuthGate();

    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);

    requireAuth();
    expect(listener).toHaveBeenCalledWith(true);
    unsubscribe();
  });
});

describe("subscribeAuthGate", () => {
  it("notifies every active subscriber", () => {
    const a = jest.fn();
    const b = jest.fn();
    const unsubA = subscribeAuthGate(a);
    const unsubB = subscribeAuthGate(b);

    requireAuth();

    expect(a).toHaveBeenCalledWith(true);
    expect(b).toHaveBeenCalledWith(true);
    unsubA();
    unsubB();
  });

  it("stops notifying after the returned unsubscribe is called", () => {
    const listener = jest.fn();
    const unsubscribe = subscribeAuthGate(listener);
    unsubscribe();

    requireAuth();
    expect(listener).not.toHaveBeenCalled();
  });
});
