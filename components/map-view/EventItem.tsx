import React from "react";
import { Event } from "@/lib/types";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";
import { formatDateTime, formatCount } from "@/lib/utils";
import { getCategoryConfig } from "@/lib/events/categories";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import Link from "next/link";

function EventItem({
  event,
  selected,
  onSelect,
}: {
  event: Event;
  selected?: boolean;
  onSelect?: (id: number) => void;
}) {
  const categoryLabel = event.category ?? "Uncategorized";
  const eventAddress = event.address ?? "Location TBD";
  const maxCapacity = event.max_capacity ?? 0;
  const attendees = Number(event.rsvp_count ?? 0);
  const safeAttendees = Number.isFinite(attendees) ? attendees : 0;
  const categoryConfig = getCategoryConfig(categoryLabel);
  const Icon = categoryConfig?.icon;

  return (
    <div
      data-event-id={event.id}
      className={`flex flex-col gap-4 p-4 border-b cursor-pointer transition-all duration-300 ${
        selected
          ? "bg-primary/5 border-l-2 border-l-primary"
          : "hover:opacity-80"
      }`}
      onClick={() => onSelect?.(event.id)}
    >
      {/* Content */}
      <div className="flex gap-4">
        {/* Category Icon */}
        <div className="h-10 w-10 rounded-full border bg-card/50 flex items-center justify-center shrink-0">
          {Icon && <Icon className={categoryConfig?.colorClass} size={20} />}
        </div>
        {/* Information */}
        <div className="flex flex-col gap-2 w-full">
          {/* Organization */}

          <Link href={`/organizations/${event.organization_id}`}>
            <p className="text-sm text-muted-foreground hover:underline">
              {event.organization_name ?? "Organization"}
            </p>
          </Link>

          {/* Title */}
          <h1 className="text-lg font-bold">{event.title}</h1>
          {/* Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}
          {/* Address */}
          <div className="flex items-start gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <p className="text-sm text-muted-foreground">{eventAddress}</p>
              {event.location_details && (
                <p className="text-xs text-muted-foreground/70">
                  {event.location_details}
                </p>
              )}
            </div>
          </div>
          {/* Start Date */}
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatDateTime(event.start_time)}
            </p>
          </div>
          {/* Attendees */}
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {formatCount(safeAttendees)} / {formatCount(maxCapacity)} attendees
            </p>
          </div>
        </div>
        {/* View Event Button */}
        <Button
          variant='outline'
          size="icon"
          asChild
          onClick={(e) => e.stopPropagation()}
          className=" text-primary "
        >
          <Link href={`/events/${event.id}`}>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default EventItem;
