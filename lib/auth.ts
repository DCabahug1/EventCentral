'use client'
import { createClient } from "./supabase/client";

export const signInWithGoogle = async (next: string = "/discover") => {
  const supabase = createClient();
  const callbackUrl = new URL(`${window.location.origin}/auth/callback`);
  callbackUrl.searchParams.set("next", next);
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl.toString(),
    },
  });

  if (error) {
    return error;
  }

  return data;
}

export const signUpWithEmailAndPassword = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return error
  }
  
  return data;
}

export const signInWithEmailAndPassword = async (email: string, password: string) => {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return error;
  }

  return data;
}

export const signOut = async () => {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    return error;
  }

  return true;
}