"use client";
import React from "react";
import { Event } from "@/lib/types";
import EventCard from "../events/EventCard";
import { motion, AnimatePresence } from "motion/react";

function EventsList({ events, query }: { events: Event[]; query: string }) {
  const heading = query ? `Results for "${query}"` : "Featured Events";

  return (
    <div className="flex flex-col gap-4 p-4 items-center w-full">
      <div className="text-2xl font-bold lg:text-start text-center w-full max-w-7xl">
        <AnimatePresence mode="wait">
          <motion.span
            key={heading}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="block"
          >
            {heading}
          </motion.span>
        </AnimatePresence>
      </div>
      {events.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-muted-foreground text-sm py-12"
        >
          No events found for &ldquo;{query}&rdquo;.
        </motion.p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
          {events.map((event, index) => (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
                delay: index * 0.08,
              }}
              key={event.id}
            >
              <EventCard event={event} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EventsList;
