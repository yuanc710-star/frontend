"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOfferingMutation } from "../mutations/create-offering.mutation";

/** Create a new DRAFT tour offering. */
export function useCreateOffering() {
  const qc = useQueryClient();
  return useMutation(createOfferingMutation(qc));
}
