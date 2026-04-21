"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-4/5 max-w-xs" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-2 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

export default function ProfileSkeleton() {
  return (
    <main className="min-h-svh p-4 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="size-20 shrink-0 rounded-full border border-border" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 shrink-0" />
          </div>
        </Card>
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
