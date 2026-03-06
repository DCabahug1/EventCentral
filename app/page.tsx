"use client";
import React, { useRef } from "react";
import { signOut } from "@/lib/auth";
import { AuthError, PostgrestError, User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getCurrentUser } from "@/lib/user";
import { useState } from "react";
import { useEffect } from "react";
import Header from "@/components/header/Header";
import { Profile } from "@/lib/types";
import { getProfile } from "@/lib/profiles";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";

const CATEGORIES = [
  { label: "Music", emoji: "🎵" },
  { label: "Parties", emoji: "🎉" },
  { label: "Tech", emoji: "💻" },
  { label: "Sports", emoji: "🏆" },
  { label: "Food & Drink", emoji: "🍕" },
  { label: "Art", emoji: "🎨" },
  { label: "Outdoor", emoji: "🌿" },
];

function page() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const router = useRouter();

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], ["0%", "50%"]);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();
      if (user instanceof AuthError) {
        console.error("Error getting user", user.message);
        return;
      }
      setUser(user.user);

      const profile = await getProfile(user.user?.id);

      if (profile instanceof PostgrestError || profile instanceof AuthError) {
        console.error("Error getting profile", profile.message);
        return;
      }

      setProfile(profile);
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
      {/* Hero */}
      <div
        ref={heroRef}
        className="flex flex-col items-center justify-center md:h-[50svh] h-[60svh] p-4 gap-4 relative w-full overflow-hidden"
      >
        {/* Background image */}
        <motion.div
          className="absolute inset-x-0 -top-[25%] -z-10 h-[150%]"
          style={{ y: parallaxY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <Image
            src="/discover-page/Hero.jpg"
            alt="EventCentral"
            fill
            className="object-cover object-[center_40%]"
          />
        </motion.div>
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 dark:from-background to-transparent" />

        <motion.div
          className="flex flex-col items-center gap-3 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
            Discover{" "}
            <span className="bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
              Events
            </span>
          </h1>
        </motion.div>

        {/* Search bar */}
        <motion.div
          className="dark flex w-full max-w-lg items-center gap-2 rounded-full border border-white/20 bg-white/10 px-2 py-1.5 backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
        >
          <Input
            type="text"
            placeholder="Search for an event"
            className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 text-white"
          />
          <Button size="sm" className="shrink-0 rounded-full">
            <Search />
            Search
          </Button>
        </motion.div>

        {/* Category tags */}
        <motion.div
          className="flex flex-wrap justify-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          {CATEGORIES.map(({ label, emoji }) => (
            <button
              key={label}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur-sm transition-colors hover:bg-white/20"
            >
              {emoji} {label}
            </button>
          ))}
        </motion.div>
      </div>
      <div className="bg-red-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-blue-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-green-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-yellow-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-purple-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-pink-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-gray-500 w-[200px] h-[200px]">Filler Block</div>
      <div className="bg-black w-[200px] h-[200px]">Filler Block</div>
    </div>
  );
}

export default page;
