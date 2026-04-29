'use client'
import { createClient } from "../supabase/client";

export const signInWithGoogle = async (next: string = "/discover") => {
  const supabase = createClient();
  // Persist `next` in a short-lived cookie. Supabase's OAuth flow does not
  // always preserve query params on `redirectTo`, so the callback route
  // falls back to this cookie when the `next` query param is missing.
  document.cookie = `auth_next=${encodeURIComponent(next)}; Path=/; Max-Age=600; SameSite=Lax`;
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