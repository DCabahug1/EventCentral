"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/user";
import { getProfile } from "@/lib/profiles";
import { useEffect } from "react";
import { PostgrestError } from "@supabase/supabase-js";
import { useState } from "react";
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Compass, User } from "lucide-react";
import AvatarButton from "./AvatarButton";
import { AuthError } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "motion/react";

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

  return (
    <div className="sticky top-0 z-50 w-full h-16 bg-background border-b flex items-center justify-between px-6">
      {/* Branding */}
      <Link href="/">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">EventCentral</h1>
        </div>
      </Link>
      {/* Navigation */}
      {!pathname.startsWith("/auth") && (
        <AnimatePresence mode="wait" initial={false}>
          {profile ? (
            <motion.div
              key="authenticated"
              className="flex items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button asChild>
                <Link href="/">
                  <Compass />
                  Discover
                </Link>
              </Button>
              <AvatarButton profile={profile} />
            </motion.div>
          ) : !pathname.startsWith("/onboarding") ? (
            <motion.div
              key="unauthenticated"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Button asChild>
                <Link href="/auth/login">
                  <User />
                  Sign in
                </Link>
              </Button>
            </motion.div>
          ) : null}
        </AnimatePresence>
      )}
    </div>
  );
}

export default Header;
