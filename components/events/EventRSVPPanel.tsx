"use client";

import { CalendarPlus, Copy, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

type Props = {
  event: Event;
  isRsvped: boolean;
  rsvpCount: number;
  rsvpPending: boolean;
  rsvpError: string;
  isEnded: boolean;
  isFull: boolean;
  attendeeAvatars: { username: string | null; avatar_url: string | null }[];
  onRsvp: () => void;
  onCalendarOpen: () => void;
  onCopyLink: () => void;
  onShare: () => void;
};

export default function EventRSVPPanel({
  event,
  isRsvped,
  rsvpCount,
  rsvpPending,
  rsvpError,
  isEnded,
  isFull,
  attendeeAvatars,
  onRsvp,
  onCalendarOpen,
  onCopyLink,
  onShare,
}: Props) {
  const maxCapacity = event.max_capacity;
  const spotsRemaining = maxCapacity !== null ? maxCapacity - rsvpCount : null;

  return (
    <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        Attending
      </p>

      <div className={cn("flex items-end gap-2 transition-opacity", rsvpPending && "opacity-40")}>
        <span className="text-4xl font-bold leading-none">{rsvpCount}</span>
        {maxCapacity !== null && (
          <span className="pb-1 text-xl leading-none text-muted-foreground">
            / {maxCapacity}
          </span>
        )}
      </div>

      {maxCapacity !== null && (
        <div className={cn("flex flex-col gap-1 transition-opacity", rsvpPending && "opacity-40")}>
          <Progress
            value={Math.min(100, (rsvpCount / maxCapacity) * 100)}
            className="h-1.5"
          />
          <p className="text-xs text-muted-foreground">
            {spotsRemaining === 0 ? "Event is full" : `${spotsRemaining} spots remaining`}
          </p>
        </div>
      )}

      {rsvpCount > 0 && (
        <AvatarGroup className={cn("transition-opacity", rsvpPending && "opacity-40")}>
          {attendeeAvatars.map((a, i) => (
            <Avatar key={i} size="sm">
              {a.avatar_url && <AvatarImage src={a.avatar_url} alt={a.username ?? ""} />}
              <AvatarFallback>
                {a.username ? a.username.slice(0, 2).toUpperCase() : "?"}
              </AvatarFallback>
            </Avatar>
          ))}
          {rsvpCount > attendeeAvatars.length && (
            <AvatarGroupCount className="text-xs">
              +{rsvpCount - attendeeAvatars.length}
            </AvatarGroupCount>
          )}
        </AvatarGroup>
      )}

      {rsvpError && <p className="text-sm text-destructive">{rsvpError}</p>}

      <Button
        className="w-full"
        variant={isRsvped ? "secondary" : "default"}
        disabled={rsvpPending || (isFull && !isRsvped) || isEnded}
        onClick={onRsvp}
      >
        {rsvpPending
          ? "Loading..."
          : isEnded
            ? "Event Ended"
            : isRsvped
              ? "Cancel RSVP"
              : isFull
                ? "Event is Full"
                : "RSVP to this event"}
      </Button>

      <Separator />

      <div className="flex flex-col gap-2">
        <span className="text-sm text-muted-foreground">Share this event</span>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" aria-label="Add to calendar" onClick={onCalendarOpen}>
            <CalendarPlus className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Copy link" onClick={onCopyLink}>
            <Copy className="size-4" />
          </Button>
          <Button variant="outline" size="icon" aria-label="Share" onClick={onShare}>
            <Share2 className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
