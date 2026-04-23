"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { APIProvider } from "@vis.gl/react-google-maps";
import EventsList from "@/components/discover/EventsList";
import EventsListSkeleton from "@/components/discover/EventsListSkeleton";
import Hero from "@/components/discover/Hero";
import { getEvents } from "@/lib/eventsClient";
import { Event } from "@/lib/types";
import {
  DISCOVER_NEAR_ME_RADIUS_MILES,
  type DiscoverRegionBounds,
} from "@/lib/discoverConstants";

function DiscoverPageContent() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("");
  const [input, setInput] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [useUserLocation, setUseUserLocation] = useState(false);
  const [coordinates, setCoordinates] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [regionBounds, setRegionBounds] = useState<
    DiscoverRegionBounds | undefined
  >(undefined);
  const [draftCategory, setDraftCategory] = useState("");
  const [draftLocationInput, setDraftLocationInput] = useState("");
  const [draftUseUserLocation, setDraftUseUserLocation] = useState(false);
  const [draftCoordinates, setDraftCoordinates] = useState<
    { lat: number; lng: number } | undefined
  >(undefined);
  const [draftRegionBounds, setDraftRegionBounds] = useState<
    DiscoverRegionBounds | undefined
  >(undefined);

  const eventsListRef = useRef<HTMLDivElement>(null);

  const fetchEvents = useCallback(async (filters?: {
    useUserLocation: boolean;
    coordinates: { lat: number; lng: number } | undefined;
    regionBounds: DiscoverRegionBounds | undefined;
  }) => {
    const nextUseUserLocation = filters?.useUserLocation ?? useUserLocation;
    const nextCoordinates = filters?.coordinates ?? coordinates;
    const nextRegionBounds = filters?.regionBounds ?? regionBounds;
    setLoadingEvents(true);
    try {
      let newEvents: Event[];
      if (nextUseUserLocation && nextCoordinates) {
        newEvents = await getEvents({
          useUserLocation: true,
          coordinates: nextCoordinates,
          radius: DISCOVER_NEAR_ME_RADIUS_MILES,
        });
      } else if (nextRegionBounds && !nextUseUserLocation) {
        newEvents = await getEvents({ regionBounds: nextRegionBounds });
      } else {
        newEvents = await getEvents();
      }
      setEvents(newEvents);
    } finally {
      setLoadingEvents(false);
    }
  }, [useUserLocation, coordinates, regionBounds]);

  useEffect(() => {
    void fetchEvents();
  }, [fetchEvents]);

  const scrollToEvents = () =>
    eventsListRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

  const handleFindIt = (keyword: string) => {
    const nextQuery = keyword.trim();
    setInput(nextQuery);
    setQuery(nextQuery);
    setActiveCategory(draftCategory);
    setLocationInput(draftLocationInput);
    setUseUserLocation(draftUseUserLocation);
    setCoordinates(draftCoordinates);
    setRegionBounds(draftRegionBounds);
    void fetchEvents({
      useUserLocation: draftUseUserLocation,
      coordinates: draftCoordinates,
      regionBounds: draftRegionBounds,
    });
    scrollToEvents();
  };

  const handleCategorySelect = (category: string) => {
    const next = draftCategory === category ? "" : category;
    setDraftCategory(next);
  };

  const handleLocationInputChange = (value: string) => {
    setDraftLocationInput(value);
    setDraftRegionBounds(undefined);
    setDraftUseUserLocation(false);
    setDraftCoordinates(undefined);
  };

  const handleRegionBounds = (bounds: DiscoverRegionBounds) => {
    setDraftUseUserLocation(false);
    setDraftCoordinates(undefined);
    setDraftRegionBounds(bounds);
  };

  const handleGeolocationSuccess = (
    coords: { lat: number; lng: number },
    label: string,
  ) => {
    setDraftUseUserLocation(true);
    setDraftCoordinates(coords);
    setDraftRegionBounds(undefined);
    setDraftLocationInput(label);
  };

  const handleToggleGeolocationOff = () => {
    setDraftUseUserLocation(false);
    setDraftCoordinates(undefined);
    setDraftRegionBounds(undefined);
    setDraftLocationInput("");
  };

  const handleActivateManualLocation = () => {
    setDraftUseUserLocation(false);
    setDraftCoordinates(undefined);
    setDraftRegionBounds(undefined);
  };

  const handleClearSearch = () => {
    setInput("");
    setQuery("");
    setActiveCategory("");
    setLocationInput("");
    setUseUserLocation(false);
    setCoordinates(undefined);
    setRegionBounds(undefined);
    setDraftCategory("");
    setDraftLocationInput("");
    setDraftUseUserLocation(false);
    setDraftCoordinates(undefined);
    setDraftRegionBounds(undefined);
    void getEvents().then(setEvents);
  };

  const filteredEvents = events.filter((event) => {
    const matchesCategory =
      !activeCategory || event.category === activeCategory;
    if (!matchesCategory) return false;

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return true;

    return (
      event.title.toLowerCase().includes(normalizedQuery) ||
      (event.address ?? "").toLowerCase().includes(normalizedQuery)
    );
  });

  const hasDraftLocation = Boolean(
    draftLocationInput ||
      draftRegionBounds ||
      (draftUseUserLocation && draftCoordinates),
  );
  const hasAppliedLocation = Boolean(
    locationInput || regionBounds || (useUserLocation && coordinates),
  );
  const draftBoundsKey = draftRegionBounds
    ? `${draftRegionBounds.north}:${draftRegionBounds.south}:${draftRegionBounds.east}:${draftRegionBounds.west}`
    : "";
  const appliedBoundsKey = regionBounds
    ? `${regionBounds.north}:${regionBounds.south}:${regionBounds.east}:${regionBounds.west}`
    : "";
  const draftCoordsKey = draftCoordinates
    ? `${draftCoordinates.lat}:${draftCoordinates.lng}`
    : "";
  const appliedCoordsKey = coordinates
    ? `${coordinates.lat}:${coordinates.lng}`
    : "";
  const filtersActive = Boolean(
    input ||
      draftCategory ||
      hasDraftLocation ||
      query ||
      activeCategory ||
      hasAppliedLocation,
  );

  const canSearch = Boolean(
    input.trim() !== query ||
      draftCategory !== activeCategory ||
      draftLocationInput !== locationInput ||
      draftBoundsKey !== appliedBoundsKey ||
      draftUseUserLocation !== useUserLocation ||
      draftCoordsKey !== appliedCoordsKey,
  );

  return (
    <div className="flex flex-col w-full">
      <Hero
        onFindIt={handleFindIt}
        onCategorySelect={handleCategorySelect}
        activeCategory={draftCategory}
        input={input}
        onInputChange={setInput}
        onClearSearch={handleClearSearch}
        locationInput={draftLocationInput}
        onLocationInputChange={handleLocationInputChange}
        useUserLocation={draftUseUserLocation}
        onRegionBounds={handleRegionBounds}
        onGeolocationSuccess={handleGeolocationSuccess}
        onToggleGeolocationOff={handleToggleGeolocationOff}
        onActivateManualLocation={handleActivateManualLocation}
        hasActiveFilters={filtersActive}
        canSearch={canSearch}
      />
      <div ref={eventsListRef}>
        {loadingEvents && events.length === 0 ? (
          <EventsListSkeleton />
        ) : (
          <EventsList
            events={filteredEvents}
            query={query}
            activeCategory={activeCategory}
            locationInput={locationInput}
            useUserLocation={useUserLocation}
            hasRegionBounds={Boolean(regionBounds)}
          />
        )}
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
