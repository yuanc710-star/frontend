"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthCancelledError } from "@/lib/auth";
import { ApiError } from "./http";

/**
 * App-wide React Query client. Mounted once near the root so every client
 * component shares one cache (e.g. a single `/userinfo` request — see useMe).
 */
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            // Never retry a cancelled re-auth or a client (4xx) error — only
            // transient failures (network / 5xx) get one retry.
            retry: (failureCount, error) => {
              if (error instanceof AuthCancelledError) return false;
              if (error instanceof ApiError && error.status >= 400 && error.status < 500) {
                return false;
              }
              return failureCount < 1;
            },
          },
        },
      }),
  );
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
