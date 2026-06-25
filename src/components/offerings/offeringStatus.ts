import type { Offering } from "@/lib/data-access";

export type OfferingFilter = "all" | "draft" | "published" | "retired";

export function filterOfferings(offerings: Offering[], filter: OfferingFilter): Offering[] {
  if (filter === "all") return offerings;
  if (filter === "draft") return offerings.filter((o) => o.status === "DRAFT");
  if (filter === "published") return offerings.filter((o) => o.status === "ACTIVE");
  return offerings.filter((o) => o.status === "ARCHIVED" || o.status === "PAUSED");
}

export function offeringStatusLabel(status: string): string {
  switch (status) {
    case "ACTIVE":
      return "Published";
    case "DRAFT":
      return "Draft";
    case "PAUSED":
      return "Paused";
    case "ARCHIVED":
      return "Retired";
    default:
      return status;
  }
}

export function offeringStatusVariant(status: string): "success" | "warning" | "info" | "error" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "DRAFT":
      return "warning";
    case "PAUSED":
      return "info";
    case "ARCHIVED":
      return "error";
    default:
      return "info";
  }
}

export function formatOfferingPrice(priceCents: number, currency = "USD"): string {
  if (currency !== "USD") return `${priceCents / 100} ${currency}`;
  return `$${Math.round(priceCents / 100)}`;
}
