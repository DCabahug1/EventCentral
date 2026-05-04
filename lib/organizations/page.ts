import type { Organization } from "@/lib/types";

export const ORG_EVENTS_PAGE_SIZE = 8;

export function normalizeWebsite(input: string): string | null {
  const trimmedInput = input.trim();
  if (!trimmedInput) return null;
  if (!/^https?:\/\//i.test(trimmedInput)) return `https://${trimmedInput}`;
  return trimmedInput;
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
    const parsedId = Number(row.id);
    return Number.isFinite(parsedId);
  }
  return false;
}
