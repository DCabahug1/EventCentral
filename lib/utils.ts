import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

const MAX_IMAGE_UPLOAD_BYTES = 5 * 1024 * 1024;

export function imageSizeError(file: File): string | null {
  if (file.size > MAX_IMAGE_UPLOAD_BYTES) {
    return "Image must be 5MB or smaller.";
  }
  return null;
}

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
}

export function todayDateString(): string {
  return toDateString(new Date());
}

export function daysFromNowDateString(days: number): string {
  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + days);
  return toDateString(targetDate);
}

// Returns a YYYY-MM-DD string exactly one year after the given date string
export function addOneYear(dateStr: string): string {
  const targetDate = new Date(dateStr);
  targetDate.setFullYear(targetDate.getFullYear() + 1);
  return toDateString(targetDate);
}

// Returns the distance in miles between two lat/lng coordinate pairs
export function distanceBetweenLocations(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const earthRadiusMiles = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const haversineFactor =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return earthRadiusMiles * 2 * Math.atan2(Math.sqrt(haversineFactor), Math.sqrt(1 - haversineFactor));
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

/** US 10-digit phone for tel: links (digits only). Handles string, number, or 11-digit +1. */
export function phoneDigitsForTel(
  phone: string | number | null | undefined,
): string {
  let digits = String(phone ?? "").replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("1")) digits = digits.slice(1);
  return digits.slice(0, 10);
}

/** Display / stored value as (XXX) XXX-XXXX when 10 digits; partial groups while shorter. */
export function formatUsPhoneDisplay(
  phone: string | number | null | undefined,
): string {
  const digits = phoneDigitsForTel(phone);
  if (digits.length === 0) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

/** Controlled input: format as user types (US 10-digit). */
export function formatUsPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}
