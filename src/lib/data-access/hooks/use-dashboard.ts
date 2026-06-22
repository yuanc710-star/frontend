"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardOptions } from "../queries/dashboard.query";

/** The signed-in home aggregate — one call, role-shaped by the BFF (`kind`). */
export function useDashboard() {
  return useQuery(dashboardOptions());
}
