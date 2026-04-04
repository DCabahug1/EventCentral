'use server'
import { createClient } from "./supabase/server";
import { Profile } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

type ProfileInput = Omit<Profile, "id" | "user_id" | "email" | "created_at" | "updated_at">;
type ProfileUpdate = Partial<ProfileInput>;

// Creates a new profile for the currently authenticated user.
// Returns the inserted row or an Error/PostgrestError on failure.
export const createProfile = async (
  input: ProfileInput
): Promise<Profile | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to create a profile.");
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert({
      ...input,
      user_id: user.id,
      email: user.email,
    })
    .select()
    .single();

  if (error) return error;
  return data as Profile;
}

// Fetches a profile by user_id.
// Returns the profile row, null if not found, or a PostgrestError on failure.
export const getProfile = async (
  user_id: string
): Promise<Profile | PostgrestError | null> => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle();

  if (error) return error;
  return data as Profile;
}

// Updates the currently authenticated user's profile.
// Returns the updated row or an Error/PostgrestError on failure.
export const updateProfile = async (
  updates: ProfileUpdate
): Promise<Profile | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to update a profile.");
  }

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('user_id', user.id)
    .select()
    .single();

  if (error) return error;
  return data as Profile;
}

// Deletes the currently authenticated user's profile.
// Returns null on success or an Error/PostgrestError on failure.
export const deleteProfile = async (): Promise<null | Error | PostgrestError> => {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Error("User must be authenticated to delete a profile.");
  }

  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('user_id', user.id);

  if (error) return error;
  return null;
}