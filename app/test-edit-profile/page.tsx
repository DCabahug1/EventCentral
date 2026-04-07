"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/client";

const USERNAME_REGEX = /^[A-Za-z0-9._-]+$/;

function getErrorMessage(result: unknown, fallback: string): string {
  if (result instanceof Error) return result.message;
  if (
    result &&
    typeof result === "object" &&
    "message" in result &&
    typeof (result as { message?: unknown }).message === "string"
  ) {
    return (result as { message: string }).message;
  }
  return fallback;
}

function parsePhoneNumberOrThrow(value: string): number | null {
  const raw = value.trim();
  if (!raw) return null;

  // Accept only digits and optional separators: space, -, (, )
  if (!/^[\d\s\-()]+$/.test(raw)) {
    throw new Error(
      "Invalid phone format. Use digits with optional spaces, dashes, or parentheses.",
    );
  }

  const digits = raw.replace(/\D/g, "");
  if (!digits) return null;

  if (digits.length < 10 || digits.length > 15) {
    throw new Error("Phone number must be between 10 and 15 digits.");
  }

  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) {
    throw new Error("Invalid phone number.");
  }
  return parsed;
}

function validateOptionalUrl(url: string): string | null {
  const raw = url.trim();
  if (!raw) return null;

  try {
    const parsed = new URL(raw);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      throw new Error("Avatar URL must start with http:// or https://");
    }
    return raw;
  } catch {
    throw new Error("Invalid avatar URL.");
  }
}

