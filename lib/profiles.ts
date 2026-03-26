'use server'
import { createClient } from "./supabase/server";

export const createProfile = async (username: string, phone_number: string, description: string) => {
  const supabase = await createClient();
  const {data, error} = await supabase.auth.getUser();

  if (error) {
    // Handle as AuthError
    return error;
  }

  const {data: profileData, error: profileError} = await supabase.from('profiles').insert({
    user_id: data.user?.id,
    email: data.user?.email,
    username: username,
    phone_number: phone_number || null,
    description: description || null,
  });

  if (profileError) {
    // Handle as PostgrestError
    return profileError;
  }

  return profileData;
}

export const getProfile = async (user_id: string) => {
  const supabase = await createClient();

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle();

  if (profileError) {
    // Handle as PostgrestError
    return profileError;
  }

  return profileData;
}
