import type { Event } from "@/lib/types";

/** Server actions and JSON can return string ids so accept numeric strings. */
export function isEvent(value: unknown): value is Event {
  if (typeof value !== "object" || value === null || !("id" in value)) {
    return false;
  }
  const row = value as { id: unknown; title?: unknown };
  if (typeof row.title !== "string") return false;
  if (typeof row.id === "number" && Number.isFinite(row.id)) return true;
  if (typeof row.id === "string" && row.id !== "") {
    const parsedId = Number(row.id);
    return Number.isFinite(parsedId);
  }
  return false;
}
