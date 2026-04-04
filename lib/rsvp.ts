'use server'
import { createClient } from "./supabase/server";
import { RSVP } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

type RSVPInput = Omit<RSVP, "id" | "user_id" | "status" | "created_at">;

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

// Cancels the currently authenticated user's RSVP for an event.
// Soft delete — sets status to CANCELLED instead of removing the row.
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
  return null;
}