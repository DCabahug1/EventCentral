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