function formatUsPhoneDisplay(phone: string | number | null | undefined): string {
  const digits = String(phone ?? "")
    .replace(/\D/g, "")
    .slice(0, 10);
  if (!digits) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function formatUsPhoneInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (!digits) return "";
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

export default function page() {
  const [updateData, setUpdateData] = useState({
    username: "",
    avatar_url: "",
    phone_number: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [usernameError, setUsernameError] = useState("");
  const [avatarUrlError, setAvatarUrlError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [result, setResult] = useState<unknown>(null);

  useEffect(() => {
    const loadCurrentProfile = async () => {
      setLoadingProfile(true);
      setErrorMessage("");
      try {
        const supabase = createClient();
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          setErrorMessage("You must be signed in to load your profile.");
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          setErrorMessage(error.message);
          return;
        }

        if (!data) {
          setErrorMessage("No existing profile found for this user.");
          return;
        }

        setUpdateData({
          username: data.username ?? "",
          avatar_url: data.avatar_url ?? "",
          phone_number: formatUsPhoneDisplay(data.phone_number),
          description: data.description ?? "",
        });
      } finally {
        setLoadingProfile(false);
      }
    };

    void loadCurrentProfile();
  }, []);

  const start = () => {
    setLoading(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const done = () => setLoading(false);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    start();
    try {
      if (usernameError) {
        setErrorMessage(usernameError);
        return;
      }

      if (avatarUrlError) {
        setErrorMessage(avatarUrlError);
        return;
      }

      if (phoneError) {
        setErrorMessage(phoneError);
        return;
      }

      const updates: {
        username?: string | null;
        avatar_url?: string | null;
        phone_number?: number | null;
        description?: string | null;
      } = {};

      if (updateData.username.trim() !== "") {
        const username = updateData.username.trim();
        if (username.length < 3 || username.length > 12) {
          setErrorMessage("Username must be between 3 and 12 characters.");
          return;
        }
        if (!USERNAME_REGEX.test(username)) {
          setErrorMessage(
            "Username can only contain letters, numbers, dots, underscores, and hyphens (no spaces).",
          );
          return;
        }
        updates.username = username;
      }

      if (updateData.avatar_url.trim() !== "") {
        try {
          updates.avatar_url = validateOptionalUrl(updateData.avatar_url);
        } catch (error) {
          setErrorMessage(getErrorMessage(error, "Invalid avatar URL."));
          return;
        }
      }

      if (updateData.phone_number.trim() !== "") {
        try {
          updates.phone_number = parsePhoneNumberOrThrow(updateData.phone_number);
        } catch (error) {
          setErrorMessage(getErrorMessage(error, "Invalid phone number."));
          return;
        }
      }

      if (updateData.description.trim() !== "") {
        const description = updateData.description.trim();
        if (description.length > 500) {
          setErrorMessage("Description must be 500 characters or less.");
          return;
        }
        updates.description = description;
      }

      if (Object.keys(updates).length === 0) {
        setErrorMessage("Provide at least one field to update");
        return;
      }

      const response = await updateProfile(updates);
      setResult(response);

      if (
        response instanceof Error ||
        (response &&
          typeof response === "object" &&
          "code" in response &&
          "message" in response)
      ) {
        setErrorMessage(getErrorMessage(response, "Update profile failed"));
        return;
      }

      setSuccessMessage("Profile updated successfully.");

      if (
        response &&
        typeof response === "object" &&
        "username" in response
      ) {
        const updated = response as {
          username?: string | null;
          avatar_url?: string | null;
          phone_number?: number | null;
          description?: string | null;
        };
        setUpdateData({
          username: updated.username ?? "",
          avatar_url: updated.avatar_url ?? "",
          phone_number: formatUsPhoneDisplay(updated.phone_number),
          description: updated.description ?? "",
        });
      }
    } finally {
      done();
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Test Edit Profile</h1>

      <Card>
        <CardHeader>
          <CardTitle>Update Current User Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdate} className="space-y-2">
            <FieldGroup>
              <Field>
                <FieldLabel>Username</FieldLabel>
                <FieldContent>
                  <Input
                    value={updateData.username}
                    minLength={3}
                    maxLength={12}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUpdateData((prev) => ({ ...prev, username: value }));

                      const trimmed = value.trim();
                      if (!trimmed) {
                        setUsernameError("");
                        return;
                      }
                      if (trimmed.length < 3 || trimmed.length > 12) {
                        setUsernameError(
                          "Username must be between 3 and 12 characters.",
                        );
                        return;
                      }
                      if (!USERNAME_REGEX.test(trimmed)) {
                        setUsernameError(
                          "Username can only contain letters, numbers, dots, underscores, and hyphens (no spaces).",
                        );
                        return;
                      }
                      setUsernameError("");
                    }}
                  />
                </FieldContent>
                {usernameError ? <FieldError>{usernameError}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel>Avatar URL</FieldLabel>
                <FieldContent>
                  <Input
                    value={updateData.avatar_url}
                    onChange={(e) => {
                      const value = e.target.value;
                      setUpdateData((prev) => ({
                        ...prev,
                        avatar_url: value,
                      }));

                      if (!value.trim()) {
                        setAvatarUrlError("");
                        return;
                      }
                      try {
                        validateOptionalUrl(value);
                        setAvatarUrlError("");
                      } catch (error) {
                        setAvatarUrlError(
                          getErrorMessage(error, "Invalid avatar URL."),
                        );
                      }
                    }}
                  />
                </FieldContent>
                {avatarUrlError ? <FieldError>{avatarUrlError}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel>Phone Number</FieldLabel>
                <FieldContent>
                  <Input
                    placeholder="e.g. (310) 555-0101"
                    value={updateData.phone_number}
                    inputMode="tel"
                    onChange={(e) => {
                      const raw = e.target.value;
                      if (!/^[\d\s\-()]*$/.test(raw)) {
                        setPhoneError(
                          "Invalid phone format. Only digits, spaces, dashes, and parentheses are allowed.",
                        );
                        return;
                      }

                      setPhoneError("");
                      setUpdateData((prev) => ({
                        ...prev,
                        phone_number: formatUsPhoneInput(raw),
                      }));
                    }}
                  />
                </FieldContent>
                {phoneError ? <FieldError>{phoneError}</FieldError> : null}
              </Field>
              <Field>
                <FieldLabel>Description</FieldLabel>
                <FieldContent>
                  <Textarea
                    placeholder="Max 500 characters"
                    value={updateData.description}
                    onChange={(e) =>
                      setUpdateData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                  />
                </FieldContent>
              </Field>
              <Button type="submit" disabled={loading || loadingProfile}>
                {loadingProfile
                  ? "Loading profile..."
                  : loading
                    ? "Updating..."
                    : "Update Profile"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {errorMessage ? <FieldError>{errorMessage}</FieldError> : null}
      {successMessage ? (
        <p className="text-sm text-green-600">{successMessage}</p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Latest Result</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="wrap-break-word whitespace-pre-wrap text-xs">
            {result == null ? "No result yet." : JSON.stringify(result, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
