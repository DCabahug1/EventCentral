"use client";
import React, { useState, useEffect, useRef } from "react";
import EventsList from "@/components/discover/EventsList";
import Hero from "@/components/discover/Hero";
import { getEvents } from "@/lib/events";
import { Event } from "@/lib/types";

function page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const eventsListRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    const newEvents = await getEvents();
    setEvents(newEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSearch = (q: string) => {
    setQuery(q);
    eventsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const filteredEvents = query
    ? events.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.location.toLowerCase().includes(q)
        );
      })
    : events;

  return (
    <div className="flex flex-col w-full">
      <Hero onSearch={handleSearch} />
      <div ref={eventsListRef}>
        <EventsList events={filteredEvents} query={query} />
      </div>
    </div>
  );
}

export default page;
