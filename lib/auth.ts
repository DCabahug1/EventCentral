"use client";
import { createClient } from "./supabase/client";

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
    return { user: null, error };
  }

  return { user: data.user, error: null };
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
    return { user: null, error };
  }

  return { user: data.user, error: null };
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
