import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

function ReviewCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Skeleton className="size-8 shrink-0 rounded-none" />
          <Skeleton className="h-4 w-28 rounded-none" />
        </div>
        <Skeleton className="h-3 w-24 shrink-0 rounded-none" />
      </div>
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="size-4 rounded-none" />
        ))}
      </div>
      <Skeleton className="h-4 w-full rounded-none" />
      <Skeleton className="h-4 w-4/5 rounded-none" />
    </div>
  );
}

export default function EventPageSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* Back link */}
        <div className="mb-6 flex items-center gap-1">
          <Skeleton className="size-4 shrink-0 rounded-none" />
          <Skeleton className="h-4 w-28 rounded-none" />
        </div>

        {/* Header — mobile image */}
        <Skeleton className="mb-6 aspect-video w-full rounded-none lg:hidden" />

        {/* Header — 2-col on desktop */}
        <div className="mb-8 grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-start">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-4 w-16 rounded-none" />
            <Skeleton className="h-9 w-full max-w-sm rounded-none" />
            <Skeleton className="h-6 w-24 rounded-none" />
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-none" />
                <Skeleton className="h-4 w-40 rounded-none" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-none" />
                <Skeleton className="h-4 w-48 rounded-none" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-none" />
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
            </div>
          </div>
          <Skeleton className="hidden aspect-video w-full rounded-none lg:block" />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_300px]">
          {/* Left column */}
          <div className="order-2 flex flex-col gap-8 lg:order-1">
            {/* Description */}
            <div className="flex flex-col gap-3">
              <Skeleton className="h-3 w-28 rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-3/5 rounded-none" />
            </div>

            {/* Reviews section */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-1 shrink-0 rounded-none" />
                <Skeleton className="h-6 w-20 rounded-none" />
              </div>

              {/* AI summary placeholder */}
              <div className="flex flex-col gap-2 rounded-lg border border-border bg-muted/40 p-4">
                <div className="flex items-center gap-1.5">
                  <Skeleton className="size-4 rounded-none" />
                  <Skeleton className="h-4 w-16 rounded-none" />
                </div>
                <Skeleton className="h-3 w-full rounded-none" />
                <Skeleton className="h-3 w-5/6 rounded-none" />
                <Skeleton className="h-3 w-4/6 rounded-none" />
              </div>

              <ReviewCardSkeleton />
              <ReviewCardSkeleton />
            </div>
          </div>

          {/* Right column */}
          <div className="order-1 flex flex-col gap-6 lg:order-2">
            {/* RSVP panel */}
            <div className="flex flex-col gap-4 rounded-lg border border-border p-5">
              <Skeleton className="h-3 w-20 rounded-none" />
              <Skeleton className="h-10 w-16 rounded-none" />
              <Skeleton className="h-1.5 w-full rounded-none" />
              <Skeleton className="h-9 w-full rounded-none" />
              <Separator />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-28 rounded-none" />
                <div className="flex gap-2">
                  <Skeleton className="size-9 rounded-none" />
                  <Skeleton className="size-9 rounded-none" />
                  <Skeleton className="size-9 rounded-none" />
                </div>
              </div>
            </div>

            {/* Hosted by */}
            <div className="flex flex-col gap-3 rounded-lg border border-border p-5">
              <Skeleton className="h-3 w-16 rounded-none" />
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 shrink-0 rounded-none" />
                <Skeleton className="h-5 w-36 rounded-none" />
              </div>
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-4/5 rounded-none" />
              <Skeleton className="h-4 w-24 rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
