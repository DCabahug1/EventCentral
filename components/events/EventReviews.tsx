"use client";

import { useState, useTransition } from "react";
import { Pencil, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { createReview } from "@/lib/reviews";
import EditReviewDialog from "@/components/events/EditReviewDialog";
import EventReviewSummary from "@/components/events/EventReviewSummary";
import type { Event, Review, ReviewWithProfile } from "@/lib/types";

type Props = {
  event: Event;
  initialReviews: ReviewWithProfile[];
  currentUserId: string | null;
  currentUserProfile: { username: string | null; avatar_url: string | null } | null;
  isRsvped: boolean;
};

export default function EventReviews({
  event,
  initialReviews,
  currentUserId,
  currentUserProfile,
  isRsvped,
}: Props) {
  const [reviews, setReviews] = useState<ReviewWithProfile[]>(initialReviews);
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewPending, startReviewTransition] = useTransition();
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [editingReview, setEditingReview] = useState<ReviewWithProfile | null>(null);

  const canReview = new Date(event.end_time) <= new Date();
  const userHasReview =
    currentUserId !== null && reviews.some((r) => r.user_id === currentUserId);

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleSubmitReview = () => {
    if (userHasReview) {
      setReviewError("You've already reviewed this event. Edit your existing review instead.");
      return;
    }
    if (reviewRating === 0) {
      setReviewError("Please select a rating.");
      return;
    }
    setReviewError("");
    setReviewSuccess(false);
    startReviewTransition(async () => {
      const result = await createReview({
        event_id: event.id,
        rating: reviewRating,
        content: reviewContent.trim() || null,
      });
      if (result && typeof result === "object" && "id" in result && "event_id" in result) {
        const newReview: ReviewWithProfile = {
          ...(result as Review),
          username: currentUserProfile?.username ?? null,
          avatar_url: currentUserProfile?.avatar_url ?? null,
        };
        setReviews((prev) => [newReview, ...prev]);
        setReviewRating(0);
        setReviewContent("");
        setReviewSuccess(true);
      } else {
        setReviewError(result instanceof Error ? result.message : "Failed to submit review.");
      }
    });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" />
          <h2 className="text-xl font-semibold">Reviews</h2>
        </div>
        {reviews.length > 0 && (
          <div className="flex items-center gap-1.5 text-sm">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < Math.round(avgRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40",
                )}
              />
            ))}
            <span className="font-medium">{avgRating.toFixed(1)}</span>
            <span className="text-muted-foreground">({reviews.length})</span>
          </div>
        )}
      </div>

      {reviews.length === 0 && (
        <p className="text-sm text-muted-foreground">No reviews yet.</p>
      )}

      {reviews.length > 0 && <EventReviewSummary reviews={reviews} />}

      {/* Review cards */}
      {reviews.map((review) => (
        <div key={review.id} className="flex flex-col gap-3 rounded-lg border border-border p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                {review.avatar_url && (
                  <AvatarImage src={review.avatar_url} alt={review.username ?? ""} />
                )}
                <AvatarFallback className="text-xs">
                  {(review.username ?? "?").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium">
                {review.username ?? "Anonymous"}
              </span>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <span className="text-xs text-muted-foreground">
                {new Date(review.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              {review.user_id === currentUserId && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-muted-foreground hover:text-foreground"
                  onClick={() => setEditingReview(review)}
                >
                  <Pencil className="size-3.5" />
                </Button>
              )}
            </div>
          </div>

          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "size-4",
                  i < review.rating
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40",
                )}
              />
            ))}
          </div>

          {review.content && (
            <p className="text-sm leading-relaxed">{review.content}</p>
          )}
        </div>
      ))}

      {/* Leave a review */}
      {!canReview ? (
        <p className="text-sm text-muted-foreground">
          Reviews can be left once the event has ended.
        </p>
      ) : !isRsvped ? (
        <p className="text-sm text-muted-foreground">
          Only attendees can leave a review.
        </p>
      ) : userHasReview ? (
        <p className="text-sm text-muted-foreground">
          You&apos;ve already reviewed this event. Use the pencil on your review to edit it.
        </p>
      ) : null}
      {!userHasReview && (
      <div
        className={cn(
          "flex flex-col gap-3 rounded-lg border border-border p-4",
          (!canReview || !isRsvped) && "opacity-50 pointer-events-none",
        )}
      >
        <h3 className="font-medium">Leave a review</h3>
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <button
              key={i}
              type="button"
              className="p-0.5"
              onMouseEnter={() => setHoveredRating(i + 1)}
              onMouseLeave={() => setHoveredRating(0)}
              onClick={() => {
                setReviewRating(i + 1);
                setReviewSuccess(false);
              }}
            >
              <Star
                className={cn(
                  "size-6 transition-colors",
                  i < (hoveredRating || reviewRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-muted-foreground/40",
                )}
              />
            </button>
          ))}
        </div>
        <Textarea
          placeholder="Share your experience..."
          value={reviewContent}
          rows={3}
          maxLength={1000}
          onChange={(e) => {
            setReviewContent(e.target.value);
            setReviewSuccess(false);
          }}
        />
        {reviewError && <p className="text-sm text-destructive">{reviewError}</p>}
        {reviewSuccess && (
          <p className="text-sm text-green-600 dark:text-green-400">Review submitted!</p>
        )}
        <Button className="w-full" disabled={reviewPending} onClick={handleSubmitReview}>
          {reviewPending ? "Submitting..." : "Submit Review"}
        </Button>
      </div>
      )}

      {editingReview && (
        <EditReviewDialog
          review={editingReview}
          open={!!editingReview}
          onOpenChange={(open) => { if (!open) setEditingReview(null); }}
          onUpdated={(updated) => {
            setReviews((prev) => prev.map((r) => r.id === updated.id ? updated : r));
            setEditingReview(null);
          }}
          onDeleted={(reviewId) => {
            setReviews((prev) => prev.filter((r) => r.id !== reviewId));
            setEditingReview(null);
          }}
        />
      )}
    </div>
  );
}
