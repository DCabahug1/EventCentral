"use server";
import { createClient } from "./supabase/server";
import { Organization } from "./types";
import { PostgrestError } from "@supabase/supabase-js";

export const createOrganization = async (
  name: string,
  description: string,
  avatar_url: string | null,
  banner_url: string | null,
  website: string | null,
  email: string | null,
  phone: string | null,
  location: string | null,
) : Promise<Organization | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError) {
    return authError;
  }

  if (!authData.user) {
    return {
      message: "User not authenticated.",
      details: "",
      hint: "",
      code: "401",
      name: "PostgrestError",
    } as PostgrestError;
  }

  const { data, error } = await supabase
    .from("organizations")
    .insert({
      user_id: authData.user.id,
      name: name,
      description: description,
      avatar_url: avatar_url,
      banner_url: banner_url,
      website: website,
      email: email,
      phone: phone,
      location: location,
    })
    .select()
    .single();

  if (error) {
    return error;
  }

  return data;
};

export const getOrganizationsByUserId = async (user_id: string): Promise<Organization[] | PostgrestError | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").eq("user_id", user_id);
  if (error) {
    return error;
  }
  return data;
};

export const getOrganizationById = async (id: number): Promise<Organization | PostgrestError | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase.from("organizations").select("*").eq("id", id).single();

  if (error) {
    return error;
  }

  return data;
};

export const updateOrganization = async (id: number, name: string, description: string, avatar_url: string | null, banner_url: string | null, website: string | null, email: string | null, phone: string | null, location: string | null): Promise<Organization | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .update({
      name: name,
      description: description,
      avatar_url: avatar_url,
      banner_url: banner_url,
      website: website,
      email: email,
      phone: phone,
      location: location,
    })
    .eq("id", id)
    .select()
    .single();
  
  if (error) {
    return error;
  }

  return data;
}

export const deleteOrganization = async (id: number): Promise<void | PostgrestError | null> => {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);
  
  if (error) {
    return error;
  }

  return null;
};
