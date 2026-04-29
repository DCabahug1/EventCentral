import Link from "next/link";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import AnalyticsSectionCard from "@/components/organizations/analytics/AnalyticsSectionCard";
import type { ReviewStats } from "@/lib/types";

type Props = {
  data: ReviewStats;
};

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.round(rating);
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            "size-3.5",
            i <= rounded
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/40",
          )}
        />
      ))}
    </div>
  );
}

export default function AnalyticsReviews({ data }: Props) {
  const maxCount = Math.max(...data.ratingDistribution.map((r) => r.count), 1);

  return (
    <AnalyticsSectionCard title="Reviews">
      <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
        <div className="flex shrink-0 flex-col gap-2 sm:min-w-32">
          <div className="text-5xl font-bold leading-none tracking-tight">
            {data.averageRating.toFixed(1)}
          </div>
          <StarRow rating={data.averageRating} />
          <div className="text-xs text-muted-foreground">
            {data.totalReviews.toLocaleString()} reviews
          </div>
        </div>

        <div className="hidden w-px self-stretch bg-border sm:block" />

        <div className="flex flex-1 flex-col justify-center gap-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const entry = data.ratingDistribution.find((r) => r.rating === star);
            const count = entry?.count ?? 0;
            return (
              <div key={star} className="flex items-center gap-2">
                <span className="w-2.5 shrink-0 text-right text-xs text-muted-foreground">
                  {star}
                </span>
                <Star className="size-2.5 shrink-0 fill-muted-foreground text-muted-foreground" />
                <div className="h-1.5 flex-1 bg-muted">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${(count / maxCount) * 100}%`,
                      opacity: star >= 4 ? 1 : 0.6,
                    }}
                  />
                </div>
                <span className="w-7 shrink-0 text-right text-xs text-muted-foreground">
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
          {data.recentReviews.map((review) => {
            const displayName = review.username ?? "anonymous";
            return (
              <li key={review.id} className="border-b last:border-b-0">
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
              </li>
            );
          })}
        </ul>
      </div>
    </AnalyticsSectionCard>
  );
}
