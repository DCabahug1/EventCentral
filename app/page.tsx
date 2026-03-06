"use client";
import React from "react";
import { signOut } from "@/lib/auth";
import { AuthError, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { useState } from "react";
import { useEffect } from "react";
import Header from "@/components/header/Header";

function page() {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user instanceof AuthError) {
        console.error("Error getting user", user.message);
        return;
      }
      setUser(user.user);
    };
    fetchUser();
  }, []);
  
  const handleSignOut = async () => {
    const result = await signOut();

    if (result instanceof AuthError) {
      console.error("Error signing out", result.message);
      return;
    }

    router.push("/auth/login");
  };

  return (
    <div className="flex flex-col w-full">
      {user ? (
        <>
          <p>Welcome {user?.email}</p>
          <Button onClick={handleSignOut}>Sign Out</Button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default page;
