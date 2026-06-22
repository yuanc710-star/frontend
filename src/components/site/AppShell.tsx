import { SiteHeader } from "./SiteHeader";
import { AccountSidebar } from "./AccountSidebar";

/**
 * Shared chrome for the signed-in app area. The (app) route-group layout guards
 * entry server-side, so every page reaching AppShell belongs to
 * an onboarded member — this always renders the member layout (header + account
 * side menu + body). No client-side auth gate: the single source of truth is the
 * server guard, not a second `useMe()` check here.
 *
 * Pages wrapped by this (via the (app) route-group layout) only provide their main
 * content — they don't import the header or sidebar themselves.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main>
      {/* Dashboard link is hidden in the header since the side menu provides it. */}
      <SiteHeader showGetStarted={false} showDashboardLink={false} />

      <div className="mx-auto max-w-content gap-8 px-6 pb-24 pt-10 lg:grid lg:grid-cols-[256px_1fr] lg:gap-10">
        <AccountSidebar />
        <section className="min-w-0">{children}</section>
      </div>
    </main>
  );
}
