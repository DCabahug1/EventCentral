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
