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
    phone_number: phone_number,
    description: description,
  });

  if (profileError) {
    // Handle as PostgrestError
    return profileError;
  }

  return profileData;
}

export const getProfile = async () => {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    // Handle as AuthError
    return error;
  }

  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', data.user.id)
    .maybeSingle();

  if (profileError) {
    // Handle as PostgrestError
    return profileError;
  }

  return profileData;
}