"use client";

import React, { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import EventItem from "./EventItem";
import { motion } from "motion/react";
import PaginationBar from "@/components/discover/PaginationBar";

const PAGE_SIZE = 8;

function EventList({
  events,
  heading = "Events Across the US",
  subheading,
  selectedEventId,
  onEventSelect,
}: {
  events: Event[];
  heading?: string;
  subheading?: string;
  selectedEventId?: number | null;
  onEventSelect?: (id: number) => void;
}) {
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [events]);

  useEffect(() => {
    if (selectedEventId == null) return;
    const idx = events.findIndex((e) => e.id === selectedEventId);
    if (idx === -1) return;
    const targetPage = Math.floor(idx / PAGE_SIZE) + 1;
    setPage(targetPage);
  }, [selectedEventId, events]);

  const totalPages = Math.max(1, Math.ceil(events.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;
  const pageSlice = events.slice(start, start + PAGE_SIZE);

  return (
    <div className="flex flex-col border-t">
      <div className="p-4 sticky top-0 bg-background z-10 border-b flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 shrink-0 bg-primary" />
            <h2 className="min-w-0 text-2xl font-bold">{heading}</h2>
          </div>
          {subheading && (
            <p className="pl-3 text-sm font-normal text-muted-foreground">
              {subheading}
            </p>
          )}
        </div>
        <span className="shrink-0 text-sm font-normal text-muted-foreground">
          {events.length} {events.length === 1 ? "event" : "events"}
        </span>
      </div>
      <div className="flex flex-col">
        {pageSlice.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <EventItem
              event={event}
              selected={event.id === selectedEventId}
              onSelect={onEventSelect}
            />
          </motion.div>
        ))}
      </div>
      <div className="px-4 py-3">
        <PaginationBar
          label="Events"
          page={safePage}
          totalPages={totalPages}
          totalItems={events.length}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}

export default EventList;
