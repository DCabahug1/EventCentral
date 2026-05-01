"use client";
import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Profile } from "@/lib/types";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Compass, MapPin, Menu, Moon, Plus, Sun, User, X } from "lucide-react";
import AvatarButton from "./AvatarButton";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  profile: Profile | null;
  onHostEvent: () => void;
  transparent?: boolean;
}

function MobileNav({ profile, onHostEvent, transparent }: MobileNavProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="flex sm:hidden items-center gap-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Toggle menu">
            {open ? <X /> : <Menu />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="bottom" className="w-56">
          {profile ? (
            <>
              <DropdownMenuItem
                asChild
                className={pathname === "/discover" ? "bg-accent" : ""}
              >
                <Link
                  href="/discover"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Compass className="size-4" />
                  Discover
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className={pathname === "/map-view" ? "bg-accent" : ""}
              >
                <Link
                  href="/map-view"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <MapPin className="size-4" />
                  Map View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={(e) => {
                  e.preventDefault();
                  setOpen(false);
                  onHostEvent();
                }}
                className="bg-muted"
              >
                <div className="flex cursor-pointer items-center gap-2">
                  <Plus className="size-4" />
                  Host an Event
                </div>
              </DropdownMenuItem>
            </>
          ) : (
            <>
              <DropdownMenuItem
                asChild
                className={pathname === "/discover" ? "bg-accent" : ""}
              >
                <Link
                  href="/discover"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Compass className="size-4" />
                  Discover
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                asChild
                className={pathname === "/map-view" ? "bg-accent" : ""}
              >
                <Link
                  href="/map-view"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <MapPin className="size-4" />
                  Map View
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/auth/login"
                  className="flex cursor-pointer items-center gap-2"
                >
                  <User className="size-4" />
                  Sign in
                </Link>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      <span className={cn(transparent && "dark")}>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {mounted &&
            (theme === "dark" ? (
              <Sun className="size-4" />
            ) : (
              <Moon className="size-4" />
            ))}
        </Button>
      </span>
      {profile && <AvatarButton profile={profile} />}
    </div>
  );
}

export default MobileNav;
