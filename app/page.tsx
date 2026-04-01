"use client";
import React, { useState, useEffect, useRef } from "react";
import EventsList from "@/components/discover/EventsList";
import Hero from "@/components/discover/Hero";
import { getEvents } from "@/lib/events";
import { Event } from "@/lib/types";

function page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [input, setInput] = useState("");
  const eventsListRef = useRef<HTMLDivElement>(null);

  const fetchEvents = async () => {
    const newEvents = await getEvents();
    setEvents(newEvents);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const scrollToEvents = () =>
    eventsListRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const handleSearch = (q: string) => {
    setQuery(q);
    setActiveCategory(""); // category filter and keyword search are mutually exclusive
    scrollToEvents();
  };

  const handleCategorySelect = (category: string) => {
    // Toggle off if already selected
    const next = activeCategory === category ? "" : category;
    setActiveCategory(next);
    setQuery("");
    setInput("");
    scrollToEvents();
  };

  const handleClearSearch = () => {
    setQuery("");
    setInput("");
  };

  const filteredEvents = activeCategory
    ? events.filter((event) => event.category === activeCategory)
    : query
    ? events.filter((e) => {
        const q = query.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          e.address.toLowerCase().includes(q)
        );
      })
    : events;

  return (
    <div className="flex flex-col w-full">
      <Hero
        onSearch={handleSearch}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        query={query}
        input={input}
        onInputChange={setInput}
        onClearSearch={handleClearSearch}
      />
      <div ref={eventsListRef}>
        <EventsList events={filteredEvents} query={query} activeCategory={activeCategory} />
      </div>
    </div>
  );
}

export default page;
