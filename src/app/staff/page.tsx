/**
 * Staff entry placeholder. The full ADMIN/SUPPORT console is out
 * of scope for now; this page exists so the role guards have a valid destination
 * instead of a 404. Access is gated by the staff layout (staff role required).
 */
export default function StaffPage() {
  return (
    <main className="mx-auto max-w-content px-6 py-16">
      <h1 className="font-display text-2xl font-bold text-ink">Staff area</h1>
      <p className="mt-2 text-ink-soft">The admin &amp; support console is coming soon.</p>
    </main>
  );
}
