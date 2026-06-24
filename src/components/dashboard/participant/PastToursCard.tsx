import { Card, Link } from "@/components/ui";

export function PastToursCard() {
  return (
    <Card>
      <p className="eyebrow mb-1">History</p>
      <h3 className="h3 mb-2">Your past tours</h3>
      <p className="text-sm text-ink-soft mb-4 leading-relaxed">
        Review completed tours, recordings when available, and booking history.
      </p>
      <Link href="/tour-history" variant="secondary" block>
        My Tours
      </Link>
    </Card>
  );
}
