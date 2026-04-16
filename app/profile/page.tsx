"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfilePage() {
  const profile = {
    username: "johndoe",
    email: "johndoe@email.com",
    phone_number: "(555) 123-4567",
    description: "I enjoy discovering and hosting events in my community.",
    avatar_url: "",
  };

  return (
    <main className="min-h-svh px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-6 text-3xl font-bold">My Profile</h1>

        <Card className="flex flex-col gap-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Avatar className="size-20">
              <AvatarImage src={profile.avatar_url} />
              <AvatarFallback>
                {profile.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h2 className="text-2xl font-semibold">{profile.username}</h2>
              <p className="text-muted-foreground">{profile.email}</p>
            </div>

            <Button>Edit Profile</Button>
          </div>

          <div className="grid gap-4">
            <div>
              <h3 className="mb-1 font-semibold">Phone Number</h3>
              <p className="text-muted-foreground">{profile.phone_number}</p>
            </div>

            <div>
              <h3 className="mb-1 font-semibold">Bio</h3>
              <p className="text-muted-foreground">{profile.description}</p>
            </div>
          </div>
        </Card>

        <Card className="mt-6 p-6">
          <h3 className="mb-4 text-xl font-semibold">My Events</h3>
          <p className="text-muted-foreground">
            Events created or joined by the user will appear here.
          </p>
        </Card>

        <Card className="mt-6 p-6">
          <h3 className="mb-4 text-xl font-semibold">My Organizations</h3>
          <p className="text-muted-foreground">
            Organizations connected to the user will appear here.
          </p>
        </Card>
      </div>
    </main>
  );
}