"use client";

import { useQuery } from "@tanstack/react-query";
import { offeringsOptions } from "../queries/offerings.query";

/** List the current guide's tour offerings. */
export function useOfferings() {
  return useQuery(offeringsOptions());
}
