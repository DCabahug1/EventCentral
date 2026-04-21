"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/user";
import { getProfile } from "@/lib/profiles";
import { PostgrestError } from "@supabase/supabase-js";
import { Profile } from "@/lib/types";
import { AuthError } from "@supabase/supabase-js";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

function Header() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const userResult = await getCurrentUser();

        if (userResult instanceof AuthError) {
          return;
        }

        if (!userResult.user) {
          return;
        }

        const profile = await getProfile(userResult.user.id);
        console.log("Profile", profile);

        if (profile instanceof PostgrestError || profile instanceof AuthError) {
          console.error("Error getting profile", profile.message);
          return;
        }

        setProfile(profile);
      } catch (error) {
        console.error("Error getting profile", error);
        return;
      }
    };
    fetchProfile();
  }, [pathname]);

  const showNav = !pathname.startsWith("/auth") && !pathname.startsWith("/onboarding");

  return (
    <>
      <div className="sticky top-0 z-50 w-full h-16 bg-background border-b flex items-center justify-between px-6">
        <Link href="/">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Event<span className="text-primary">Central</span></h1>
          </div>
        </Link>

        {!pathname.startsWith("/auth") && (
          <DesktopNav profile={profile} pathname={pathname} />
        )}

        {showNav && <MobileNav profile={profile} />}
      </div>
    </>
  );
}

export default Header;
