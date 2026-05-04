"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import type { ReviewWithProfile } from "@/lib/types";

type Props = {
  reviews: ReviewWithProfile[];
};

export default function EventReviewSummary({ reviews }: Props) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (reviews.length === 0) { setLoading(false); return; }
    setLoading(true);
    fetch("/api/review-summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reviews }),
    })
      .then((res) => res.json())
      .then(({ summary: text }) => {
        if (typeof text === "string") setSummary(text);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4">
      <div className="flex items-center gap-1.5 text-sm font-semibold">
        <Sparkles className="size-4" />
        Summary
      </div>
      {loading ? (
        <div className="flex flex-col gap-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted-foreground/20" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted-foreground/20" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted-foreground/20" />
        </div>
      ) : summary ? (
        <p className="text-sm leading-relaxed text-muted-foreground">
          {summary.split(/\*\*(.+?)\*\*/g).map((part, i) =>
            i % 2 === 1 ? (
              <strong key={i} className="font-semibold text-foreground">
                {part}
              </strong>
            ) : (
              part
            ),
          )}
        </p>
      ) : null}
    </div>
  );
}
