import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Compass, MapPin, Moon, Plus, Sun, User } from "lucide-react";
import AvatarButton from "./AvatarButton";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface DesktopNavProps {
  profile: Profile | null;
  pathname: string;
  onHostEvent: () => void;
  transparent?: boolean;
}

function DesktopNav({ profile, pathname, onHostEvent, transparent }: DesktopNavProps) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {profile ? (
        <motion.div
          key="authenticated"
          className="hidden sm:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Button variant={pathname === "/discover" ? "default" : "ghost"} asChild>
            <Link href="/discover">
              <Compass />
              Discover
            </Link>
          </Button>
          <Button variant={pathname === "/map-view" ? "default" : "ghost"} asChild>
            <Link href="/map-view">
              <MapPin />
              Map View
            </Link>
          </Button>
          <span className={cn(transparent && "dark")}>
            <Button
              type="button"
              variant='outline'
              onClick={onHostEvent}
            >
              <Plus />
              Host an Event
            </Button>
          </span>
          <AvatarButton profile={profile} />
        </motion.div>
      ) : !pathname.startsWith("/onboarding") ? (
        <motion.div
          key="unauthenticated"
          className="hidden sm:flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
        >
          <Button variant={pathname === "/discover" ? "default" : "ghost"} asChild>
            <Link href="/discover">
              <Compass />
              Discover
            </Link>
          </Button>
          <Button variant={pathname === "/map-view" ? "default" : "ghost"} asChild>
            <Link href="/map-view">
              <MapPin />
              Map View
            </Link>
          </Button>
          <span className={cn(transparent && "dark")}>
            <Button variant='outline' asChild>
              <Link href="/auth/login">
                <User />
                Sign in
              </Link>
            </Button>
          </span>
          <span className={cn(transparent && "dark")}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {mounted && (theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />)}
            </Button>
          </span>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default DesktopNav;
