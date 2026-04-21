"use server";
import { createClient } from "./supabase/server";
import { Event } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

/** All events the currently authenticated user has a confirmed RSVP for. */
export async function getAttendingEvents(userId?: string): Promise<Event[]> {
  const supabase = await createClient();

  const resolvedUserId = userId ?? (
    await supabase.auth.getUser()
  ).data.user?.id;
  if (!resolvedUserId) return [];

  const { data: rsvps, error: rsvpError } = await supabase
    .from("rsvps")
    .select("event_id")
    .eq("user_id", resolvedUserId)
    .eq("status", "CONFIRMED");

  if (rsvpError || !rsvps || rsvps.length === 0) return [];

  const ids = rsvps.map((r: { event_id: number }) => r.event_id);

  const { data, error } = await supabase
    .from("events")
    .select(
      "id,organization_id,organization_name,rsvp_count,user_id,title,description,start_time,end_time,address,location_details,lat,lng,max_capacity,image_url,category,status,created_at,updated_at",
    )
    .in("id", ids)
    .order("start_time", { ascending: true });

  if (error || !data) return [];
  return data as Event[];
}

export async function getAttendingEventsPage(
  userId: string,
  bucket: "upcoming" | "past",
  page: number,
  pageSize: number,
): Promise<{ items: Event[]; total: number }> {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const supabase = await createClient();

  const { data: rsvps, error: rsvpError } = await supabase
    .from("rsvps")
    .select("event_id")
    .eq("user_id", userId)
    .eq("status", "CONFIRMED");

  if (rsvpError || !rsvps || rsvps.length === 0) return { items: [], total: 0 };

  const ids = rsvps.map((row) => row.event_id);
  const nowIso = new Date().toISOString();

  let eventQuery = supabase
    .from("events")
    .select(
      "id,organization_id,organization_name,rsvp_count,user_id,title,description,start_time,end_time,address,location_details,lat,lng,max_capacity,image_url,category,status,created_at,updated_at",
      { count: "exact" },
    )
    .in("id", ids);

  eventQuery =
    bucket === "upcoming"
      ? eventQuery.gte("end_time", nowIso).order("start_time", { ascending: true })
      : eventQuery.lt("end_time", nowIso).order("start_time", { ascending: false });

  const { data, error, count } = await eventQuery
    .range(from, to);

  if (error || !data) return { items: [], total: 0 };
  return { items: data as Event[], total: count ?? 0 };
}

/** All events for an organization, ordered by start time (soonest first). */
export async function getEventsByOrganizationId(
  organizationId: number,
): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id,organization_id,organization_name,rsvp_count,user_id,title,description,start_time,end_time,address,location_details,lat,lng,max_capacity,image_url,category,status,created_at,updated_at",
    )
    .eq("organization_id", organizationId)
    .order("start_time", { ascending: true });

  if (error || !data) {
    return [];
  }
  return data as Event[];
}

export async function getEventById(
  id: number,
): Promise<Event | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select(
      "id,organization_id,organization_name,rsvp_count,user_id,title,description,start_time,end_time,address,location_details,lat,lng,max_capacity,image_url,category,status,created_at,updated_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as Event;
}

type EventInput = Omit<Event, "id" | "user_id" | "created_at" | "updated_at">;
type EventUpdate = Partial<EventInput>;

// Creates a new event row owned by the currently authenticated user.
// Returns the inserted row or an Error/PostgrestError on failure.
export async function createEvent(
  input: EventInput
): Promise<Event | Error | PostgrestError | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to create an event.");
  }

  const { data, error } = await supabase
    .from("events")
    .insert({ ...input, user_id: user.id })
    .select()
    .single();

  if (error) return error;
  return data as Event;
}

// Updates an existing event by ID.
// Returns the updated row or an Error/PostgrestError on failure.
export async function updateEvent(
  id: number,
  updates: EventUpdate
): Promise<Event | Error | PostgrestError | null> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to update an event.");
  }

  const { data, error } = await supabase
    .from("events")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) return error;
  return data as Event;
}

// Deletes an event by ID.
// Returns null on success or an Error/PostgrestError on failure.
export async function deleteEvent(
  id: number
): Promise<null | Error | PostgrestError> {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to delete an event.");
  }

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return error;
  return null;
}
