import { Skeleton } from "@/components/ui/skeleton";

function StatCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 border bg-card p-5">
      <Skeleton className="h-3 w-20 rounded-none" />
      <Skeleton className="h-8 w-24 rounded-none" />
      <Skeleton className="h-3 w-28 rounded-none" />
    </div>
  );
}

function SectionCardSkeleton({
  children,
  titleWidth = "w-24",
}: {
  children: React.ReactNode;
  titleWidth?: string;
}) {
  return (
    <div className="flex flex-col border bg-card">
      <div className="flex items-center border-b px-5 py-4">
        <Skeleton className={`h-4 ${titleWidth} rounded-none`} />
      </div>
      <div className="flex flex-col gap-5 p-5">{children}</div>
    </div>
  );
}

function TopEventRowSkeleton() {
  return (
    <div className="flex items-center gap-3 border-b py-2.5 last:border-b-0">
      <Skeleton className="h-3 w-3 shrink-0 rounded-none" />
      <Skeleton className="h-4 flex-1 rounded-none" />
      <Skeleton className="h-1 w-24 max-w-[120px] flex-1 rounded-none" />
      <Skeleton className="h-4 w-9 shrink-0 rounded-none" />
    </div>
  );
}

function RecentReviewSkeleton() {
  return (
    <div className="flex flex-col gap-2 border-b px-4 py-3 last:border-b-0">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Skeleton className="size-6 shrink-0 rounded-none" />
          <Skeleton className="h-4 w-24 rounded-none" />
          <div className="flex gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="size-3.5 rounded-none" />
            ))}
          </div>
        </div>
        <Skeleton className="h-3 w-12 shrink-0 rounded-none" />
      </div>
      <Skeleton className="ml-8 h-3 w-full rounded-none" />
      <Skeleton className="ml-8 h-3 w-4/5 rounded-none" />
      <Skeleton className="ml-8 h-3 w-32 rounded-none" />
    </div>
  );
}

export default function AnalyticsContentSkeleton() {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>

      <div className="flex flex-col gap-5">
        <SectionCardSkeleton titleWidth="w-28">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-44 rounded-none" />
            <Skeleton className="h-40 w-full rounded-none" />
          </div>
          <div className="border-t" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-36 rounded-none" />
            <TopEventRowSkeleton />
            <TopEventRowSkeleton />
            <TopEventRowSkeleton />
          </div>
        </SectionCardSkeleton>

        <SectionCardSkeleton titleWidth="w-20">
          <div className="flex flex-col gap-6 sm:flex-row sm:gap-8">
            <div className="flex shrink-0 flex-col gap-2 sm:min-w-32">
              <Skeleton className="h-12 w-20 rounded-none" />
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="size-3.5 rounded-none" />
                ))}
              </div>
              <Skeleton className="h-3 w-20 rounded-none" />
            </div>
            <div className="hidden w-px self-stretch bg-border sm:block" />
            <div className="flex flex-1 flex-col justify-center gap-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-3 w-2.5 shrink-0 rounded-none" />
                  <Skeleton className="size-2.5 shrink-0 rounded-none" />
                  <Skeleton className="h-1.5 flex-1 rounded-none" />
                  <Skeleton className="h-3 w-7 shrink-0 rounded-none" />
                </div>
              ))}
            </div>
          </div>
          <div className="border-t" />
          <div className="flex flex-col gap-1">
            <Skeleton className="h-3 w-36 rounded-none" />
            <RecentReviewSkeleton />
            <RecentReviewSkeleton />
            <RecentReviewSkeleton />
          </div>
        </SectionCardSkeleton>

        <SectionCardSkeleton titleWidth="w-16">
          <div className="flex flex-col sm:flex-row">
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className={
                  i === 0
                    ? "flex flex-1 flex-col gap-2 px-5 py-4 sm:pl-0"
                    : "flex flex-1 flex-col gap-2 border-t px-5 py-4 sm:border-l sm:border-t-0"
                }
              >
                <Skeleton className="h-3 w-40 rounded-none" />
                <Skeleton className="h-8 w-24 rounded-none" />
                <Skeleton className="h-3 w-56 rounded-none" />
              </div>
            ))}
          </div>
          <div className="border-t" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-3 w-44 rounded-none" />
            <Skeleton className="h-40 w-full rounded-none" />
          </div>
        </SectionCardSkeleton>
      </div>
    </>
  );
}
