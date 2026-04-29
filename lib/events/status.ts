import type { Event } from "../types";

export type EventStatus = "UPCOMING" | "STARTED" | "ENDED" | "CANCELLED";

export function getEventStatus(event: Event): EventStatus {
  if (event.CANCELLED) return "CANCELLED";
  const now = new Date();
  if (new Date(event.end_time) <= now) return "ENDED";
  if (new Date(event.start_time) <= now) return "STARTED";
  return "UPCOMING";
}

export const EVENT_STATUS_CONFIG: Record<
  EventStatus,
  { label: string; className: string }
> = {
  UPCOMING: {
    label: "Upcoming",
    className:
      "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
  },
  STARTED: {
    label: "Live",
    className:
      "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
  },
  ENDED: {
    label: "Ended",
    className:
      "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className:
      "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
  },
};
