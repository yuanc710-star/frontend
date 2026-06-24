"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activateOfferingMutation } from "../mutations/activate-offering.mutation";

/** Publish a draft (or re-activate a paused) offering. */
export function useActivateOffering() {
  const qc = useQueryClient();
  return useMutation(activateOfferingMutation(qc));
}
