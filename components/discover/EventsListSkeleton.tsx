"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function EventsListSkeleton() {
  return (
    <div className="flex w-full flex-col items-center gap-10 border-t px-6 py-8">
      <div className="flex w-full max-w-7xl flex-col gap-4">
        <div className="flex w-full flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-4 w-20 shrink-0" />
        </div>

        <div className="w-full">
          <div className="mb-4 flex justify-center lg:justify-start">
            <div className="flex items-center gap-2 rounded-md border border-border p-1">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
            <Skeleton className="h-72 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
