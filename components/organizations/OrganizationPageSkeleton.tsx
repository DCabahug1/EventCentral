import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden border border-border bg-card shadow-sm">
      <Skeleton className="h-48 w-full" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-4/5 max-w-xs" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-2 w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export default function OrganizationPageSkeleton() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-muted/30">
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-border bg-muted">
        <Skeleton className="h-40 w-full sm:h-44 md:h-48 lg:h-52" />
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="inline-flex w-fit items-center gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-5 w-36" />
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <Skeleton className="size-40 shrink-0 self-center rounded-sm border border-border" />
          <div className="flex min-w-0 w-full flex-1 flex-col gap-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <Skeleton className="h-10 w-full max-w-[min(100%,24rem)] sm:h-11" />
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:justify-end">
                <Skeleton className="h-9 w-full sm:w-[148px]" />
                <Skeleton className="h-9 w-full sm:w-[76px]" />
              </div>
            </div>
            <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex min-w-0 max-w-full items-start gap-2">
                <Skeleton className="mt-0.5 size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="flex min-w-0 max-w-full items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex min-w-0 max-w-full items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-4/5 max-w-xl" />
            </div>
          </div>
        </div>

        <Separator />

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
            <Skeleton className="h-4 w-48" />
            <div className="flex items-center gap-2">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-9 w-16" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
