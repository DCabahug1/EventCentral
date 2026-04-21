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
): Promise<Organization | Error | PostgrestError | null> => {
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

export const getOrganizationsByUserId = async (
  user_id: string,
): Promise<Organization[] | PostgrestError | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select(
      "id,user_id,name,description,avatar_url,banner_url,website,email,phone,location,created_at,updated_at",
    )
    .eq("user_id", user_id);
  if (error) {
    return error;
  }
  return data;
};

export const getOrganizationsByUserIdPage = async (
  user_id: string,
  page: number,
  pageSize: number,
): Promise<{ items: Organization[]; total: number } | PostgrestError> => {
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const from = (safePage - 1) * safePageSize;
  const to = from + safePageSize - 1;

  const supabase = await createClient();
  const { data, count, error } = await supabase
    .from("organizations")
    .select(
      "id,user_id,name,description,avatar_url,banner_url,website,email,phone,location,created_at,updated_at",
      { count: "exact" },
    )
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) return error;
  return { items: (data ?? []) as Organization[], total: count ?? 0 };
};

export const getOrganizationById = async (
  id: number,
): Promise<Organization | PostgrestError | null> => {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select(
      "id,user_id,name,description,avatar_url,banner_url,website,email,phone,location,created_at,updated_at",
    )
    .eq("id", id)
    .single();

  if (error) {
    return error;
  }

  return data;
};

export const updateOrganization = async (
  id: number,
  name: string,
  description: string,
  avatar_url: string | null,
  banner_url: string | null,
  website: string | null,
  email: string | null,
  phone: string | null,
  location: string | null,
): Promise<Organization | Error | PostgrestError | null> => {
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return new Error("You must be signed in to update an organization.");
  }

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
    .eq("user_id", authData.user.id)
    .select()
    .single();

  if (error) {
    return error;
  }

  return data;
};

export const deleteOrganization = async (
  id: number,
): Promise<void | PostgrestError | null> => {
  const supabase = await createClient();
  const { error } = await supabase.from("organizations").delete().eq("id", id);

  if (error) {
    return error;
  }

  return null;
};
