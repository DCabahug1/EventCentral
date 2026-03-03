"use client";
import React, { useEffect, useState } from "react";
import { Event, getEvents } from "@/lib/events";
import EventCard from "@/components/event/EventCard";

function page() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const newEvents = await getEvents();
    setEvents(newEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="flex  w-full flex-wrap p-4 gap-4">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}

export default page;
