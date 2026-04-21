import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/** Mirrors `EventCard` `variant="organization"` (image + body, no extra footer). */
function OrgEventCardSkeleton() {
  return (
    <Card className="h-full w-full gap-0 overflow-hidden p-0 shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <div className="flex flex-col gap-1">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-4/5 max-w-xs" />
        </div>
        <Skeleton className="h-6 w-28 rounded-full" />
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 w-40" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
    </Card>
  );
}

export default function OrganizationPageSkeleton() {
  return (
    <div className="min-h-svh overflow-x-hidden bg-muted/30">
      {/* Matches OrganizationBanner: full-bleed + responsive height */}
      <div className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 border-b border-border bg-muted">
        <div className="relative w-full sm:h-64 md:h-72 lg:h-80">
          <Skeleton className="absolute inset-0 size-full rounded-none" />
        </div>
      </div>

      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        {/* OrganizationBackLink */}
        <div className="inline-flex w-fit items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-5 w-36" />
        </div>

        {/* OrganizationProfileHeader */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:gap-8">
          <Skeleton className="size-40 shrink-0 self-center rounded-sm" />
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
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
              <div className="flex min-w-0 max-w-full items-center gap-2">
                <Skeleton className="size-4 shrink-0 rounded-sm" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-full max-w-2xl" />
              <Skeleton className="h-4 w-full max-w-xl" />
              <Skeleton className="h-4 w-3/5 max-w-lg" />
            </div>
          </div>
        </div>

        <Separator />

        {/* OrganizationEventsTabs */}
        <section className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-full max-w-md" />
          </div>

          <div className="flex w-full max-w-md gap-2 sm:w-fit">
            <Skeleton className="h-9 flex-1 rounded-md sm:w-28" />
            <Skeleton className="h-9 flex-1 rounded-md sm:w-24" />
          </div>

          <div className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
              <OrgEventCardSkeleton />
              <OrgEventCardSkeleton />
              <OrgEventCardSkeleton />
              <OrgEventCardSkeleton />
            </div>
            <nav
              className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4 w-full"
              aria-hidden
            >
              <Skeleton className="h-4 w-48 order-2 sm:order-1" />
              <div className="flex items-center gap-2 order-1 sm:order-2">
                <Skeleton className="h-9 w-18" />
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-9 w-18" />
              </div>
            </nav>
          </div>
        </section>
      </div>
    </div>
  );
}
