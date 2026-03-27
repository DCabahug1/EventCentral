import React from "react";
import { Event } from "@/lib/types";
import { ArrowUpRight, Calendar, MapPin, Users } from "lucide-react";
import { formatDateTime } from "@/lib/utils";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";
import Link from "next/link";

function EventItem({ event }: { event: Event }) {
  const categoryConfig = getCategoryConfig(event.tags[0]);
  const Icon = categoryConfig?.icon;
  return (
    <div className="flex flex-col gap-4 p-4 border-b hover:opacity-80 cursor-pointer transition-all duration-300">
      {/* Content */}
      <div className="flex gap-4">
        {/* Category Icon */}
        <div
          className={`h-10 w-10 rounded-full border bg-card/50 flex items-center justify-center`}
        >
          {Icon && <Icon className={categoryConfig?.colorClass} size={20} />}
        </div>
        {/* Information */}
        <div className="flex flex-col gap-2 w-full">
          {/* Title */}
          <h1 className="text-lg font-bold">{event.title}</h1>
          {/* Description */}
          {event.description && (
            <p className="text-sm text-muted-foreground">{event.description}</p>
          )}
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin className="w-4 h-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{event.location}</p>
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
              {50} / {event.max_capacity} attendees
            </p>
          </div>
          {/* Capacity bar */}
          <Progress
            value={(50 / event.max_capacity) * 100}
            max={event.max_capacity}
            className="w-full"
            indicatorClassName="bg-primary"
          />
        </div>
        {/* View Event Button */}
        <Button variant="outline" className="" size="icon" asChild>
          <Link href={`/events/${event.id}`}>
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
}

export default EventItem;
