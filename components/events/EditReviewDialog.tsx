"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { cn } from "@/lib/utils";
import { updateReview, deleteReview } from "@/lib/reviews";
import type { ReviewWithProfile } from "@/lib/types";

type Props = {
  review: ReviewWithProfile;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: (review: ReviewWithProfile) => void;
  onDeleted: (reviewId: number) => void;
};

export default function EditReviewDialog({
  review,
  open,
  onOpenChange,
  onUpdated,
  onDeleted,
}: Props) {
  const [rating, setRating] = useState(review.rating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [content, setContent] = useState(review.content ?? "");
  const [error, setError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [savePending, startSaveTransition] = useTransition();
  const [deletePending, startDeleteTransition] = useTransition();

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setRating(review.rating);
      setContent(review.content ?? "");
      setError("");
    }
    onOpenChange(open);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) { setError("Please select a rating."); return; }
    setError("");
    startSaveTransition(async () => {
      const result = await updateReview(review.id, {
        rating,
        content: content.trim() || null,
      });
      if (result && typeof result === "object" && "id" in result) {
        onUpdated({ ...review, rating, content: content.trim() || null });
        onOpenChange(false);
      } else {
        setError(result instanceof Error ? result.message : "Failed to update review.");
      }
    });
  };

  const handleDelete = () => {
    setError("");
    startDeleteTransition(async () => {
      const result = await deleteReview(review.id);
      if (result === null) {
        onDeleted(review.id);
        setDeleteConfirmOpen(false);
        onOpenChange(false);
      } else {
        setDeleteConfirmOpen(false);
        setError(result instanceof Error ? result.message : "Failed to delete review.");
      }
    });
  };

  const busy = savePending || deletePending;

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[min(92vh,900px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-md"
        >
          <form onSubmit={handleSave} className="flex min-h-0 flex-1 flex-col">
            <DialogHeader className="shrink-0 px-4 py-4 sm:px-6">
              <DialogTitle className="text-2xl font-bold tracking-tight">
                Edit Review
              </DialogTitle>
            </DialogHeader>

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className="p-0.5"
                      onMouseEnter={() => setHoveredRating(i + 1)}
                      onMouseLeave={() => setHoveredRating(0)}
                      onClick={() => setRating(i + 1)}
                    >
                      <Star
                        className={cn(
                          "size-6 transition-colors",
                          i < (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-muted-foreground/40",
                        )}
                      />
                    </button>
                  ))}
                </div>

                <Textarea
                  placeholder="Share your experience..."
                  value={content}
                  rows={4}
                  maxLength={1000}
                  onChange={(e) => setContent(e.target.value)}
                />

                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
            </div>

            <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
              <Button
                type="button"
                variant="destructive"
                disabled={busy}
                onClick={() => setDeleteConfirmOpen(true)}
              >
                Delete review
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="outline" disabled={busy}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" disabled={busy}>
                {savePending ? "Saving…" : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold tracking-tight">
              Delete review?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove your review. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
              <Button type="button" variant="outline" disabled={deletePending}>
                Cancel
              </Button>
            </AlertDialogCancel>
            <Button
              type="button"
              variant="destructive"
              disabled={deletePending}
              onClick={handleDelete}
            >
              {deletePending ? "Deleting…" : "Delete review"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
