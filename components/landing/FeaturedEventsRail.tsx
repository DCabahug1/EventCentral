"use client";
import { motion } from "motion/react";
import { Event } from "@/lib/types";
import EventCard from "@/components/events/EventCard";

export default function FeaturedEventsRail({ events }: { events: Event[] }) {
  if (events.length === 0) return null;

  return (
    <motion.div
      className="mt-14"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px 0px" }}
      transition={{ duration: 0.9, delay: 0.16, ease: [0.2, 0.7, 0.2, 1] }}
    >
      <div className="flex gap-5 overflow-x-auto pb-6 snap-x snap-mandatory [scrollbar-width:thin]">
        {events.map((event) => (
          <div
            key={event.id}
            className="flex-none w-[78%] min-w-[300px] sm:w-[340px] snap-start"
          >
            <EventCard event={event} />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
