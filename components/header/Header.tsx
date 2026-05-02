"use client";
import React, { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { getCurrentUser } from "@/lib/auth/user";
import { getProfile } from "@/lib/profiles/server";
import { PROFILE_UPDATED_EVENT } from "@/lib/profiles/events";
import { PostgrestError } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import { AuthError } from "@supabase/supabase-js";
import dynamic from "next/dynamic";
import DesktopNav from "./DesktopNav";

const MobileNav = dynamic(() => import("./MobileNav"), { ssr: false });
import CreateEventGlobalDialog from "@/components/events/CreateEventGlobalDialog";
import { Button } from "@/components/ui/button";

function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [createEventOpen, setCreateEventOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const isLanding = pathname === "/";

  useEffect(() => {
    if (!isLanding) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLanding]);

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

  const showNav =
    !pathname.startsWith("/auth") && !pathname.startsWith("/onboarding");

  return (
    <>
      <div
        className={cn(
          "z-50 w-full h-16 flex items-center justify-between px-6 transition-[background-color,border-color] duration-400",
          isLanding
            ? cn(
                "fixed top-0",
                scrolled
                  ? "bg-background border-b border-border"
                  : "bg-transparent border-b border-transparent text-white",
              )
            : "sticky top-0 bg-background border-b border-border",
        )}
      >
        <Link href="/">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">
              Event<span className="text-primary">Central</span>
            </h1>
          </div>
        </Link>

        {pathname.startsWith("/auth") ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            )}
          </Button>
        ) : (
          <DesktopNav
            profile={profile}
            pathname={pathname}
            onHostEvent={() => setCreateEventOpen(true)}
            transparent={isLanding && !scrolled}
          />
        )}

        {showNav && (
          <MobileNav
            profile={profile}
            onHostEvent={() => setCreateEventOpen(true)}
            transparent={isLanding && !scrolled}
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
