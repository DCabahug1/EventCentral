"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import { Compass, Menu, Plus, User, X } from "lucide-react";
import AvatarButton from "./AvatarButton";
import { motion, AnimatePresence } from "motion/react";

interface MobileNavProps {
  profile: Profile | null;
}

function MobileNav({ profile }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Hamburger toggle row in the header bar */}
      <div className="flex sm:hidden items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X /> : <Menu />}
        </Button>
        {profile && <AvatarButton profile={profile} />}
      </div>

      {/* Slide-down panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="mobile-menu"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="sm:hidden fixed top-16 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex flex-col gap-1"
          >
            {profile ? (
              <>
                <Button
                  variant={pathname === "/" ? "default" : "ghost"}
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/">
                    <Compass />
                    Discover
                  </Link>
                </Button>
                <Button
                  variant={
                    pathname.startsWith("/create-event") ? "default" : "ghost"
                  }
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/create-event">
                    <Plus />
                    Host an Event
                  </Link>
                </Button>
              </>
            ) : (
              <Button className="w-full" asChild>
                <Link href="/auth/login">
                  <User />
                  Sign in
                </Link>
              </Button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default MobileNav;
