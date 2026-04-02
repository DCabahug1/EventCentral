"use client";
import { createClient } from "./supabase/client";
import { distanceBetweenLocations } from "./utils";
import { Event } from "./types";

export const getEvents = async (filters?: {
  startDate?: string;
  endDate?: string;
  eventType?: string;
  // True when searching from the user's GPS location — applies radius distance check
  useUserLocation?: boolean;
  // Exact GPS coordinates — only set in geolocation mode
  coordinates?: { lat: number; lng: number };
  // Radius in miles — only used in geolocation mode
  radius?: number;
  // Bounding box of a selected region — only set in region mode
  regionBounds?: { north: number; south: number; east: number; west: number };
}): Promise<Event[]> => {
  const {
    startDate,
    endDate,
    eventType = "all",
    useUserLocation = false,
    coordinates,
    radius = 10,
    regionBounds,
  } = filters ?? {};

  const supabase = createClient();

  // 1. Query Supabase: filter by date range and category server-side.
  let query = supabase
    .from("events")
    .select("*");

  // Apply date predicates only when explicitly provided.
  // For timestampz, use full ISO boundaries to cover the selected day.
  if (startDate) {
    query = query.gte("start_time", `${startDate}T00:00:00.000Z`);
  }
  if (endDate) {
    query = query.lte("start_time", `${endDate}T23:59:59.999Z`);
  }

  if (eventType !== "all") {
    query = query.eq("category", eventType);
  }

  const { data, error } = await query;

  if (error || !data) {
    console.error("getEvents: Supabase query failed:", error);
    return [];
  }

  const events = data as Event[];

  // 2. Apply client-side location filtering — two mutually exclusive modes.
  return events.filter((event) => {
    if (useUserLocation && coordinates) {
      // Geolocation mode: include only events within the specified radius
      if (event.lat == null || event.lng == null) return false;
      const miles = distanceBetweenLocations(
        coordinates.lat,
        coordinates.lng,
        event.lat,
        event.lng,
      );
      if (miles > radius) return false;
    } else if (!useUserLocation && regionBounds) {
      // Region mode: include only events whose coordinates fall inside the
      // bounding box of the selected city / state / country
      if (event.lat == null || event.lng == null) return false;
      const { north, south, east, west } = regionBounds;
      if (
        event.lat < south ||
        event.lat > north ||
        event.lng < west ||
        event.lng > east
      )
        return false;
    }
    // If neither condition matches (no regionBounds, no coordinates), no location
    // filter is applied — this covers the "United States" default which shows all events.

    return true;
  });
};
