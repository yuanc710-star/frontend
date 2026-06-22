import { NextResponse, type NextRequest } from "next/server";

/**
 * Route guard — the coarse, server-side, pre-render half of authentication.
 *
 * (Next.js 16 renamed the Middleware convention to "Proxy": this file is
 * `src/proxy.ts` exporting `proxy()`, which runs on the Node.js runtime. Don't
 * also add a `middleware.ts` — Next allows only one of the two.)
 *
 * Redirects logged-out visitors away from authenticated pages BEFORE they
 * render, by checking for the BFF session cookie. This is the part of auth the
 * proxy can own: protecting *navigations* and direct URL hits, so a protected
 * page never flashes for a signed-out user.
 *
 * It is deliberately COARSE — it only checks the cookie's PRESENCE, not its
 * validity (the cookie is AES-encrypted with the BFF's secret; only the BFF/Core
 * can truly validate the session). The complementary, fine-grained case — a
 * session that expires *mid-page* and returns 401 from an in-page fetch — is
 * handled on the client by the re-auth modal (see src/lib/auth/authGate.ts).
 * The proxy can't render a modal or resume an in-flight interaction, so the
 * layers are intentionally split:
 *
 *   proxy (here)       → no cookie on a protected route → redirect to /signin
 *   authGate (client)  → cookie present but 401 mid-session → modal + retry
 *   BFF                → source of truth: silent refresh, otherwise 401
 */

// Must match the BFF session cookie name (see bff/src/session.ts).
const SESSION_COOKIE = "ctl_sess";

export function proxy(req: NextRequest) {
  if (req.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  // Non-GET hits on a protected route (e.g. a future Server Action POST) must
  // not be 307-replayed to /signin — answer with 401 JSON instead.
  if (req.method !== "GET" && req.method !== "HEAD") {
    return NextResponse.json(
      { code: "AUTH_REQUIRED", message: "Authentication is required." },
      { status: 401, headers: { "Cache-Control": "private, no-store" } },
    );
  }

  const signinUrl = new URL("/signin", req.url);
  // Preserve only the PATH (no query string) so sensitive params (?token=,
  // ?email=, ?invite=) don't leak into the /signin URL, logs, history or Referer.
  signinUrl.searchParams.set("returnTo", req.nextUrl.pathname);

  const res = NextResponse.redirect(signinUrl);
  // Don't let a shared cache store this auth-dependent redirect.
  res.headers.set("Cache-Control", "private, no-store");
  return res;
}

export const config = {
  // Authenticated areas only. Public pages (home, /signin, /signup/*) are omitted,
  // as are static assets and API/BFF routes (which the BFF guards itself).
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/profile",
    "/profile/:path*",
    "/support",
    "/support/:path*",
    "/staff",
    "/staff/:path*",
    "/onboarding/:path*",
    "/guide",
    "/guide/:path*",
  ],
};
