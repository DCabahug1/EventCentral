"use client";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";

function Footer() {
  const pathname = usePathname();
  const isMapView = pathname === "/map-view";
  const isAuthRoute = pathname.startsWith("/auth");

  if (isMapView || isAuthRoute) {
    return null;
  }

  return (
    <div className="flex items-center justify-center w-full h-16 bg-background border-t gap-2">
      <Link href="/">
        <h1 className="text-lg sm:text-xl font-bold">
          Event<span className="text-primary ">Central</span>
        </h1>
      </Link>
      <div className=" w-[2px] h-[20px] bg-border" />
      <p className="text-muted-foreground text-xs sm:text-base">
        Discover what's happening around you.
      </p>
    </div>
  );
}

export default Footer;
