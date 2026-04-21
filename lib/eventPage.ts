import type { Event } from "@/lib/types";

/** Server actions / JSON may use string ids — align with `isOrganization`. */
export function isEvent(value: unknown): value is Event {
  if (typeof value !== "object" || value === null || !("id" in value)) {
    return false;
  }
  const row = value as { id: unknown; title?: unknown };
  if (typeof row.title !== "string") return false;
  if (typeof row.id === "number" && Number.isFinite(row.id)) return true;
  if (typeof row.id === "string" && row.id !== "") {
    const n = Number(row.id);
    return Number.isFinite(n);
  }
  return false;
}
