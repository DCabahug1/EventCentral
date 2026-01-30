"use server";
import { createClient } from "./supabase/server";
import { User } from "@supabase/supabase-js";

export const createProfile = async (user: User) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").insert({
    user_id: user.id,
    email: user.email,
    avatar_url: user.user_metadata.avatar_url,
  });

  if (error) {
    console.log("createProfile() Failed:", error);
    return { profile: null, error };
  }

  return { profile: data, error: null };
};

export const getProfile = async (user_id:string) => {
  const supabase = await createClient();

  const { data: profile, error } = await supabase.from("profiles").select("*").eq("user_id", user_id).single();

  if (error) {
    console.log("getProfile() Failed:", error);
    return { profile: null, error };
  }

  return { profile, error: null };
}

export const checkUsernameExists = async (username: string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").select("username").eq("username", username);

  if (error) {
    console.log("checkUsernameExists() Failed:", error);
    return { exists: false, error };
  }

  return { exists: data && data.length > 0, error: null };
}

export const setUsername = async (user_id:string, username:string) => {
  const supabase = await createClient();

  const { data, error } = await supabase.from("profiles").update({ username }).eq("user_id", user_id);

  if (error) {
    console.log("setUsername() Failed:", error);
    return { profile: null, error };
  }

  return { profile: data, error: null };
}
