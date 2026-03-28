"use client";
import React from "react";
import { Event } from "@/lib/types";
import EventCard from "../events/EventCard";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

// Partition and sort helpers
const now = () => new Date();

const partitionEvents = (events: Event[]) => {
  const n = now();

  const happening: Event[] = [];
  const upcoming: Event[] = [];
  const past: Event[] = [];

  for (const e of events) {
    const start = new Date(e.start_time);
    const end = new Date(e.end_time);
    if (n < start) upcoming.push(e);
    else if (n <= end) happening.push(e);
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

// Staggered grid of event cards
function EventGrid({ events }: { events: Event[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
      {events.map((event, index) => (
        <motion.div
          className="flex justify-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: index * 0.08 }}
          key={event.id}
        >
          <EventCard event={event} />
        </motion.div>
      ))}
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-muted-foreground text-sm py-12 text-center"
    >
      {message}
    </motion.p>
  );
}

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
    <div className="flex flex-col gap-4 px-6 py-8 items-center w-full border-t">
      {/* Heading — only shown when a search query is active */}
      <AnimatePresence mode="wait">
        {heading && (
          <motion.div
            key={heading}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="flex items-center gap-2 text-2xl font-bold lg:text-start text-center w-full max-w-7xl"
          >
            {/* Color Line */}
            <div className="h-5 w-1 bg-primary"></div>
            {heading}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className="w-full max-w-7xl"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
      >
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="lg:self-start self-center">
            <TabsTrigger value="happening">
              Happening Now
              {happening.length > 0 && (
                <span className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white">
                  {happening.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>

          <TabsContent value="happening" className="mt-4">
            {happening.length === 0 ? (
              <EmptyState
                message={
                  emptyContext
                    ? `No live events match ${emptyContext}.`
                    : "No events are happening right now."
                }
              />
            ) : (
              <EventGrid events={happening} />
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="mt-4">
            {upcoming.length === 0 ? (
              <EmptyState
                message={
                  emptyContext
                    ? `No upcoming events match ${emptyContext}.`
                    : "No upcoming events scheduled."
                }
              />
            ) : (
              <EventGrid events={upcoming} />
            )}
          </TabsContent>

          <TabsContent value="past" className="mt-4">
            {past.length === 0 ? (
              <EmptyState
                message={
                  emptyContext
                    ? `No past events match ${emptyContext}.`
                    : "No past events to show."
                }
              />
            ) : (
              <EventGrid events={past} />
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
}

export default EventsList;
