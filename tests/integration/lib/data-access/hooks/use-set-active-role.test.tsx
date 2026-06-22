import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useSetActiveRole } from "@/lib/data-access/hooks/use-set-active-role";

/**
 * Exercises the REAL useSetActiveRole mutation end-to-end: mutate → mutation →
 * postJson → apiFetch → fetch(POST /v1/session/active-role) → apiJson unwrap →
 * onSuccess invalidates ["me"] + ["dashboard"]. Only global.fetch is mocked.
 */

function jsonResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
    body: null,
    json: async () => body,
  } as unknown as Response;
}

function makeClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
}

function wrapperFor(client: QueryClient) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
  };
}

const fetchMock = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = fetchMock as unknown as typeof fetch;
});

describe("useSetActiveRole", () => {
  it("POSTs /v1/session/active-role with the role body and resolves with refreshed Me", async () => {
    const me = { id: "u1", roles: ["GUIDE", "PARTICIPANT"], activeRole: "GUIDE" };
    fetchMock.mockResolvedValue(jsonResponse(200, { data: me }));

    const client = makeClient();
    const { result } = renderHook(() => useSetActiveRole(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("GUIDE");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      "/v1/session/active-role",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: "GUIDE" }),
      }),
    );
    expect(result.current.data).toEqual(me);
  });

  it("invalidates the [me] and [dashboard] caches on success", async () => {
    fetchMock.mockResolvedValue(
      jsonResponse(200, { data: { id: "u1", roles: ["GUIDE"], activeRole: "GUIDE" } }),
    );

    const client = makeClient();
    const invalidateSpy = jest.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSetActiveRole(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("GUIDE");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["me"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["dashboard"] });
  });

  it("rejects (isError) when the response is not ok and does not invalidate", async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, {}));

    const client = makeClient();
    const invalidateSpy = jest.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useSetActiveRole(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("ADMIN");

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(invalidateSpy).not.toHaveBeenCalled();
  });
});
