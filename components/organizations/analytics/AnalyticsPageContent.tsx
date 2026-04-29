"use client";

import { useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import AnalyticsContentSkeleton from "@/components/organizations/analytics/AnalyticsContentSkeleton";
import AnalyticsEngagement from "@/components/organizations/analytics/AnalyticsEngagement";
import AnalyticsReach from "@/components/organizations/analytics/AnalyticsReach";
import AnalyticsReviews from "@/components/organizations/analytics/AnalyticsReviews";
import AnalyticsStatGrid from "@/components/organizations/analytics/AnalyticsStatGrid";
import AnalyticsTimeRange from "@/components/organizations/analytics/AnalyticsTimeRange";
import type {
  AnalyticsRange,
  EngagementStats,
  ReachStats,
  ReviewStats,
} from "@/lib/types";

type Props = {
  orgId: number;
  orgName: string;
  range: AnalyticsRange;
  totalEvents: number;
  engagement: EngagementStats;
  reviews: ReviewStats;
  reach: ReachStats;
};

export default function AnalyticsPageContent({
  orgId,
  orgName,
  range,
  totalEvents,
  engagement,
  reviews,
  reach,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleRangeChange = (next: AnalyticsRange) => {
    if (next === range) return;
    const params = new URLSearchParams();
    params.set("range", next);
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  };

  const totalViews = reach.orgProfileViews + reach.totalEventViews;

  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Link
          href={`/organizations/${orgId}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="size-4" />
          Back to {orgName}
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-bold leading-tight tracking-tight">
              Organization <span className="text-primary">Analytics</span>
            </h1>
            <Link
              href={`/organizations/${orgId}`}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {orgName}
            </Link>
          </div>
          <AnalyticsTimeRange value={range} onValueChange={handleRangeChange} />
        </div>

        {isPending ? (
          <AnalyticsContentSkeleton />
        ) : (
          <>
            <AnalyticsStatGrid
              totalRsvps={engagement.totalConfirmedRsvps}
              avgRating={reviews.averageRating}
              totalReviews={reviews.totalReviews}
              totalViews={totalViews}
              totalEvents={totalEvents}
            />

            <div className="flex flex-col gap-5">
              <AnalyticsEngagement data={engagement} range={range} />
              <AnalyticsReviews data={reviews} />
              <AnalyticsReach data={reach} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
