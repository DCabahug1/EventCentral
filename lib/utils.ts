import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function todayDateString(): string {
  return toDateString(new Date());
}

export function daysFromNowDateString(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return toDateString(d);
}

// Returns a YYYY-MM-DD string exactly one year after the given date string
export function addOneYear(dateStr: string): string {
  const d = new Date(dateStr);
  d.setFullYear(d.getFullYear() + 1);
  return toDateString(d);
}

// Returns the distance in miles between two lat/lng coordinate pairs
export function distanceBetweenLocations(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 3958.8; // Earth's radius in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// Formats an ISO date string to a readable "Month Day, Year at HH:MM AM/PM" label
export const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
