"use client";

import React from "react";
import { Event } from "@/lib/types";
import EventCard from "@/components/events/EventCard";
import PaginationBar from "./PaginationBar";

type HappeningNowRailProps = {
  events: Event[];
  totalCount: number;
  emptyContext: string | null;
  page: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (page: number) => void;
};

export default function HappeningNowRail({
  events,
  totalCount,
  emptyContext,
  page,
  totalPages,
  pageSize,
  onPageChange,
}: HappeningNowRailProps) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-7xl">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 bg-primary" />

          <h2 className="text-2xl ">Happening Now</h2>
        </div>
        <span className="text-sm text-muted-foreground">
          {totalCount} {totalCount === 1 ? "event" : "events"}
        </span>
      </div>

      {totalCount === 0 ? 
        <p className="text-muted-foreground text-sm py-8 text-center w-full ">
          {emptyContext
            ? `No live events match ${emptyContext}.`
            : "No events are happening right now."}
        </p>
       : (
        <>
          <div className="flex gap-4 overflow-x-auto py-6 scroll-smooth snap-x snap-mandatory [-webkit-overflow-scrolling:touch]">
            {events.map((event) => (
              <div
                key={event.id}
                className="snap-start shrink-0 w-[min(85vw,28rem)] max-w-full"
              >
                <EventCard event={event} variant="featured" />
              </div>
            ))}
          </div>
          <PaginationBar
            label="Happening Now"
            page={page}
            totalPages={totalPages}
            totalItems={totalCount}
            pageSize={pageSize}
            onPageChange={onPageChange}
          />
        </>
      )}
    </div>
  );
}
