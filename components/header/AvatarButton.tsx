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
import { ChevronDown, LogOut, Moon, Sun, User } from "lucide-react";
import { signOut } from "@/lib/auth";
import { AuthError } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { pastelColors } from "@/lib/avatarColors";
import { useTheme } from "next-themes";

function AvatarButton({ profile }: { profile: Profile }) {
  const [randomAvatarColor] = useState<string>(pastelColors[Math.floor(Math.random() * pastelColors.length)]);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result instanceof AuthError) {
      console.error("Error signing out", result.message);
      return;
    }
    router.push("/");
    router.refresh();
  };


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="cursor-pointer">
          <Avatar className="" size='sm'>
            <AvatarImage src={profile.avatar_url || ""} />
            <AvatarFallback style={{ backgroundColor: randomAvatarColor }} className="text-primary-foreground">
              {profile.username?.charAt(0).toUpperCase() || "?"}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="size-4" />
        </Button>
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
        <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {theme === "dark" ? <Sun /> : <Moon />}
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </DropdownMenuItem>
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
