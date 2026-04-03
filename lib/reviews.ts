'use server'
import { createClient } from "./supabase/server";
import { Review } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

type ReviewInput = Omit<Review, "id" | "user_id" | "created_at" | "edited_at">;
type ReviewUpdate = Partial<Pick<Review, "rating" | "content">>;

// Creates a review for a completed event.
// Returns the inserted row or an Error/PostgrestError on failure.
export const createReview = async (
  input: ReviewInput
): Promise<Review | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to leave a review.");
  }

  // Business rule: event must be completed/ended
  const { data: event } = await supabase
    .from('events')
    .select('status')
    .eq('id', input.event_id)
    .single();

  if (!event) {
    return new Error("Event not found.");
  }

  if (event.status !== 'ENDED' && event.status !== 'COMPLETED') {
    return new Error("You can only review an event that has ended.");
  }

  // Business rule: user must have attended (confirmed RSVP)
  const { data: rsvp } = await supabase
    .from('rsvps')
    .select('id')
    .eq('event_id', input.event_id)
    .eq('user_id', user.id)
    .eq('status', 'CONFIRMED')
    .maybeSingle();

  if (!rsvp) {
    return new Error("You must have attended this event to leave a review.");
  }

  // Business rule: rating must be between 1 and 5
  if (input.rating < 1 || input.rating > 5) {
    return new Error("Rating must be between 1 and 5.");
  }

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      ...input,
      user_id: user.id,
    })
    .select()
    .single();

  if (error) return error;
  return data as Review;
}

// Fetches all reviews for a given event.
// Returns an array of reviews or a PostgrestError on failure.
export const getReviewsByEvent = async (
  event_id: number
): Promise<Review[] | PostgrestError | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('event_id', event_id)
    .order('created_at', { ascending: false });

  if (error) return error;
  return data as Review[];
}

// Fetches all reviews written by the currently authenticated user.
// Returns an array of reviews or an Error/PostgrestError on failure.
export const getReviewsByUser = async (): Promise<Review[] | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to view their reviews.");
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return error;
  return data as Review[];
}

// Updates an existing review by ID.
// Only the review's author can update it.
// Returns the updated row or an Error/PostgrestError on failure.
export const updateReview = async (
  id: number,
  updates: ReviewUpdate
): Promise<Review | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to update a review.");
  }

  // Validate rating if it's being updated
  if (updates.rating !== undefined && (updates.rating < 1 || updates.rating > 5)) {
    return new Error("Rating must be between 1 and 5.");
  }

  const { data, error } = await supabase
    .from('reviews')
    .update({
      ...updates,
      edited_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return error;
  return data as Review;
}

// Deletes a review by ID.
// Only the review's author can delete it.
// Returns null on success or an Error/PostgrestError on failure.
export const deleteReview = async (
  id: number
): Promise<null | Error | PostgrestError> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to delete a review.");
  }

  const { error } = await supabase
    .from('reviews')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  if (error) return error;
  return null;
}