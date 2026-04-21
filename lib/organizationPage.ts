import type { Event, Organization } from "@/lib/types";

export const ORG_EVENTS_PAGE_SIZE = 8;

export function normalizeWebsite(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;
  return t;
}

export function partitionEvents(events: Event[]) {
  const now = new Date();
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    if (new Date(e.end_time) >= now) upcoming.push(e);
    else past.push(e);
  }
  upcoming.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  past.sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );
  return { upcoming, past };
}

/**
 * Server actions and JSON can deserialize Postgres integers as strings.
 * Treat numeric strings as valid so create/load flows don't fail silently.
 */
export function isOrganization(value: unknown): value is Organization {
  if (typeof value !== "object" || value === null || !("id" in value) || !("name" in value)) {
    return false;
  }
  const row = value as { id: unknown; name: unknown };
  if (typeof row.name !== "string") return false;
  if (typeof row.id === "number" && Number.isFinite(row.id)) return true;
  if (typeof row.id === "string" && row.id !== "") {
    const n = Number(row.id);
    return Number.isFinite(n);
  }
  return false;
}
