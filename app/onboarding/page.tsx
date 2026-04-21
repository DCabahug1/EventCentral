"use client";
import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { createProfile } from "@/lib/profiles";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import {
  FormRequiredLegend,
  OptionalFieldHint,
  RequiredMark,
} from "@/components/ui/form-field-hints";

function formatPhoneNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 10);
  if (digits.length < 4) return digits;
  if (digits.length < 7) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

function unformatPhoneNumber(value: string): string {
  return value.replace(/\D/g, "");
}

function phoneDigitsToNumber(digits: string): number | null {
  if (!digits) return null;
  const parsedNumber = parseInt(digits, 10);
  return Number.isNaN(parsedNumber) ? null : parsedNumber;
}

function page() {
  const [formData, setFormData] = useState({
    username: "",
    phone_number: "",
    description: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
    
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      const result = await createProfile({
        username: formData.username,
        avatar_url: null,
        phone_number: phoneDigitsToNumber(
          unformatPhoneNumber(formData.phone_number),
        ),
        description: formData.description,
      });

      if (result instanceof AuthError) {
        setErrorMessage(result.message);
        return;
      }

      if (result && typeof result === "object" && "code" in result) {
        const err = result as { code: string; message: string };
        if (err.code === "23505") {
          setErrorMessage("That username is already taken. Please choose a different one.");
        } else {
          setErrorMessage(err.message);
        }
        return;
      }

      router.push("/");
    } catch (error) {
      setErrorMessage("There was an error creating your profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-svh">
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="grid grid-cols-1 sm:grid-cols-2 gap-0 p-0 overflow-hidden w-full max-w-2xl">
          <div className="flex flex-col justify-center px-4 py-8 gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Set up your profile</h1>
              <p className="text-sm text-muted-foreground">
                Tell us a bit about yourself to get started
              </p>
            </div>
            <form
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-4"
            >
              <FormRequiredLegend />
              <div className="flex flex-col gap-2">
                <Label htmlFor="username">
                  Username <RequiredMark />
                </Label>
                <Input
                  type="text"
                  id="username"
                  required
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phone_number">
                  Phone number
                  <OptionalFieldHint />
                </Label>
                <Input
                  type="tel"
                  id="phone_number"
                  placeholder="(555) 555-5555"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone_number: formatPhoneNumber(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="description">
                  Bio
                  <OptionalFieldHint />
                </Label>
                <textarea
                  id="description"
                  rows={3}
                  placeholder="Tell us about yourself..."
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring flex min-h-[60px] w-full rounded-md border px-3 py-2 text-sm shadow-sm focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                />
              </div>
              {errorMessage && <p className="text-red-500">{errorMessage}</p>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Saving..." : "Continue"}
              </Button>
            </form>
          </div>
          <Image
            src="/auth-pages/AuthFormSideImage.jpg"
            alt="EventCentral"
            width={800}
            height={800}
            className="hidden sm:block h-full border border-border object-cover"
          />
        </Card>
      </div>
    </div>
  );
}

export default page;
