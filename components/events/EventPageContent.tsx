"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, CalendarPlus } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { createRSVP, cancelRSVP, getEventRsvpCount } from "@/lib/rsvp";
import { deleteEvent, updateEvent } from "@/lib/eventsServer";
import { getEventStatus } from "@/lib/eventStatus";
import EventHeader from "@/components/events/EventHeader";
import EventReviews from "@/components/events/EventReviews";
import EventRSVPPanel from "@/components/events/EventRSVPPanel";
import EventHostedByCard from "@/components/events/EventHostedByCard";
import EditEventDialog from "@/components/events/EditEventDialog";
import DeleteEventDialog from "@/components/events/DeleteEventDialog";
import AttendeeListDialog from "@/components/events/AttendeeListDialog";
import type { Event, Organization, ReviewWithProfile } from "@/lib/types";

type Props = {
  event: Event;
  organization: Organization | null;
  reviews: ReviewWithProfile[];
  initialRsvpStatus: boolean;
  currentUserId: string | null;
  currentUserProfile: { username: string | null; avatar_url: string | null } | null;
  attendeeAvatars: { username: string | null; avatar_url: string | null }[];
};

export default function EventPageContent({
  event,
  organization,
  reviews,
  initialRsvpStatus,
  currentUserId,
  currentUserProfile,
  attendeeAvatars,
}: Props) {
  const router = useRouter();

  const [isRsvped, setIsRsvped] = useState(initialRsvpStatus);
  const [rsvpCount, setRsvpCount] = useState(event.rsvp_count ?? 0);
  const [localAttendeeAvatars, setLocalAttendeeAvatars] = useState(attendeeAvatars);
  const [rsvpPending, startRsvpTransition] = useTransition();
  const [rsvpError, setRsvpError] = useState("");

  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);
  const [attendeeListOpen, setAttendeeListOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const isOwner = !!currentUserId && currentUserId === event.user_id;
  const eventStatus = getEventStatus(event);
  const isFull = event.max_capacity !== null && rsvpCount >= event.max_capacity;
  const isEnded = eventStatus === "ENDED" || eventStatus === "CANCELLED";

  const handleRsvp = () => {
    if (!currentUserId) { router.push("/auth/login"); return; }
    setRsvpError("");
    startRsvpTransition(async () => {
      if (isRsvped) {
        const result = await cancelRSVP(event.id);
        if (result === null) {
          setIsRsvped(false);
          setRsvpCount(await getEventRsvpCount(event.id));
          setLocalAttendeeAvatars((prev) =>
            prev.filter(
              (a) =>
                !(
                  a.avatar_url === currentUserProfile?.avatar_url &&
                  a.username === currentUserProfile?.username
                ),
            ),
          );
        } else {
          setRsvpError(result instanceof Error ? result.message : "Failed to cancel RSVP.");
        }
      } else {
        const result = await createRSVP({ event_id: event.id });
        if (result && typeof result === "object" && "id" in result && "event_id" in result) {
          setIsRsvped(true);
          setRsvpCount(await getEventRsvpCount(event.id));
          if (currentUserProfile) {
            setLocalAttendeeAvatars((prev) =>
              prev.length < 4
                ? [{ username: currentUserProfile.username, avatar_url: currentUserProfile.avatar_url }, ...prev]
                : prev,
            );
          }
        } else {
          setRsvpError(result instanceof Error ? result.message : "Failed to RSVP.");
        }
      }
    });
  };

  const handleCopyLink = async () => {
    try { await navigator.clipboard.writeText(window.location.href); } catch {}
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: event.title, url: window.location.href });
      } else {
        await handleCopyLink();
      }
    } catch {}
  };

  const handleDownloadICS = () => {
    const fmt = (d: string) =>
      new Date(d).toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
    const esc = (s: string) =>
      s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

    const lines = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//EventCentral//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@eventcentral`,
      `DTSTAMP:${fmt(new Date().toISOString())}`,
      `DTSTART:${fmt(event.start_time)}`,
      `DTEND:${fmt(event.end_time)}`,
      `SUMMARY:${esc(event.title)}`,
      event.description ? `DESCRIPTION:${esc(event.description)}` : null,
      event.address ? `LOCATION:${esc(event.address)}` : null,
      "END:VEVENT",
      "END:VCALENDAR",
    ].filter(Boolean).join("\r\n");

    const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setCalendarDialogOpen(false);
  };

  const handleDelete = async () => {
    setDeleteError("");
    setDeleting(true);
    const result = await deleteEvent(event.id);
    setDeleting(false);
    if (result === null) {
      router.push("/discover");
    } else {
      setDeleteError(result instanceof Error ? result.message : "Failed to delete event.");
    }
  };

  const handleCancelEvent = async () => {
    setDeleteError("");
    setCancelling(true);
    const result = await updateEvent(event.id, { CANCELLED: true });
    setCancelling(false);
    if (result && typeof result === "object" && "id" in result) {
      setDeleteDialogOpen(false);
      router.refresh();
    } else {
      setDeleteError(result instanceof Error ? result.message : "Failed to cancel event.");
    }
  };

  const prefersReducedMotion = useReducedMotion();
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: prefersReducedMotion ? 0 : 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.45, ease: "easeOut" as const, delay },
  });

  return (
    <>
      <div className="min-h-svh bg-background">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <motion.div {...fadeUp(0)}>
            <Link
              href="/discover"
              className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
              Back to Discover
            </Link>
          </motion.div>

          <motion.div {...fadeUp(0.08)}>
            <EventHeader
              event={event}
              organization={organization}
              rsvpCount={rsvpCount}
              isOwner={isOwner}
              eventStatus={eventStatus}
              onEditClick={() => setEditDialogOpen(true)}
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            {/* Left column */}
            <motion.div className="order-2 flex flex-col gap-8 lg:order-1" {...fadeUp(0.18)}>
              {event.description && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    About this event
                  </p>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>
              )}

              <EventReviews
                event={event}
                initialReviews={reviews}
                currentUserId={currentUserId}
                currentUserProfile={currentUserProfile}
                isRsvped={isRsvped}
              />
            </motion.div>

            {/* Right column */}
            <motion.div className="order-1 flex flex-col gap-6 lg:order-2 lg:sticky lg:top-24 lg:self-start" {...fadeUp(0.12)}>
              <EventRSVPPanel
                event={event}
                isRsvped={isRsvped}
                rsvpCount={rsvpCount}
                rsvpPending={rsvpPending}
                rsvpError={rsvpError}
                isEnded={isEnded}
                isFull={isFull}
                attendeeAvatars={localAttendeeAvatars}
                onRsvp={handleRsvp}
                onCalendarOpen={() => setCalendarDialogOpen(true)}
                onCopyLink={handleCopyLink}
                onShare={handleShare}
                onViewAttendees={() => setAttendeeListOpen(true)}
              />
              {organization && <EventHostedByCard organization={organization} />}
            </motion.div>
          </div>
        </div>
      </div>

      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle>Add to Calendar</DialogTitle>
            <DialogDescription>
              Export this event as an <strong>.ics</strong> file, the standard calendar format
              supported by Apple Calendar, Google Calendar, Outlook, and most calendar apps.
            </DialogDescription>
          </DialogHeader>
          <ol className="flex flex-col gap-2 text-sm text-muted-foreground list-decimal pl-4">
            <li>Click <strong className="text-foreground">Export .ics</strong> below to download the file.</li>
            <li>Open the downloaded file, your calendar app will launch automatically.</li>
            <li>Confirm the import when prompted.</li>
          </ol>
          <DialogFooter>
            <Button className="w-full" onClick={handleDownloadICS}>
              <CalendarPlus className="size-4" />
              Export .ics
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AttendeeListDialog
        eventId={event.id}
        total={rsvpCount}
        isOwner={isOwner}
        open={attendeeListOpen}
        onOpenChange={setAttendeeListOpen}
        onAttendeeRemoved={() => setRsvpCount((c) => Math.max(0, c - 1))}
      />

      <EditEventDialog
        event={event}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSuccess={() => { setEditDialogOpen(false); router.refresh(); }}
        onRequestDelete={() => { setEditDialogOpen(false); setDeleteDialogOpen(true); }}
      />

      <DeleteEventDialog
        open={deleteDialogOpen}
        eventTitle={event.title}
        error={deleteError}
        deleting={deleting}
        cancelling={cancelling}
        isAlreadyCancelled={event.CANCELLED}
        onOpenChange={setDeleteDialogOpen}
        onDelete={handleDelete}
        onCancel={handleCancelEvent}
      />
    </>
  );
}
