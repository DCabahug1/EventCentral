'use server'
import { createClient } from "./supabase/server";
import { RSVP } from "./types";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";

type RSVPInput = Omit<RSVP, "id" | "user_id" | "status" | "created_at">;

async function syncRsvpCount(supabase: SupabaseClient, event_id: number) {
  const { count } = await supabase
    .from('rsvps')
    .select('*', { count: 'exact', head: true })
    .eq('event_id', event_id)
    .eq('status', 'CONFIRMED');
  await supabase
    .from('events')
    .update({ rsvp_count: count ?? 0 })
    .eq('id', event_id);
}

// Registers the currently authenticated user for an event.
// Returns the inserted row or an Error/PostgrestError on failure.
export const createRSVP = async (
  input: RSVPInput
): Promise<RSVP | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to RSVP.");
  }

  // Check if user already has an RSVP for this event
  const { data: existing } = await supabase
    .from('rsvps')
    .select('id, status')
    .eq('event_id', input.event_id)
    .eq('user_id', user.id)
    .maybeSingle();

  if (existing) {
    if (existing.status === 'CONFIRMED') {
      return new Error("You are already registered for this event.");
    }
    // If previously cancelled, reactivate it
    const { data, error } = await supabase
      .from('rsvps')
      .update({ status: 'CONFIRMED' })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) return error;
    await syncRsvpCount(supabase, input.event_id);
    return data as RSVP;
  }

  // Check event capacity before inserting
  const { data: event } = await supabase
    .from('events')
    .select('max_capacity')
    .eq('id', input.event_id)
    .single();

  if (event?.max_capacity !== null) {
    const { count } = await supabase
      .from('rsvps')
      .select('id', { count: 'exact', head: true })
      .eq('event_id', input.event_id)
      .eq('status', 'CONFIRMED');

      if (count !== null && event && event.max_capacity !== null && count >= event.max_capacity) {
      return new Error("This event is at full capacity.");
    }
  }

  // Insert new RSVP
  const { data, error } = await supabase
    .from('rsvps')
    .insert({
      event_id: input.event_id,
      user_id: user.id,
      status: 'CONFIRMED',
    })
    .select()
    .single();

  if (error) return error;
  await syncRsvpCount(supabase, input.event_id);
  return data as RSVP;
}

// Fetches all RSVPs for a given event.
// Returns an array of RSVPs or a PostgrestError on failure.
export const getRSVPsByEvent = async (
  event_id: number
): Promise<RSVP[] | PostgrestError | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('event_id', event_id)
    .eq('status', 'CONFIRMED')
    .order('created_at', { ascending: false });

  if (error) return error;
  return data as RSVP[];
}

// Fetches all RSVPs for the currently authenticated user.
// Returns an array of RSVPs or an Error/PostgrestError on failure.
export const getRSVPsByUser = async (): Promise<RSVP[] | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to view RSVPs.");
  }

  const { data, error } = await supabase
    .from('rsvps')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return error;
  return data as RSVP[];
}

// Returns the first `limit` confirmed attendee profiles (username + avatar_url) for an event.
export const getEventAttendeeAvatars = async (
  eventId: number,
  limit = 4,
): Promise<{ username: string | null; avatar_url: string | null }[]> => {
  const supabase = await createClient();

  const { data: rsvps } = await supabase
    .from("rsvps")
    .select("user_id")
    .eq("event_id", eventId)
    .eq("status", "CONFIRMED")
    .limit(limit);

  if (!rsvps || rsvps.length === 0) return [];

  const userIds = rsvps.map((r: { user_id: string }) => r.user_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("username, avatar_url")
    .in("user_id", userIds);

  return (profiles ?? []).map((p) => ({
    username: (p.username as string | null) ?? null,
    avatar_url: (p.avatar_url as string | null) ?? null,
  }));
};

// Returns the current confirmed RSVP count for an event from the events table.
export const getEventRsvpCount = async (event_id: number): Promise<number> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from('events')
    .select('rsvp_count')
    .eq('id', event_id)
    .single();
  return data?.rsvp_count ?? 0;
};

// Cancels the currently authenticated user's RSVP for an event.
// Soft delete sets status to CANCELLED instead of deleting the row.
// Returns null on success or an Error/PostgrestError on failure.
export const cancelRSVP = async (
  event_id: number
): Promise<null | Error | PostgrestError> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to cancel an RSVP.");
  }

  const { error } = await supabase
    .from('rsvps')
    .update({ status: 'CANCELLED' })
    .eq('event_id', event_id)
    .eq('user_id', user.id);

  if (error) return error;
  await syncRsvpCount(supabase, event_id);
  return null;
}