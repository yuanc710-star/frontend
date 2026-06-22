import { SectionHeading } from "@/components/ui";

/**
 * Profile (placeholder). Chrome (header + side menu) comes from the (app)
 * route-group layout via AppShell; this just identifies the page for now.
 */
export default function ProfilePage() {
  return (
    <SectionHeading
      eyebrow="Account"
      title="Profile"
      lead="This page is coming soon."
    />
  );
}
