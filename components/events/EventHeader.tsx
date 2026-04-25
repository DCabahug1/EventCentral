"use client";

import Link from "next/link";
import { Calendar, MapPin, Users, Pencil, Building } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateTime, cn } from "@/lib/utils";
import { EVENT_STATUS_CONFIG, type EventStatus } from "@/lib/eventStatus";
import type { Event, Organization } from "@/lib/types";

type Props = {
  event: Event;
  organization: Organization | null;
  rsvpCount: number;
  isOwner: boolean;
  eventStatus: EventStatus;
  onEditClick: () => void;
};

export default function EventHeader({
  event,
  organization,
  rsvpCount,
  isOwner,
  eventStatus,
  onEditClick,
}: Props) {
  const { label: statusLabel, className: statusClassName } =
    EVENT_STATUS_CONFIG[eventStatus];

  const categoryConfig = getCategoryConfig(event.category ?? "");
  const CategoryIcon = categoryConfig?.icon;

  return (
    <div className="flex flex-col gap-3 mb-8">
      <Badge variant="outline" className={cn("w-fit", statusClassName)}>
        {statusLabel}
      </Badge>

      <div className="flex flex-wrap items-center gap-3">
        <h1 className="min-w-0 flex-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {event.title}
        </h1>
        {isOwner && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="shrink-0"
            onClick={onEditClick}
          >
            <Pencil className="size-4" />
            Edit
          </Button>
        )}
      </div>

      {categoryConfig && (
        <Badge
          variant="outline"
          className={cn("w-fit flex items-center gap-1.5 text-sm", categoryConfig.colorClass)}
        >
          {CategoryIcon && <CategoryIcon className="size-4" />}
          <span className="text-foreground">{categoryConfig.label}</span>
        </Badge>
      )}

      {organization && (
        <Link
          href={`/organizations/${organization.id}`}
          className="inline-flex w-fit items-center gap-2 text-sm text-primary hover:underline"
        >
          <Building className="size-4 shrink-0" />
          <span>{organization.name}</span>
        </Link>
      )}

      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 shrink-0" />
          <span>{formatDateTime(event.start_time)}</span>
        </div>
        {event.address && (
          <div className="flex items-center gap-2">
            <MapPin className="size-4 shrink-0" />
            <span>{event.address}</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Users className="size-4 shrink-0" />
          <span>
            {rsvpCount}
            {event.max_capacity !== null ? ` / ${event.max_capacity}` : ""} attending
          </span>
        </div>
      </div>
    </div>
  );
}
