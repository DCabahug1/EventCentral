"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import PaginationBar from "@/components/discover/PaginationBar";
import { getAttendeesPage } from "@/lib/rsvp";

const PAGE_SIZE = 20;

type Attendee = { username: string | null; avatar_url: string | null };

type Props = {
  eventId: number;
  total: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function AttendeeListDialog({ eventId, total, open, onOpenChange }: Props) {
  const [page, setPage] = useState(1);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [count, setCount] = useState(total);
  const [loading, setLoading] = useState(false);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  useEffect(() => {
    if (!open) return;
    setPage(1);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getAttendeesPage(eventId, page, PAGE_SIZE).then((result) => {
      setAttendees(result.items);
      setCount(result.total);
      setLoading(false);
    });
  }, [open, eventId, page]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(92vh,640px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
      >
        <DialogHeader className="shrink-0 px-4 py-4 sm:px-6">
          <DialogTitle className="text-2xl font-bold tracking-tight">
            Attendees
            <span className="ml-2 text-base font-normal text-muted-foreground">
              ({count})
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
          {loading ? (
            <div className="flex flex-col">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                  <div className="size-9 shrink-0 rounded-full bg-muted" />
                  <div className="h-4 w-32 rounded bg-muted" />
                </div>
              ))}
            </div>
          ) : attendees.length === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground sm:px-6">
              No attendees yet.
            </p>
          ) : (
            <ul>
              {attendees.map((a, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 sm:px-6"
                >
                  <Avatar className="size-9 shrink-0">
                    {a.avatar_url && (
                      <AvatarImage src={a.avatar_url} alt={a.username ?? ""} />
                    )}
                    <AvatarFallback className="text-xs">
                      {a.username ? a.username.slice(0, 2).toUpperCase() : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium">
                    {a.username ?? "Anonymous"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <DialogFooter className="shrink-0 flex-col gap-3 border-t bg-background px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <PaginationBar
            page={page}
            totalPages={totalPages}
            totalItems={count}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
            label="Attendees"
            className="w-full sm:w-auto"
          />
          <DialogClose asChild>
            <Button type="button" variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
