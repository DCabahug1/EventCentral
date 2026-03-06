import { Profile } from "@/lib/types";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { LogOut, User } from "lucide-react";
import { signOut } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function AvatarButton({ profile }: { profile: Profile }) {
  useEffect(() => {
    console.log(profile);
  });
  const router = useRouter();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result instanceof AuthError) {
      console.error("Error signing out", result.message);
      return;
    }
    router.push("/auth/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer">
          <AvatarImage src={profile.avatar_url || ""} />
          <AvatarFallback>
            {profile.username?.charAt(0).toUpperCase() || "?"}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <span className="font-medium">{profile.username}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/profile">
          <DropdownMenuItem>
            <User />
            Profile
          </DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut} variant="destructive">
          <LogOut />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default AvatarButton;
