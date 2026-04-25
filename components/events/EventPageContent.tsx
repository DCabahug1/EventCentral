"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  Calendar,
  CalendarPlus,
  MapPin,
  Users,
  Star,
  Share2,
  Copy,
  Sparkles,
  Building,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { getCategoryConfig } from "@/lib/categoryConfig";
import { formatDateTime, cn } from "@/lib/utils";
import { createRSVP, cancelRSVP, getEventRsvpCount } from "@/lib/rsvp";
import { generateReviewSummary } from "@/lib/reviewSummary";
import { createReview } from "@/lib/reviews";
import type {
  Event,
  Organization,
  Review,
  ReviewWithProfile,
} from "@/lib/types";

type Props = {
  event: Event;
  organization: Organization | null;
  reviews: ReviewWithProfile[];
  initialRsvpStatus: boolean;
  currentUserId: string | null;
  currentUserProfile: {
    username: string | null;
    avatar_url: string | null;
  } | null;
};

export default function EventPageContent({
  event,
  organization,
  reviews: initialReviews,
  initialRsvpStatus,
  currentUserId,
  currentUserProfile,
}: Props) {
  const router = useRouter();

  const [isRsvped, setIsRsvped] = useState(initialRsvpStatus);
  const [rsvpCount, setRsvpCount] = useState(event.rsvp_count ?? 0);
  const [reviews, setReviews] = useState<ReviewWithProfile[]>(initialReviews);
  const [rsvpPending, startRsvpTransition] = useTransition();
  const [rsvpError, setRsvpError] = useState("");

  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false);

  useEffect(() => {
    if (reviews.length === 0) return;
    setSummaryLoading(true);
    generateReviewSummary(reviews)
      .then((result) => {
        if (typeof result === "string") setReviewSummary(result);
      })
      .catch(() => {})
      .finally(() => setSummaryLoading(false));
  }, []);

  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewPending, startReviewTransition] = useTransition();
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const categoryConfig = getCategoryConfig(event.category ?? "");
  const CategoryIcon = categoryConfig?.icon;

  const maxCapacity = event.max_capacity;
  const spotsRemaining = maxCapacity !== null ? maxCapacity - rsvpCount : null;
  const isFull = maxCapacity !== null && rsvpCount >= maxCapacity;
  const isEnded =
    event.status === "ENDED" ||
    event.status === "CANCELLED" ||
    new Date(event.end_time) <= new Date();
  const canReview =
    event.status === "ENDED" || new Date(event.end_time) <= new Date();

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const handleRsvp = () => {
    if (!currentUserId) {
      router.push("/auth/login");
      return;
    }
    setRsvpError("");
    startRsvpTransition(async () => {
      if (isRsvped) {
        const result = await cancelRSVP(event.id);
        if (result === null) {
          setIsRsvped(false);
          setRsvpCount(await getEventRsvpCount(event.id));
        } else {
          setRsvpError(
            result instanceof Error ? result.message : "Failed to cancel RSVP.",
          );
        }
      } else {
        const result = await createRSVP({ event_id: event.id });
        if (
          result &&
          typeof result === "object" &&
          "id" in result &&
          "event_id" in result
        ) {
          setIsRsvped(true);
          setRsvpCount(await getEventRsvpCount(event.id));
        } else {
          setRsvpError(
            result instanceof Error ? result.message : "Failed to RSVP.",
          );
        }
      }
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
    } catch {}
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: event.title,
          url: window.location.href,
        });
      } else {
        await handleCopyLink();
      }
    } catch {}
  };

  const handleDownloadICS = () => {
    const fmt = (d: string) =>
      new Date(d)
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "");
    const esc = (s: string) =>
      s
        .replace(/\\/g, "\\\\")
        .replace(/;/g, "\\;")
        .replace(/,/g, "\\,")
        .replace(/\n/g, "\\n");

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
    ]
      .filter(Boolean)
      .join("\r\n");

    const blob = new Blob([lines], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}.ics`;
    a.click();
    URL.revokeObjectURL(url);
    setCalendarDialogOpen(false);
  };

  const handleSubmitReview = () => {
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
      if (
        result &&
        typeof result === "object" &&
        "id" in result &&
        "event_id" in result
      ) {
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
        setReviewError(
          result instanceof Error ? result.message : "Failed to submit review.",
        );
      }
    });
  };

  const statusConfig: Record<
    Event["status"],
    { label: string; className: string }
  > = {
    UPCOMING: {
      label: "Upcoming",
      className:
        "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
    },
    STARTED: {
      label: "Live",
      className:
        "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
    },
    ENDED: {
      label: "Ended",
      className:
        "bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700",
    },
    CANCELLED: {
      label: "Cancelled",
      className:
        "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
    },
  };

  const { label: statusLabel, className: statusClassName } =
    statusConfig[event.status] ?? statusConfig.ENDED;

  return (
    <>
      <div className="min-h-svh bg-background">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link
            href="/discover"
            className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="size-4" />
            Back to Discover
          </Link>

          {/* Event header */}
          <div className="flex flex-col gap-3 mb-8">
            <Badge variant="outline" className="text-foreground">
              {statusLabel}
            </Badge>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              {event.title}
            </h1>

            {categoryConfig && (
              <Badge
                variant="outline"
                className={cn(
                  "flex items-center gap-1.5 text-sm",
                  categoryConfig.colorClass,
                )}
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
                  {maxCapacity !== null ? ` / ${maxCapacity}` : ""} attending
                </span>
              </div>
            </div>
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
            {/* Left column: about + reviews */}
            <div className="order-2 flex flex-col gap-8 lg:order-1">
              {event.description && (
                <div className="flex flex-col gap-3">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    About this event
                  </p>
                  <p className="text-sm leading-relaxed">{event.description}</p>
                </div>
              )}

              {/* Reviews section */}
              <div className="flex flex-col gap-4">
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
                      <span className="font-medium">
                        {avgRating.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({reviews.length})
                      </span>
                    </div>
                  )}
                </div>

                {reviews.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No reviews yet.
                  </p>
                )}

                {/* AI Summary */}
                {reviews.length > 0 && (
                  <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4">
                    <div className="flex items-center gap-1.5 text-sm font-semibold">
                      <Sparkles className="size-4" />
                      Summary
                    </div>
                    {summaryLoading ? (
                      <div className="flex flex-col gap-2">
                        <div className="h-3 w-full animate-pulse rounded bg-muted-foreground/20" />
                        <div className="h-3 w-5/6 animate-pulse rounded bg-muted-foreground/20" />
                        <div className="h-3 w-4/6 animate-pulse rounded bg-muted-foreground/20" />
                      </div>
                    ) : reviewSummary ? (
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {reviewSummary.split(/\*\*(.+?)\*\*/g).map((part, i) =>
                          i % 2 === 1 ? (
                            <strong
                              key={i}
                              className="font-semibold text-foreground"
                            >
                              {part}
                            </strong>
                          ) : (
                            part
                          ),
                        )}
                      </p>
                    ) : null}
                  </div>
                )}

                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-4"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          {review.avatar_url && (
                            <AvatarImage
                              src={review.avatar_url}
                              alt={review.username ?? ""}
                            />
                          )}
                          <AvatarFallback className="text-xs">
                            {(review.username ?? "?").slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {review.username ?? "Anonymous"}
                        </span>
                      </div>
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {new Date(review.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
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
                      <p className="text-sm leading-relaxed">
                        {review.content}
                      </p>
                    )}
                  </div>
                ))}

                {/* Leave a review form */}
                {!canReview && (
                  <p className="text-sm text-muted-foreground">
                    Reviews can be left once the event has ended.
                  </p>
                )}
                <div
                  className={cn(
                    "flex flex-col gap-3 rounded-lg border border-border p-4",
                    !canReview && "opacity-50 pointer-events-none",
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
                    onChange={(e) => {
                      setReviewContent(e.target.value);
                      setReviewSuccess(false);
                    }}
                  />
                  {reviewError && (
                    <p className="text-sm text-destructive">{reviewError}</p>
                  )}
                  {reviewSuccess && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Review submitted!
                    </p>
                  )}
                  <Button
                    className="w-full"
                    disabled={reviewPending}
                    onClick={handleSubmitReview}
                  >
                    {reviewPending ? "Submitting..." : "Submit Review"}
                  </Button>
                </div>
              </div>
            </div>

            {/* Right column: RSVP panel + hosted by */}
            <div className="order-1 flex flex-col gap-6 lg:order-2 lg:sticky lg:top-24 lg:self-start">
              {/* RSVP panel */}
              <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Attending
                </p>
                <div
                  className={cn(
                    "flex items-end gap-2 transition-opacity",
                    rsvpPending && "opacity-40",
                  )}
                >
                  <span className="text-4xl font-bold leading-none">
                    {rsvpCount}
                  </span>
                  {maxCapacity !== null && (
                    <span className="pb-1 text-xl leading-none text-muted-foreground">
                      / {maxCapacity}
                    </span>
                  )}
                </div>
                {maxCapacity !== null && (
                  <div
                    className={cn(
                      "flex flex-col gap-1 transition-opacity",
                      rsvpPending && "opacity-40",
                    )}
                  >
                    <Progress
                      value={Math.min(100, (rsvpCount / maxCapacity) * 100)}
                      className="h-1.5"
                    />
                    <p className="text-xs text-muted-foreground">
                      {spotsRemaining === 0
                        ? "Event is full"
                        : `${spotsRemaining} spots remaining`}
                    </p>
                  </div>
                )}
                {rsvpError && (
                  <p className="text-sm text-destructive">{rsvpError}</p>
                )}
                <Button
                  className="w-full"
                  variant={isRsvped ? "secondary" : "default"}
                  disabled={rsvpPending || (isFull && !isRsvped) || isEnded}
                  onClick={handleRsvp}
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
                  <span className="text-sm text-muted-foreground">
                    Share this event
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Add to calendar"
                      onClick={() => setCalendarDialogOpen(true)}
                    >
                      <CalendarPlus className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Copy link"
                      onClick={handleCopyLink}
                    >
                      <Copy className="size-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Share"
                      onClick={handleShare}
                    >
                      <Share2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Hosted by */}
              {organization && (
                <div className="flex flex-col gap-3 rounded-lg border border-border p-5">
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Hosted by
                  </p>
                  <div className="flex items-center gap-3">
                    {organization.avatar_url ? (
                      <Image
                        src={organization.avatar_url}
                        alt=""
                        width={48}
                        height={48}
                        className="size-12 shrink-0 rounded-sm object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-sm bg-muted text-lg font-semibold text-muted-foreground">
                        {organization.name.slice(0, 1).toUpperCase()}
                      </div>
                    )}
                    <span className="font-semibold leading-tight">
                      {organization.name}
                    </span>
                  </div>
                  {organization.description && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">
                      {organization.description}
                    </p>
                  )}
                  <Link
                    href={`/organizations/${organization.id}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    View organization <span aria-hidden="true">→</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={calendarDialogOpen} onOpenChange={setCalendarDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader className="pb-4">
            <DialogTitle>Add to Calendar</DialogTitle>
            <DialogDescription>
              Export this event as an <strong>.ics</strong> file, the standard
              calendar format supported by Apple Calendar, Google Calendar,
              Outlook, and most calendar apps.
            </DialogDescription>
          </DialogHeader>
          <ol className="flex flex-col gap-2 text-sm text-muted-foreground list-decimal pl-4">
            <li>
              Click <strong className="text-foreground">Export .ics</strong>{" "}
              below to download the file.
            </li>
            <li>
              Open the downloaded file, your calendar app will launch
              automatically.
            </li>
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
    </>
  );
}
