import AnalyticsContentSkeleton from "@/components/organizations/analytics/AnalyticsContentSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnalyticsPageSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="flex items-center gap-1">
          <Skeleton className="size-4 shrink-0 rounded-none" />
          <Skeleton className="h-4 w-44 rounded-none" />
        </div>

        {/* Title row + range tabs */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-72 rounded-none" />
            <Skeleton className="h-4 w-48 rounded-none" />
          </div>
          <Skeleton className="h-9 w-64 rounded-none" />
        </div>

        <AnalyticsContentSkeleton />
      </div>
    </div>
  );
}
