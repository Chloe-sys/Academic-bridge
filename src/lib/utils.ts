/**
 * Utility Functions
 *
 * Shared helpers used across the application.
 * - cn()            — Tailwind class merging (clsx + tailwind-merge)
 * - formatDate()    — human-readable date string
 * - getStatusColor() — priority → colour mapping
 * - generateId()    — random short ID for new entities
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely (handles conflicts like 'p-2 p-4') */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a date as "Jan 1, 2024" */
export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

/** Format a date range as "Jan 1, 2024 - Feb 2, 2024" */
export function formatDateRange(start: Date | string, end: Date | string): string {
  return `${formatDate(start)} - ${formatDate(end)}`;
}

/** Return Tailwind classes for a priority level */
export function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "high":   return "text-[#EF4444] bg-[#FEE2E2]";
    case "medium": return "text-[#F59E0B] bg-[#FEF3C7]";
    case "low":    return "text-[#7C3AED] bg-[#EDE9FE]";
    default:       return "text-[#6B7280] bg-[#F3F4F6]";
  }
}

/** Generate a short random ID (used when creating new tasks locally) */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
