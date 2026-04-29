"use client";
import React, { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { getCurrentUser } from "@/lib/user";
import { getProfile } from "@/lib/profiles";
import { PROFILE_UPDATED_EVENT } from "@/lib/profileEvents";
import { PostgrestError } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import { AuthError } from "@supabase/supabase-js";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";
import CreateEventGlobalDialog from "@/components/events/CreateEventGlobalDialog";
import { Button } from "@/components/ui/button";

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [createEventOpen, setCreateEventOpen] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const userResult = await getCurrentUser();

      if (userResult instanceof AuthError) {
        setProfile(null);
        return;
      }

      if (!userResult.user) {
        setProfile(null);
        return;
      }

      const profile = await getProfile(userResult.user.id);

      if (profile instanceof PostgrestError || profile instanceof AuthError) {
        console.error("Error getting profile", profile.message);
        setProfile(null);
        return;
      }

      setProfile(profile);
    } catch (error) {
      console.error("Error getting profile", error);
      setProfile(null);
      return;
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [pathname, fetchProfile]);

  useEffect(() => {
    const handler = () => {
      fetchProfile();
    };
    window.addEventListener(PROFILE_UPDATED_EVENT, handler);
    return () => window.removeEventListener(PROFILE_UPDATED_EVENT, handler);
  }, [fetchProfile]);

  const showNav = !pathname.startsWith("/auth") && !pathname.startsWith("/onboarding");

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-16 bg-background border-b flex items-center justify-between px-6">
        <Link href="/">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">Event<span className="text-primary">Central</span></h1>
          </div>
        </Link>

        {pathname.startsWith("/auth") ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </Button>
        ) : (
          <DesktopNav
            profile={profile}
            pathname={pathname}
            onHostEvent={() => setCreateEventOpen(true)}
          />
        )}

        {showNav && (
          <MobileNav
            profile={profile}
            onHostEvent={() => setCreateEventOpen(true)}
          />
        )}
      </div>

      <CreateEventGlobalDialog
        open={createEventOpen}
        onOpenChange={setCreateEventOpen}
        profile={profile}
      />
    </>
  );
}

export default Header;
