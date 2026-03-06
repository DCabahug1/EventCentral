"use client";
import { createClient } from "./supabase/client";
import { createProfile } from "./profiles";

export const signUpWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.log("signUpWithEmailAndPassword() Failed:", error);
    return error;
  }

  if (!data.user) {
    console.log("signUpWithEmailAndPassword() Failed: No user returned");
    return new Error("No user returned from sign up");
  }

  const { profile, error: profileError } = await createProfile(data.user)
  
  if (profileError) {
    console.log('createProfile() Failed:', profileError)
    return profileError;
  }
  
  return data.user;
};

export const signInWithEmailAndPassword = async (
  email: string,
  password: string
) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("signInWithEmailAndPassword() Failed:", error);
    return error;
  }

  return data.user;
};

export const continueWithGoogle = async () => {
  const supabase = createClient();

  supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.origin + '/auth/callback',
    },
  })
}
