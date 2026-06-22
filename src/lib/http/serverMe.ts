import { cookies } from "next/headers";
import type { Me } from "@/lib/data-access/types";

const SESSION_COOKIE = "ctl_sess";

/**
 * Server-side principal fetch for RSC route guards. Reads the
 * encrypted session cookie and asks the BFF (which decrypts it and calls Core);
 * we only forward the cookie, never decrypt it here.
 *
 * Never throws — returns null when unauthenticated or on any error, so guards can
 * treat null as "send to auth". The client `apiFetch` is client-only and uses
 * relative/same-origin semantics, so it can't be reused server-side; this hits the
 * BFF directly via BFF_URL. Server-only (imports next/headers); intentionally NOT
 * exported from the data-access client barrel.
 */
export async function getServerMe(): Promise<Me | null> {
  const session = (await cookies()).get(SESSION_COOKIE);
  if (!session) return null;

  const base = process.env.BFF_URL;
  if (!base) return null;

  try {
    const res = await fetch(`${base}/v1/userinfo`, {
      headers: {
        cookie: `${SESSION_COOKIE}=${session.value}`,
        accept: "application/json",
      },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data ?? json) as Me;
  } catch {
    return null;
  }
}
