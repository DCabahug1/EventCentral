import React from "react";
import { Event } from "@/lib/types";
import EventItem from "./EventItem";
import { Badge } from "../ui/badge";
import { motion } from "motion/react";

function EventList({
  events,
  heading = "Events Across the US",
  selectedEventId,
  onEventSelect,
}: {
  events: Event[];
  heading?: string;
  selectedEventId?: number | null;
  onEventSelect?: (id: number) => void;
}) {
  return (
    <div className="flex flex-col border-t">
      {/* Header — dynamic title reflects current location context + live event count */}
      <div className="p-4 sticky top-0 bg-background z-10 border-b flex items-center gap-3">
        <h2 className="text-2xl font-bold">{heading}</h2>
        <Badge variant="default" className="shrink-0">
          {events.length} {events.length === 1 ? "event" : "events"}
        </Badge>
      </div>
      <div className="flex flex-col">
        {events.map((event) => (
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
    </div>
  );
}

export default EventList;
