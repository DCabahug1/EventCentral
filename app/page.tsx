"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import EventsList from "@/components/discover/EventsList";
import Hero from "@/components/discover/Hero";
import { getEvents } from "@/lib/eventsClient";
import { Event } from "@/lib/types";
import {
  DISCOVER_NEAR_ME_RADIUS_MILES,
  type DiscoverRegionBounds,
} from "@/lib/discoverConstants";

function DiscoverPageContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [input, setInput] = useState("");
  const [locationInput, setLocationInput] = useState("United States");
  const [useUserLocation, setUseUserLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [regionBounds, setRegionBounds] = useState<
    DiscoverRegionBounds | undefined
  >(undefined);

  const eventsListRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(async () => {
    let newEvents: Event[];
    if (useUserLocation && coordinates) {
      newEvents = await getEvents({
        useUserLocation: true,
        coordinates,
        radius: DISCOVER_NEAR_ME_RADIUS_MILES,
      });
    } else if (regionBounds && !useUserLocation) {
      newEvents = await getEvents({ regionBounds });
    } else {
      newEvents = await getEvents();
    }
    setEvents(newEvents);
  }, [useUserLocation, coordinates, regionBounds]);

  useEffect(() => {
    void getEvents().then(setEvents);
  }, []);

  const scrollToEvents = () =>
    eventsListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const handleFindIt = (keyword: string) => {
    setQuery(keyword);
    setActiveCategory("");
    void fetchEvents();
    scrollToEvents();
  };

  const handleCategorySelect = (category: string) => {
    const next = activeCategory === category ? "" : category;
    setActiveCategory(next);
    setQuery("");
    setInput("");
    scrollToEvents();
  };

  const handleLocationInputChange = (value: string) => {
    setLocationInput(value);
    setRegionBounds(undefined);
    setUseUserLocation(false);
    setCoordinates(undefined);
  };

  const handleRegionBounds = (bounds: DiscoverRegionBounds) => {
    setUseUserLocation(false);
    setCoordinates(undefined);
    setRegionBounds(bounds);
  };

  const handleGeolocationSuccess = (
    coords: { lat: number; lng: number },
    label: string,
  ) => {
    setUseUserLocation(true);
    setCoordinates(coords);
    setRegionBounds(undefined);
    setLocationInput(label);
  };

  const handleToggleGeolocationOff = () => {
    setUseUserLocation(false);
    setCoordinates(undefined);
    setRegionBounds(undefined);
    setLocationInput("United States");
  };

  const handleActivateManualLocation = () => {
    setUseUserLocation(false);
    setCoordinates(undefined);
    setRegionBounds(undefined);
  };

  const handleClearSearch = () => {
    setQuery("");
    setInput("");
    setLocationInput("United States");
    setUseUserLocation(false);
    setCoordinates(undefined);
    setRegionBounds(undefined);
    void getEvents().then(setEvents);
  };

  const filteredEvents = activeCategory
    ? events.filter((event) => event.category === activeCategory)
    : query
      ? events.filter((e) => {
          const q = query.toLowerCase();
          return (
            e.title.toLowerCase().includes(q) ||
            (e.address ?? "").toLowerCase().includes(q)
          );
        })
      : events;

  const filtersActive = Boolean(
    query ||
      activeCategory ||
      regionBounds ||
      (useUserLocation && coordinates),
  );

  return (
    <div className="flex flex-col w-full">
      <Hero
        onFindIt={handleFindIt}
        onCategorySelect={handleCategorySelect}
        activeCategory={activeCategory}
        input={input}
        onInputChange={setInput}
        onClearSearch={handleClearSearch}
        locationInput={locationInput}
        onLocationInputChange={handleLocationInputChange}
        useUserLocation={useUserLocation}
        onRegionBounds={handleRegionBounds}
        onGeolocationSuccess={handleGeolocationSuccess}
        onToggleGeolocationOff={handleToggleGeolocationOff}
        onActivateManualLocation={handleActivateManualLocation}
        hasActiveFilters={filtersActive}
      />
      <div ref={eventsListRef}>
        <EventsList
          events={filteredEvents}
          query={query}
          activeCategory={activeCategory}
        />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <DiscoverPageContent />
    </APIProvider>
  );
}
