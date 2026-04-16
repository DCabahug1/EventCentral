"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getProfile } from "@/lib/profiles";
import { Profile } from "@/lib/types";
import { AuthError } from "@supabase/supabase-js";
import { PostgrestError } from "@supabase/supabase-js";
import { getCurrentUser } from "@/lib/user";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async () => {
    const userResult = await getCurrentUser();

    if (userResult instanceof AuthError) {
      console.error("Error getting user", userResult.message);
      return;
    }

    if (!userResult.user) {
      console.error("User not found");
      return;
    }

    const result = await getProfile(userResult.user.id);

    if (result instanceof PostgrestError || result instanceof AuthError) {
      console.error("Error getting profile", result.message);
      return;
    }

    setProfile(result);
  };

  useEffect(() => {
    fetchProfile();

  }, []);

  useEffect(() =>{
    console.log("Profile", profile);

  }, [profile])

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <main className="min-h-svh p-4 sm:p-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <Card className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20">
                <AvatarImage src={profile.avatar_url ?? ""} />
                <AvatarFallback>
                  {profile.username?.charAt(0).toUpperCase() ?? ""}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1">
                <h2 className="text-2xl font-semibold">{profile.username}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>

            <Button className="sm:shrink-0">Edit Profile</Button>
          </div>

          <div className="grid gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Phone Number</h3>
              <p className="text-muted-foreground">{profile.phone_number}</p>
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">Bio</h3>
              <p className="text-muted-foreground">{profile.description}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">My Events</h3>
            <p className="text-muted-foreground">
              Events created or joined by the user will appear here.
            </p>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex flex-col gap-2">
            <h3 className="text-xl font-semibold">My Organizations</h3>
            <p className="text-muted-foreground">
              Organizations connected to the user will appear here.
            </p>
          </div>
        </Card>
      </div>
    </main>
  );
}
