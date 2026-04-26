"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { Search, UserMinus, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import PaginationBar from "@/components/discover/PaginationBar";
import { getAttendeesPage, removeAttendee } from "@/lib/rsvp";

const PAGE_SIZE = 20;

type Attendee = { userId: string; username: string | null; avatar_url: string | null };

type Props = {
  eventId: number;
  total: number;
  isOwner: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAttendeeRemoved: () => void;
};

export default function AttendeeListDialog({
  eventId,
  total,
  isOwner,
  open,
  onOpenChange,
  onAttendeeRemoved,
}: Props) {
  const [page, setPage] = useState(1);
  const [attendees, setAttendees] = useState<Attendee[]>([]);
  const [count, setCount] = useState(total);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [confirmRemove, setConfirmRemove] = useState<Attendee | null>(null);
  const [removeError, setRemoveError] = useState("");
  const [removePending, startRemoveTransition] = useTransition();
  const searchRef = useRef<HTMLInputElement>(null);

  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE));

  // Reset everything when dialog opens/closes
  useEffect(() => {
    if (!open) return;
    setPage(1);
    setSearch("");
    setDebouncedSearch("");
  }, [open]);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch on open, page change, or search change
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getAttendeesPage(eventId, page, PAGE_SIZE, debouncedSearch).then((result) => {
      setAttendees(result.items);
      setCount(result.total);
      setLoading(false);
    });
  }, [open, eventId, page, debouncedSearch]);

  const handleConfirmRemove = () => {
    if (!confirmRemove) return;
    setRemoveError("");
    startRemoveTransition(async () => {
      const result = await removeAttendee(eventId, confirmRemove.userId);
      if (result === null) {
        setAttendees((prev) => prev.filter((a) => a.userId !== confirmRemove.userId));
        setCount((prev) => prev - 1);
        setConfirmRemove(null);
        onAttendeeRemoved();
      } else {
        setRemoveError(result.message);
      }
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[min(92vh,640px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
          onPointerDownOutside={(e) => { if (confirmRemove) e.preventDefault(); }}
          onInteractOutside={(e) => { if (confirmRemove) e.preventDefault(); }}
        >
          <DialogHeader className="shrink-0 px-4 pt-4 sm:px-6 sm:pt-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Attendees
              <span className="ml-2 text-base font-normal text-muted-foreground">
                ({count})
              </span>
            </DialogTitle>
          </DialogHeader>

          {/* Search bar — sticky below header */}
          <div className="shrink-0 px-4 py-3 sm:px-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                ref={searchRef}
                placeholder="Search attendees..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-9"
              />
              {search && (
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => { setSearch(""); searchRef.current?.focus(); }}
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain [-webkit-overflow-scrolling:touch]">
            {loading ? (
              <div className="flex flex-col">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                    <div className="size-9 shrink-0 rounded-full bg-muted" />
                    <div className="h-4 w-32 rounded bg-muted" />
                  </div>
                ))}
              </div>
            ) : attendees.length === 0 ? (
              <p className="px-4 py-6 text-sm text-muted-foreground sm:px-6">
                {debouncedSearch ? "No attendees match your search." : "No attendees yet."}
              </p>
            ) : (
              <ul>
                {attendees.map((a) => (
                  <li key={a.userId} className="flex items-center gap-3 px-4 py-3 sm:px-6">
                    <Avatar className="size-9 shrink-0">
                      {a.avatar_url && (
                        <AvatarImage src={a.avatar_url} alt={a.username ?? ""} />
                      )}
                      <AvatarFallback className="text-xs">
                        {a.username ? a.username.slice(0, 2).toUpperCase() : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="flex-1 text-sm font-medium">
                      {a.username ?? "Anonymous"}
                    </span>
                    {isOwner && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
                        onClick={() => { setRemoveError(""); setConfirmRemove(a); }}
                      >
                        <UserMinus className="size-4" />
                      </Button>
                    )}
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

      <AlertDialog
        open={!!confirmRemove}
        onOpenChange={(open) => { if (!open) setConfirmRemove(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
              Remove attendee?
            </AlertDialogTitle>
            <AlertDialogDescription>
              <span className="font-medium text-foreground">
                {confirmRemove?.username ?? "This attendee"}
              </span>{" "}
              will be removed from this event. They can RSVP again if registration is still open.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {removeError && <p className="text-sm text-destructive">{removeError}</p>}
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={removePending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={removePending}
              onClick={handleConfirmRemove}
            >
              {removePending ? "Removing…" : "Remove attendee"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
