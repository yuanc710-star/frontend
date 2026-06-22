import type { ReactNode } from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useCreateOffering } from "@/lib/data-access/hooks/use-create-offering";

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

describe("useCreateOffering", () => {
  it("POSTs /v1/guide/offerings with the body and resolves with the created offering", async () => {
    const created = { id: "o1", title: "Campus walk", status: "DRAFT" };
    fetchMock.mockResolvedValue(jsonResponse(200, { data: created }));

    const client = makeClient();
    const { result } = renderHook(() => useCreateOffering(), {
      wrapper: wrapperFor(client),
    });

    const body = {
      title: "Campus walk",
      universityId: "uni-1",
      topic: "GENERAL_CAMPUS",
      durationMin: 60,
      priceCents: 4200,
    };
    result.current.mutate(body);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(fetchMock).toHaveBeenCalledWith(
      "/v1/guide/offerings",
      expect.objectContaining({
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }),
    );
    expect(result.current.data).toEqual(created);
  });

  it("invalidates offerings and dashboard caches on success", async () => {
    fetchMock.mockResolvedValue(jsonResponse(200, { data: { id: "o1" } }));

    const client = makeClient();
    const invalidateSpy = jest.spyOn(client, "invalidateQueries");

    const { result } = renderHook(() => useCreateOffering(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate({
      title: "Tour",
      universityId: "uni-1",
      topic: "GENERAL_CAMPUS",
      durationMin: 60,
      priceCents: 4200,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["guide-offerings"] });
    expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["dashboard"] });
  });

  it("rejects when the response is not ok", async () => {
    fetchMock.mockResolvedValue(jsonResponse(422, {}));

    const client = makeClient();
    const { result } = renderHook(() => useCreateOffering(), {
      wrapper: wrapperFor(client),
    });

    result.current.mutate({
      title: "Tour",
      universityId: "uni-1",
      topic: "GENERAL_CAMPUS",
      durationMin: 60,
      priceCents: 4200,
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
