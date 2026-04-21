import React from "react";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Compass, MapPin, Plus, User } from "lucide-react";
import AvatarButton from "./AvatarButton";
import { motion, AnimatePresence } from "motion/react";

interface DesktopNavProps {
  profile: Profile | null;
  pathname: string;
  onHostEvent: () => void;
}

function DesktopNav({ profile, pathname, onHostEvent }: DesktopNavProps) {
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
          <Button variant={pathname === "/" ? "default" : "ghost"} asChild>
            <Link href="/">
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
          <Button
            type="button"
            variant={pathname.startsWith("/create-event") ? "default" : "ghost"}
            onClick={onHostEvent}
          >
              <Plus />
              Host an Event
          </Button>
          <AvatarButton profile={profile} />
        </motion.div>
      ) : !pathname.startsWith("/onboarding") ? (
        <motion.div
          key="unauthenticated"
          className="hidden sm:flex"
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
  );
}

export default DesktopNav;
