"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Event, Review } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import { getEventById } from "@/lib/eventsClient";
import { getReviewsByEvent } from "@/lib/reviews";
import { generateReviewSummary } from "@/lib/reviewSummary";

function page() {
  const params = useParams();
  const idParam = params.id;
  const [event, setEvent] = useState<Event | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewSummary, setReviewSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Prevents stale async responses from updating state after unmount/id change.
    let cancelled = false;

    const loadEventDetails = async () => {
      const eventId = Number(idParam);
      if (!Number.isFinite(eventId)) {
        if (!cancelled) {
          setError("Invalid event id");
          setLoading(false);
        }
        return;
      }

      if (!cancelled) {
        setLoading(true);
        setError(null);
      }

      try {
        // Fetch event + reviews in parallel, summary depends on reviews and runs after.
        const [eventResult, reviewsResult] = await Promise.all([
          getEventById(eventId),
          getReviewsByEvent(eventId),
        ]);

        if (eventResult instanceof PostgrestError) {
          if (!cancelled) setError(eventResult.message);
          return;
        }

        if (!eventResult) {
          if (!cancelled) setError("Event not found");
          return;
        }

        if (reviewsResult instanceof PostgrestError) {
          if (!cancelled) setError(reviewsResult.message);
          return;
        }

        const nextEvent = eventResult as Event;
        const nextReviews = (reviewsResult ?? []) as Review[];
        let nextReviewSummary: string | null = null;

        // Skip summary generation when there are no reviews.
        if (nextReviews.length > 0) {
          const summaryResult = await generateReviewSummary(nextReviews);
          if (summaryResult instanceof Error) {
            if (!cancelled) setError(summaryResult.message);
            return;
          }
          nextReviewSummary = summaryResult;
        }

        if (!cancelled) {
          setEvent(nextEvent);
          setReviews(nextReviews);
          setReviewSummary(nextReviewSummary);
        }
      } catch (error) {
        if (!cancelled) {
          setError(error instanceof Error ? error.message : "Failed to load event");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };
    void loadEventDetails();

    return () => {
      // Marks this effect instance as stale.
      cancelled = true;
    };
  }, [idParam]);

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div>{error}</div>
      ) : event ? (
        <div>
          <h1>{event.title}</h1>
          <p>{reviewSummary}</p>
        </div>
      ) : null}
    </div>
  );
}

export default page;
