import "client-only";

/**
 * Re-authentication gate (client-side, fine-grained).
 *
 * A tiny framework-agnostic singleton that bridges the API layer (plain modules)
 * and the React modal. When an in-page request gets a re-auth 401 — i.e. the
 * session expired or was revoked WHILE the user is already on a page — the API
 * layer calls `requireAuth()`, which opens the sign-in modal and returns a
 * promise that resolves once the user has re-authenticated (or rejects if they
 * cancel). Multiple concurrent 401s share the same pending promise, so the modal
 * opens once and every queued request settles together.
 *
 * Our re-auth UX keeps the modal: the user clicks "Continue with Google", which
 * does a same-tab redirect (the page unloads, so the promise simply never
 * resolves — harmless). Cancelling rejects with AuthCancelledError.
 *
 * Cancel suppression: after the user cancels, background requests that 401
 * (e.g. polling / refetch) must NOT keep re-opening the modal. We enter a
 * suppressed state where `requireAuth()` rejects immediately, until an explicit
 * `requireAuth({ force: true })` or `resetAuthGate()`.
 *
 * Division of responsibility:
 *  - This gate handles ONLY the mid-session, interactive case (needs UI), so it
 *    cannot live in middleware.
 *  - Coarse, pre-render route protection for navigations is handled in
 *    `src/proxy.ts` (Next 16 Proxy convention; redirect before render).
 *  - The BFF is the source of truth (silent refresh; otherwise 401 +
 *    `Auth-Required: reauthenticate`). Only that signal opens this gate.
 */
type Listener = (open: boolean) => void;

export class AuthCancelledError extends Error {
  constructor(message = "Sign-in was cancelled.") {
    super(message);
    this.name = "AuthCancelledError";
  }
}

let listeners: Listener[] = [];
let pending: Promise<void> | null = null;
let resolvePending: (() => void) | null = null;
let rejectPending: ((reason: Error) => void) | null = null;
let suppressed = false;

function emit(open: boolean): void {
  for (const l of listeners) l(open);
}

/** The modal subscribes here to learn when to open/close. */
export function subscribeAuthGate(listener: Listener): () => void {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
}

/**
 * Open the modal (if not already) and wait for re-authentication.
 * While suppressed (after a cancel), rejects immediately unless `force` is set.
 */
export function requireAuth(options: { force?: boolean } = {}): Promise<void> {
  if (suppressed && !options.force) {
    return Promise.reject(new AuthCancelledError());
  }
  if (options.force) suppressed = false;

  if (!pending) {
    pending = new Promise<void>((resolve, reject) => {
      resolvePending = resolve;
      rejectPending = reject;
    });
    emit(true);
  }
  return pending;
}

function reset(): void {
  pending = null;
  resolvePending = null;
  rejectPending = null;
}

/** Called once re-authentication has succeeded (e.g. a popup reports success). */
export function completeAuth(): void {
  const resolve = resolvePending;
  suppressed = false;
  reset();
  emit(false);
  resolve?.();
}

/** Called when the user dismisses the modal without signing in. */
export function cancelAuth(): void {
  const reject = rejectPending;
  suppressed = true; // stop background 401s from re-opening the modal
  reset();
  emit(false);
  reject?.(new AuthCancelledError());
}

/** Clear post-cancel suppression (e.g. the user explicitly chooses to sign in). */
export function resetAuthGate(): void {
  suppressed = false;
}
