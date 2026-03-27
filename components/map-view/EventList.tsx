import React from "react";
import { Event } from "@/lib/types";
import EventItem from "./EventItem";
import { motion } from "motion/react";

function EventList({
  events,
  selectedEventId,
  onEventSelect,
}: {
  events: Event[];
  selectedEventId?: number | null;
  onEventSelect?: (id: number) => void;
}) {
  return (
    <div className="flex flex-col border-t">
      {/* Header */}
      <div className="p-4 sticky top-0 bg-background z-10 border-b">
        <h2 className="text-2xl font-bold">Events Nearby</h2>
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
