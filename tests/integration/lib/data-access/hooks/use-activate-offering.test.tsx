import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useActivateOffering } from "@/lib/data-access/hooks/use-activate-offering";

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

describe("useActivateOffering", () => {
  it("POSTs activate with an empty body and resolves with the updated offering", async () => {
    const activated = { id: "o1", title: "Campus walk", status: "ACTIVE" };
    fetchMock.mockResolvedValue(jsonResponse(200, { data: activated }));

    const client = makeClient();
    const { result } = renderHook(() => useActivateOffering(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("o1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      "/v1/guide/offerings/o1/activate",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    );
    expect(result.current.data).toEqual(activated);
  });

  it("invalidates offerings and dashboard caches on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: { id: "o1", status: "ACTIVE" } }));

    const client = makeClient();
    const invalidateSpy = jest.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useActivateOffering(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("o1");

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["guide-offerings"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["dashboard"] });
  });

  it("rejects when the response is not ok", async () => {
    fetchMock.mockResolvedValue(jsonResponse(403, {}));

    const client = makeClient();
    const { result } = renderHook(() => useActivateOffering(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate("o1");

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
