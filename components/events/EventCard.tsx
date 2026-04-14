"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Event, Organization } from "@/lib/types";
import Image from "next/image";
import { MapPin, Calendar, Users } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { getCategoryConfig } from "@/lib/categoryConfig";
import Link from "next/link";
import { formatDateTime } from "@/lib/utils";
import { getOrganizationById } from "@/lib/organizations";
import { PostgrestError } from "@supabase/supabase-js";


// Returns a Tailwind color class based on how full the event is
const getProgressColor = (pct: number) => {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 75) return "bg-orange-500";
  return "bg-primary";
};

type EventStatus = "upcoming" | "live" | "ended";

// Derives event status by comparing start/end times against now
const getEventStatus = (start: string, end: string): EventStatus => {
  const now = new Date();
  if (now < new Date(start)) return "upcoming";
  if (now <= new Date(end)) return "live";
  return "ended";
};

// Visual config for each status — controls badge label, styles, and whether to show a pulse dot
const statusConfig: Record<
  EventStatus,
  { label: string; className: string; dot?: boolean }
> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-black/50 text-white border border-white/20",
  },
  live: {
    label: "Live",
    className: "bg-green-500/90 text-white",
    dot: true, // pulsing dot to draw attention to active events
  },
  ended: {
    label: "Ended",
    className: "bg-black/50 text-white/50 border border-white/10",
  },
};

// Returns capacity badge props when the event is getting full, null otherwise
const getCapacityBadge = (
  pct: number,
): { label: string; className: string } | null => {
  if (pct >= 100) return { label: "Full", className: "bg-destructive text-white" };
  if (pct >= 75) return { label: "Almost Full", className: "bg-orange-500 text-white" };
  return null;
};

function EventCard({
  event,
  org,
  variant = "default",
}: {
  event: Event;
  org?: Organization | null;
  variant?: "default" | "featured";
}) {
  const maxCapacity = event.max_capacity ?? 0;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const categoryLabel = event.category ?? "Uncategorized";
  const eventAddress = event.address ?? "Location TBD";
  const eventImageUrl = event.image_url ?? "/discover-page/Hero.jpg";
  // Randomized attendee count used as a stand-in until real registration data exists
  const [attendees, setAttendees] = useState(
    Math.floor(Math.random() * Math.max(maxCapacity, 1)),
  );
  const pct = maxCapacity > 0 ? (attendees / maxCapacity) * 100 : 0;
  const status = getEventStatus(event.start_time, event.end_time);
  const { label, className, dot } = statusConfig[status];
  const categoryConfig = getCategoryConfig(categoryLabel);
  const CategoryIcon = categoryConfig?.icon;

  // For the hover effect
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (org) {
      setOrganization(org);
      return;
    }
    if (!event.organization_id || event.organization_name) {
      return;
    }

    const fetchOrganization = async () => {
      const result = await getOrganizationById(event.organization_id!);

      if (result instanceof PostgrestError) {
        console.error(result.message);
        return;
      }

      if (result) {
        setOrganization(result);
      }
    };

    void fetchOrganization();
  }, [event.organization_id, event.organization_name, org]);

  const capacityBadge = getCapacityBadge(pct);

  if (variant === "featured") {
    return (
      <div className="w-full h-full">
        <Link href={`/events/${event.id}`}>
          <Card
            className="relative w-full h-72 p-0 gap-0 overflow-hidden cursor-pointer transition-all duration-300 shadow-xs"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {/* Full-bleed background image */}
            <div className="absolute inset-0">
              <Image
                src={eventImageUrl}
                alt={event.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Gradient overlay for readability */}
            <div className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent z-10 ${isHovered ? "opacity-50" : "opacity-80"} transition-all duration-300`} />

            {/* Status badge — top-left */}
            <div
              className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${className}`}
            >
              {dot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
              {label}
            </div>

            {/* Capacity badge — top-right */}
            {capacityBadge && (
              <div className="absolute top-3 right-3 z-20">
                <Badge className={capacityBadge.className}>
                  {capacityBadge.label}
                </Badge>
              </div>
            )}

            {/* Bottom overlay — event details */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 pb-6">
              {/* Category + org */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant='outline' className="bg-black/50 border-white/20 text-white">
                  {CategoryIcon && <CategoryIcon className={categoryConfig?.colorClass} />}
                  {categoryLabel}
                </Badge>
                <span className="text-xs text-white/70">
                  {org?.name ?? event.organization_name ?? organization?.name}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold text-white leading-tight">
                {event.title}
              </h1>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {eventAddress}
                </span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateTime(event.start_time)}
                </span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {attendees}/{maxCapacity}
                </span>
              </div>
            </div>

            {/* Progress bar flush at the bottom edge */}
            <div className="absolute bottom-0 inset-x-0 z-30">
              <Progress
                value={pct}
                indicatorClassName={getProgressColor(pct)}
                className="rounded-none h-1.5"
              />
            </div>
          </Card>
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Link href={`/events/${event.id}`}>
        <Card
          className="w-full h-full p-0 gap-0 overflow-hidden cursor-pointer dark:brightness-90 dark:hover:brightness-100 transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image + overlays */}
          <div className="relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/70 dark:from-background to-transparent z-10 ${isHovered ? "opacity-70" : "opacity-80"} transition-all duration-300`}
            />

            {/* Status badge — positioned over the image in the top-left */}
            <div
              className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${className}`}
            >
              {dot && (
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
              {label}
            </div>

            <Image
              src={eventImageUrl}
              alt={event.title}
              width={500}
              height={500}
              className="w-full object-cover h-48"
            />
          </div>

          {/* Event details */}
          <div className="flex flex-col gap-3 p-4">
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-sm text-muted-foreground">
                {org?.name ??
                  event.organization_name ??
                  organization?.name ??
                  "Organization"}
              </h2>
              <h1 className="text-2xl font-bold">{event.title}</h1>
            </div>
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {CategoryIcon && <CategoryIcon className={categoryConfig?.colorClass} />}
                {categoryLabel}
              </Badge>
            </div>
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">{eventAddress}</p>
            </div>
            <div className="flex gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {formatDateTime(event.start_time)}
              </p>
            </div>
            <div className="flex gap-2">
              <Users className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {attendees + " / " + maxCapacity + " attendees"}
              </p>
            </div>

            {/* Capacity bar — color shifts as the event fills up */}
            <Progress value={pct} indicatorClassName={getProgressColor(pct)} />
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default EventCard;
