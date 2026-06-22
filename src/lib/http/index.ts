/**
 * HTTP layer. Import from "@/lib/http".
 *
 *  - `apiFetch` → all `/vN/*` resource reads & writes (re-auth aware).
 *
 * "Is the user logged in?" for render decisions is answered by the data-access
 * `useMe()` hook (roles[]) — not a separate /auth/session probe.
 */
export { apiFetch } from "./api";
export type { ApiFetchInit } from "./api";
