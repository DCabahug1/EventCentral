"use client";
import { createClient } from "../supabase/client";
import { distanceBetweenLocations } from "../utils";
import { Event } from "../types";
import { PostgrestError } from "@supabase/supabase-js";

export const getEvents = async (filters?: {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  eventType?: string;
  // True when searching from user GPS location.
  useUserLocation?: boolean;
  // Exact GPS coordinates only in geolocation mode.
  coordinates?: { lat: number; lng: number };
  // Radius in miles only in geolocation mode.
  radius?: number;
  // Bounding box of selected region only in region mode.
  regionBounds?: { north: number; south: number; east: number; west: number };
}): Promise<Event[]> => {
  const {
    startDate,
    endDate,
    keyword = "",
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
    .select("*")
    .eq("CANCELLED", false);

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
  const normalizedKeyword = keyword.trim().toLowerCase();

  // 2. Apply client side location filtering with two modes.
  return events.filter((event) => {
    if (normalizedKeyword) {
      const matchesKeyword =
        event.title.toLowerCase().includes(normalizedKeyword) ||
        (event.address ?? "").toLowerCase().includes(normalizedKeyword);
      if (!matchesKeyword) return false;
    }

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
    // If region bounds and coordinates are both missing then keep all events.

    return true;
  });
};

export const getEventById = async (id: number): Promise<Event | PostgrestError | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return error;
  if (!data) return null;
  return data as Event;
};