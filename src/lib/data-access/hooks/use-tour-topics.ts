"use client";

import { useQuery } from "@tanstack/react-query";
import { tourTopicsOptions } from "../queries/tour-topics.query";

/** The backend controlled vocabulary for tour topics (GET /v1/meta/tour-topics). */
export function useTourTopics() {
  return useQuery(tourTopicsOptions());
}
