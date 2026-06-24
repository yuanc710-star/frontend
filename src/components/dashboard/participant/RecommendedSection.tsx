import { Link } from "@/components/ui";
import type { RecommendedOffering } from "@/lib/data-access/types";
import { OfferingCard } from "@/components/tours/OfferingCard";

export function RecommendedSection({ offerings }: { offerings: RecommendedOffering[] }) {
  if (offerings.length === 0) return null;

  return (
    <section>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="eyebrow mb-1">Recommended</p>
          <h3 className="h3">Keep exploring</h3>
        </div>
        <Link href="/tours" className="text-sm font-semibold mt-1">
          See all tours
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {offerings.map((offering) => (
          <OfferingCard key={offering.id} offering={offering} />
        ))}
      </div>
    </section>
  );
}
