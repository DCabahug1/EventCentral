"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";

type Props = {
  open: boolean;
  eventTitle: string;
  error: string;
  deleting: boolean;
  cancelling: boolean;
  isAlreadyCancelled: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: () => void;
  onCancel: () => void;
};

export default function DeleteEventDialog({
  open,
  eventTitle,
  error,
  deleting,
  cancelling,
  isAlreadyCancelled,
  onOpenChange,
  onDelete,
  onCancel,
}: Props) {
  const busy = deleting || cancelling;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold tracking-tight">
            Remove this event?
          </AlertDialogTitle>
          <AlertDialogDescription asChild>
            <div className="flex flex-col gap-3 text-sm text-muted-foreground">
              {!isAlreadyCancelled && (
                <>
                  <p>
                    Consider <span className="font-medium text-foreground">cancelling</span> instead.
                    Attendees will see it as cancelled and won&apos;t lose it from their history.
                  </p>
                  <Separator />
                </>
              )}
              <p>
                Deleting{" "}
                <span className="font-medium text-foreground">{eventTitle}</span>{" "}
                is permanent and cannot be undone.
              </p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error ? <p className="text-sm text-destructive">{error}</p> : null}
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button type="button" variant="outline" disabled={busy}>
              Go back
            </Button>
          </AlertDialogCancel>
          <Button
            type="button"
            variant={isAlreadyCancelled ? "destructive" : "outline"}
            disabled={busy}
            onClick={onDelete}
          >
            {deleting ? "Deleting…" : "Delete event"}
          </Button>
          {!isAlreadyCancelled && (
            <Button
              type="button"
              variant="destructive"
              disabled={busy}
              onClick={onCancel}
            >
              {cancelling ? "Cancelling…" : "Cancel event"}
            </Button>
          )}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
