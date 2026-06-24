import { Button, StatusBadge } from "@/components/ui";
import type { RecommendedOffering } from "@/lib/data-access/types";
import { formatPrice } from "@/lib/format";

export function OfferingCard({ offering }: { offering: RecommendedOffering }) {
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-border bg-card shadow-card">
      {/* Image */}
      <div className="flex h-[140px] items-center justify-center bg-canvas text-[12px] text-ink-soft">
        {offering.imageUrl ? (
          <img
            src={offering.imageUrl}
            alt={offering.title}
            className="h-full w-full object-cover"
          />
        ) : (
          "Imported campus crop"
        )}
      </div>

      <div className="flex flex-1 flex-col p-[18px]">
        {offering.isVerifiedGuide && (
          <StatusBadge variant="success" className="self-start">
            Verified guide
          </StatusBadge>
        )}

        <h4 className="h4 mt-3 mb-auto leading-snug">{offering.title}</h4>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-[13px] text-ink-soft">
            {offering.durationMin} min · {formatPrice(offering.priceCents, offering.currency)}
          </span>
          <Button variant="secondary" size="sm">
            View tour
          </Button>
        </div>
      </div>
    </article>
  );
}
