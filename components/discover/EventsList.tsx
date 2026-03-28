"use client";
import React from "react";
import { Event } from "@/lib/types";
import EventCard from "../events/EventCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import EventSet from "../events/EventSet";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

// Partition and sort helpers
const currentTime = () => new Date();

const partitionEvents = (events: Event[]) => {
  const now = currentTime();

  const happening: Event[] = [];
  const upcoming: Event[] = [];
  const past: Event[] = [];

  for (const e of events) {
    const start = new Date(e.start_time);
    const end = new Date(e.end_time);
    if (now < start) upcoming.push(e);
    else if (now <= end) happening.push(e);
    else past.push(e);
  }

  // Ending soonest first
  happening.sort(
    (a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime(),
  );
  // Starting soonest first
  upcoming.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  // Most recently ended first
  past.sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );

  return { happening, upcoming, past };
};

function EventsList({
  events,
  query,
  activeTag,
}: {
  events: Event[];
  query: string;
  activeTag: string;
}) {
  const heading = query
    ? `Results for "${query}"`
    : activeTag
      ? `Tagged: ${activeTag}`
      : "All Events";
  const emptyContext = query
    ? `"${query}"`
    : activeTag
      ? `"${activeTag}"`
      : null;
  const { happening, upcoming, past } = partitionEvents(events);

  return (
    <div className="flex flex-col gap-4 py-6 px-4 items-center w-full border-t">
      {/* Upcoming */}
      <div className="flex flex-col gap-4 w-full">
        {/* Label */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2 ">
            <div className="h-6 w-1 bg-primary" />
            <h2 className="text-2xl font-extrabold">Upcoming</h2>
          </div>
          <Button variant="ghost" size="sm" className="text-primary">
            View All <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
        {/* Event Set */}
        <EventSet events={upcoming.slice(0,5)} />
      </div>
    </div>
  );
}

export default EventsList;
