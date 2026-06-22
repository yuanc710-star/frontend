/**
 * Runs in the Node test environment (not jsdom): `next/server`'s NextRequest extends the
 * Web `Request`, which jsdom doesn't provide but Node 18+ exposes as a global. The proxy is
 * middleware/edge code anyway, so Node is the correct runtime to test it in.
 *
 * @jest-environment node
 */
import { NextRequest } from "next/server";
import { proxy, config } from "@/proxy";

function makeReq(url: string, init?: { method?: string; cookie?: string }): NextRequest {
  const headers: Record<string, string> = {};
  if (init?.cookie) headers.cookie = init.cookie;
  return new NextRequest(new URL(url), { method: init?.method ?? "GET", headers });
}

describe("proxy (route guard)", () => {
  it("lets a request with the session cookie through (NextResponse.next)", () => {
    const res = proxy(makeReq("https://app.test/dashboard", { cookie: "ctl_sess=abc" }));
    // NextResponse.next() marks the response so Next continues to the route.
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(res.headers.get("location")).toBeNull();
  });

  it("redirects a logged-out GET to /signin with a pathname-only returnTo", () => {
    const res = proxy(makeReq("https://app.test/dashboard?token=secret"));
    expect(res.status).toBe(307);
    const loc = new URL(res.headers.get("location") as string);
    expect(loc.pathname).toBe("/signin");
    // Only the path is preserved — the ?token query must NOT leak into returnTo.
    expect(loc.searchParams.get("returnTo")).toBe("/dashboard");
    expect(res.headers.get("cache-control")).toBe("private, no-store");
  });

  it("answers a logged-out non-GET with 401 JSON (not a redirect)", async () => {
    const res = proxy(makeReq("https://app.test/dashboard", { method: "POST" }));
    expect(res.status).toBe(401);
    expect(res.headers.get("location")).toBeNull();
    expect(res.headers.get("cache-control")).toBe("private, no-store");
    const body = (await res.json()) as { code?: string };
    expect(body.code).toBe("AUTH_REQUIRED");
  });

  it("matcher covers the authenticated areas and omits public routes", () => {
    for (const p of ["/dashboard", "/profile", "/support", "/staff", "/onboarding/:path*"]) {
      expect(config.matcher).toContain(p);
    }
    expect(config.matcher).not.toContain("/signin");
    expect(config.matcher).not.toContain("/");
  });
});
