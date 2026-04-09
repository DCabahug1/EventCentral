"use server";
import { createClient } from "./supabase/server";
import { Event } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

/** All events for an organization, ordered by start time (soonest first). */
export async function getEventsByOrganizationId(
  organizationId: number,
): Promise<Event[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("events")
    .select("*")
    .eq("organization_id", organizationId)
    .order("start_time", { ascending: true });

  if (error || !data) {
    return [];
  }
  return data as Event[];
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
