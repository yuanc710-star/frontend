import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Class-name helper used across the UI library. `clsx` handles conditional
 * inputs (strings, arrays, objects), and `tailwind-merge` resolves conflicting
 * Tailwind utilities so a passed-in `className` reliably overrides a component's
 * defaults — e.g. cn("p-[18px]", "p-0") → "p-0".
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
