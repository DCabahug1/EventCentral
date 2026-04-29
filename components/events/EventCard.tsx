"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Event, Organization } from "@/lib/types";
import Image from "next/image";
import { MapPin, Calendar, Users } from "lucide-react";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { getCategoryConfig } from "@/lib/categoryConfig";
import Link from "next/link";
import { formatDateTime, formatCount } from "@/lib/utils";
import { getOrganizationById } from "@/lib/organizations";
import { PostgrestError } from "@supabase/supabase-js";

// Returns a Tailwind color class based on how full the event is
const getProgressColor = (capacityPercentage: number) => {
  if (capacityPercentage >= 100) return "bg-red-500";
  if (capacityPercentage >= 75) return "bg-orange-500";
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

// Style rules for each status badge.
const statusConfig: Record<EventStatus, { label: string; className: string }> =
  {
    upcoming: {
      label: "Upcoming",
      className: "bg-black/50 text-white border border-white/20",
    },
    live: {
      label: "Live",
      className: "bg-green-500/90 text-white",
    },
    ended: {
      label: "Ended",
      className: "bg-black/50 text-white/50 border border-white/10",
    },
  };

// Returns capacity badge props when the event is getting full, null otherwise
const getCapacityBadge = (
  capacityPercentage: number,
): { label: string; className: string } | null => {
  if (capacityPercentage >= 100)
    return { label: "Full", className: "bg-destructive text-white" };
  if (capacityPercentage >= 75)
    return { label: "Almost Full", className: "bg-orange-500 text-white" };
  return null;
};

function EventCard({
  event,
  org: providedOrganization,
  variant = "default",
}: {
  event: Event;
  org?: Organization | null;
  variant?: "default" | "featured" | "organization";
}) {
  const maxCapacity = event.max_capacity ?? 0;
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [hasImageLoadError, setHasImageLoadError] = useState(false);
  const attendeeCount = Number(event.rsvp_count) || 0;
  const eventImageSource = event.image_url ?? "/discover-page/Hero.jpg";
  const capacityPercentage =
    maxCapacity > 0 ? (attendeeCount / maxCapacity) * 100 : 0;
  const { label: statusLabel, className: statusClassName } =
    statusConfig[getEventStatus(event.start_time, event.end_time)];
  const categoryConfig = getCategoryConfig(event.category ?? "Uncategorized");
  const CategoryIcon = categoryConfig?.icon;
  const organizationName =
    providedOrganization?.name ?? event.organization_name ?? organization?.name;

  // Track hover state for overlays.
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (providedOrganization) {
      setOrganization(providedOrganization);
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
  }, [event.organization_id, event.organization_name, providedOrganization]);

  // Reset image fallback when event data changes.
  useEffect(() => {
    setHasImageLoadError(false);
  }, [event.id, eventImageSource]);

  const capacityBadge = getCapacityBadge(capacityPercentage);
  const statusBadgeClassName = `absolute top-3 left-3 z-20 backdrop-blur-sm ${statusClassName}`;

  if (variant === "organization") {
    return (
      <div className="h-full w-full">
        <Link href={`/events/${event.id}`}>
          <Card className="h-full w-full cursor-pointer gap-0 overflow-hidden p-0 transition-all duration-300 dark:brightness-90 dark:hover:brightness-100">
            <div className="relative overflow-hidden">
              <Badge className={statusBadgeClassName}>{statusLabel}</Badge>

              {hasImageLoadError ? (
                <Skeleton className="h-48 w-full rounded-none bg-muted" />
              ) : (
                <Image
                  src={eventImageSource}
                  alt={event.title}
                  width={500}
                  height={500}
                  className="h-48 w-full border border-border object-cover"
                  onError={() => setHasImageLoadError(true)}
                />
              )}
            </div>

            <div className="flex flex-col gap-3 p-4">
              <div className="flex flex-col gap-1">
                <h2 className="text-sm text-muted-foreground">
                  {organizationName ?? "Organization"}
                </h2>
                <h3 className="text-2xl font-bold">{event.title}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">
                  {CategoryIcon && (
                    <CategoryIcon className={categoryConfig?.colorClass} />
                  )}
                  {event.category ?? "Uncategorized"}
                </Badge>
              </div>
              <div className="flex gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {event.address ?? "Location TBD"}
                </p>
              </div>
              <div className="flex gap-2">
                <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(event.start_time)}
                </p>
              </div>
              <div className="flex gap-2">
                <Users className="h-4 w-4 shrink-0 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {attendeeCount + " / " + maxCapacity + " attendees"}
                </p>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    );
  }

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
              {hasImageLoadError ? (
                <Skeleton className="h-full w-full rounded-none bg-muted" />
              ) : (
                <Image
                  src={eventImageSource}
                  alt={event.title}
                  fill
                  className="border border-border object-cover"
                  onError={() => setHasImageLoadError(true)}
                />
              )}
            </div>

            {/* Gradient overlay for readability */}
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/90 via-black/60 to-transparent z-10 ${isHovered ? "opacity-50" : "opacity-80"} transition-all duration-300`}
            />

            {/* Status badge at top left */}
            <Badge className={statusBadgeClassName}>
              {statusLabel}
            </Badge>

            {/* Capacity badge at top right */}
            {capacityBadge && (
              <div className="absolute top-3 right-3 z-20">
                <Badge className={capacityBadge.className}>
                  {capacityBadge.label}
                </Badge>
              </div>
            )}

            {/* Bottom overlay with event details */}
            <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-2 px-4 pb-6">
              {/* Category + org */}
              <div className="flex items-center gap-2 flex-wrap">
                <Badge
                  variant="outline"
                  className="bg-black/50 border-white/20 text-white"
                >
                  {CategoryIcon && (
                    <CategoryIcon className={categoryConfig?.colorClass} />
                  )}
                  {event.category ?? "Uncategorized"}
                </Badge>
                <span className="text-xs text-white/70">
                  {organizationName}
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
                  {event.address ?? "Location TBD"}
                </span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDateTime(event.start_time)}
                </span>
                <span className="text-white/40">·</span>
                <span className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  {formatCount(attendeeCount)}/{formatCount(maxCapacity)}
                </span>
              </div>
              {/* Progress bar */}
              <div className="">
                <Progress
                  value={capacityPercentage}
                  indicatorClassName={getProgressColor(capacityPercentage)}
                  className=""
                />
              </div>
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

            {/* Status badge shown over image at top left */}
            <Badge className={statusBadgeClassName}>
              {statusLabel}
            </Badge>

            {hasImageLoadError ? (
              <Skeleton className="h-48 w-full rounded-none bg-muted" />
            ) : (
              <Image
                src={eventImageSource}
                alt={event.title}
                width={500}
                height={500}
                className="h-48 w-full border border-border object-cover"
                onError={() => setHasImageLoadError(true)}
              />
            )}
          </div>

          {/* Event details */}
          <div className="flex flex-col gap-3 p-4">
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-sm text-muted-foreground">
                {organizationName ?? "Organization"}
              </h2>
              <h1 className="text-2xl font-bold">{event.title}</h1>
            </div>
            {/* Category */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">
                {CategoryIcon && (
                  <CategoryIcon className={categoryConfig?.colorClass} />
                )}
                {event.category ?? "Uncategorized"}
              </Badge>
            </div>
            <div className="flex gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {event.address ?? "Location TBD"}
              </p>
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
                {attendeeCount + " / " + maxCapacity + " attendees"}
              </p>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
}

export default EventCard;
