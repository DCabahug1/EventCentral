"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import AnalyticsSectionCard from "@/components/organizations/analytics/AnalyticsSectionCard";
import AnimatedNumber from "@/components/organizations/analytics/AnimatedNumber";
import type { ReviewStats } from "@/lib/types";

type Props = {
  data: ReviewStats;
};

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function StarRow({ rating, animate = false }: { rating: number; animate?: boolean }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= rounded;
        const star = (
          <Star
            className={cn(
              "size-3.5",
              filled
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground/40",
            )}
          />
        );
        if (!animate) return <span key={i}>{star}</span>;
        return (
          <motion.span
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.35,
              delay: 0.3 + i * 0.08,
              ease: [0.2, 0.7, 0.2, 1],
            }}
          >
            {star}
          </motion.span>
        );
      })}
    </div>
  );
}

export default function AnalyticsReviews({ data }: Props) {
  const maxCount = Math.max(...data.ratingDistribution.map((r) => r.count), 1);

  return (
    <AnalyticsSectionCard title="Reviews" delay={0.1}>
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-32">
          <div className="text-5xl font-bold leading-none tracking-tight tabular-nums">
            <AnimatedNumber value={data.averageRating} decimals={1} />
          </div>
          <StarRow rating={data.averageRating} animate />
          <div className="text-xs text-muted-foreground">
            {data.totalReviews.toLocaleString()} reviews
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-border sm:block" />

        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[5, 4, 3, 2, 1].map((star, idx) => {
            const entry = data.ratingDistribution.find((r) => r.rating === star);
            const count = entry?.count ?? 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-2.5 shrink-0 text-right text-xs text-muted-foreground">
                  {star}
                </span>
                <Star className="size-2.5 shrink-0 fill-muted-foreground text-muted-foreground" />
                <div className="h-1.5 flex-1 bg-muted">
                  <motion.div
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${(count / maxCount) * 100}%` }}
                    transition={{
                      duration: 0.8,
                      delay: 0.3 + idx * 0.08,
                      ease: [0.2, 0.7, 0.2, 1],
                    }}
                    style={{ opacity: star >= 4 ? 1 : 0.6 }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-xs text-muted-foreground tabular-nums">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t" />

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Most recent reviews
        </span>
        <ul className="flex flex-col">
          {data.recentReviews.map((review, index) => {
            const displayName = review.username ?? "anonymous";
            return (
              <motion.li
                key={review.id}
                className="border-b last:border-b-0"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.4 + index * 0.07,
                  ease: [0.2, 0.7, 0.2, 1],
                }}
              >
                <Link
                  href={`/events/${review.event_id}`}
                  className="flex flex-col gap-1 py-3 transition-colors hover:bg-muted/40 px-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <Avatar className="size-6">
                        {review.avatar_url && (
                          <AvatarImage src={review.avatar_url} alt={displayName} />
                        )}
                        <AvatarFallback className="text-xs">
                          {displayName.slice(0, 1).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="truncate text-sm font-medium">
                        {displayName}
                      </span>
                      <StarRow rating={review.rating} />
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {monthDayFormatter.format(new Date(review.created_at))}
                    </span>
                  </div>
                  {review.content && (
                    <p className="pl-8 text-sm leading-relaxed text-muted-foreground">
                      {review.content}
                    </p>
                  )}
                  <p className="pl-8 text-xs text-muted-foreground/60">
                    on {review.event_title}
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </ul>
      </div>
    </AnalyticsSectionCard>
  );
}
