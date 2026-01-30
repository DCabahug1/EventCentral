"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import { setUsername as updateUsername } from "@/lib/profiles";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

function page() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const router = useRouter();
  
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);

    // Reset messages
    setMessage("");
    setErrorMessage("");

    // Validate form
    if (!username) {
      setErrorMessage("Please enter a username");
      setLoading(false);
      return;
    }

    // Get current user
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setErrorMessage("You must be logged in to set a username");
      setLoading(false);
      return;
    }

    // Update username
    const { profile, error } = await updateUsername(user.id, username);

    if (error) {
      setErrorMessage("Failed to set username. Please try again.");
      setLoading(false);
      return;
    }

    setMessage("Username set successfully!");
    setLoading(false);
    router.push("/");
  };

  return (
    <div className="flex h-screen p-4 items-center justify-center">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl font-bold">Choose Your Username</h1>
          <p className="text-sm text-muted-foreground">
            Choose a username to get started.
          </p>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={onSubmit}
            className="flex flex-col items-center gap-4"
          >
            <Input
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {message && <p>{message}</p>}
            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
