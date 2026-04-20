"use client";
import { createClient } from "./supabase/client";

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export const uploadImageToBucket = async (
  file: File,
  bucket: string,
  path: string,
): Promise<string> => {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Unsupported image type. Use JPEG, PNG, or WEBP.");
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    throw new Error("Image exceeds the 5MB size limit.");
  }

  const supabase = createClient();
  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
};

/** Public bucket for org avatar & banner images (create in Supabase if missing). */
export const ORGANIZATIONS_BUCKET = "organizations";
export const PROFILES_BUCKET = "profiles";

export async function uploadOrganizationAsset(
  file: File,
  userId: string,
  kind: "avatar" | "banner",
): Promise<string> {
  const extMatch = file.name.match(/\.(jpe?g|png|webp)$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";
  const path = `${userId}/${kind}-${crypto.randomUUID()}${ext}`;
  return uploadImageToBucket(file, ORGANIZATIONS_BUCKET, path);
}

export async function uploadProfileAvatar(
  file: File,
  userId: string,
): Promise<string> {
  const extMatch = file.name.match(/\.(jpe?g|png|webp)$/i);
  const ext = extMatch ? extMatch[0].toLowerCase() : ".jpg";
  const path = `${userId}/avatar-${crypto.randomUUID()}${ext}`;
  return uploadImageToBucket(file, PROFILES_BUCKET, path);
}
