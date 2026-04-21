"use client";
import Form from "@/components/map-view/Form";
import MapView from "@/components/map-view/Map";
import FiltersDialog from "@/components/map-view/FiltersDialog";
import React, { useRef, useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { todayDateString, daysFromNowDateString } from "@/lib/utils";
import EventList from "@/components/map-view/EventList";
import { getEvents } from "@/lib/eventsClient";
import { APIProvider } from "@vis.gl/react-google-maps";

type MapSearchQuery = {
  keyword: string;
  location: string;
  useUserLocation: boolean;
  coordinates?: { lat: number; lng: number };
  locationValid: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
  regionBounds?: { north: number; south: number; east: number; west: number };
};

const DEFAULT_QUERY: MapSearchQuery = {
  keyword: "",
  location: "",
  useUserLocation: false,
  locationValid: true,
  radius: 10,
  startDate: todayDateString(),
  endDate: daysFromNowDateString(30),
  eventType: "all",
};

function page() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [appliedQuery, setAppliedQuery] = useState<MapSearchQuery>(DEFAULT_QUERY);

  // Map focus state — updated only when the form is submitted.
  const [mapLocation, setMapLocation] = useState("");
  const [mapRadius, setMapRadius] = useState(10);
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [mapLocationValid, setMapLocationValid] = useState(true);
  const [searchUsingUserLocation, setSearchUsingUserLocation] = useState(false);

  // Tracks which event is selected — syncs the map popup and list highlight
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Ref on the map wrapper div used to scroll it into view when a list card is clicked
  const mapRef = useRef<HTMLDivElement>(null);
  // Main scroll container on mobile/tablet (map + list column)
  const contentScrollRef = useRef<HTMLDivElement>(null);

  const appliedKeyword = appliedQuery.keyword.trim();
  const hasKeyword = Boolean(appliedKeyword);
  const hasCategory = appliedQuery.eventType !== "all";
  const categoryLabel = appliedQuery.eventType;
  const eventsHeading = hasKeyword && hasCategory
    ? `Results for "${appliedKeyword}" in ${categoryLabel}`
    : hasKeyword
      ? `Results for "${appliedKeyword}"`
      : hasCategory
        ? `Category: ${categoryLabel}`
        : "All Events";

  const locationSummary = searchUsingUserLocation
    ? mapLocation.trim()
      ? `Within ${mapRadius} mi of ${mapLocation}`
      : `Within ${mapRadius} mi of your location`
    : !mapLocation.trim()
      ? "All locations"
      : `In ${mapLocation}`;

  const dateSummary =
    appliedQuery.startDate === appliedQuery.endDate
      ? `On ${appliedQuery.startDate}`
      : `${appliedQuery.startDate} to ${appliedQuery.endDate}`;
  const eventsSubheading = `${locationSummary} • ${dateSummary}`;

  // Fetches events on form submission. Map focus also updates here (submit-only).
  const fetchEvents = async (formData: MapSearchQuery) => {
    setLoadingEvents(true);
    try {
      const newEvents = await getEvents({
        keyword: formData.keyword,
        startDate: formData.startDate,
        endDate: formData.endDate,
        eventType: formData.eventType,
        useUserLocation: formData.useUserLocation,
        coordinates: formData.coordinates,
        radius: formData.radius,
        regionBounds: formData.regionBounds,
      });
      setEvents(newEvents);
      setMapLocation(formData.location);
      setMapRadius(formData.radius);
      setMapCoordinates(formData.coordinates);
      setMapLocationValid(formData.locationValid);
      setSearchUsingUserLocation(formData.useUserLocation);
      setAppliedQuery(formData);
    } finally {
      setLoadingEvents(false);
    }
  };

  // Called when the user clicks an event card in the list.
  // Scrolls back to the map and sets the selected event so the map pans to it.
  const handleEventSelect = (id: number) => {
    setSelectedEventId(id);
    mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Called from the "View event" button inside a map marker popup.
  // Highlights the event card and scrolls the page down to it.
  const handleScrollToEvent = (id: number) => {
    setSelectedEventId(id);
    const scrollToCard = (remainingTries: number) => {
      const card = document.querySelector(
        `[data-event-id="${id}"]`,
      ) as HTMLElement | null;

      // Card may not exist yet while EventList updates pagination.
      if (!card) {
        if (remainingTries <= 0) return;
        requestAnimationFrame(() => {
          window.setTimeout(() => scrollToCard(remainingTries - 1), 40);
        });
        return;
      }

      const scroller = contentScrollRef.current;
      if (scroller) {
        // Safari is more reliable with explicit scrollTop on nested containers.
        const scrollerRect = scroller.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const targetTop = Math.max(
          0,
          cardRect.top - scrollerRect.top + scroller.scrollTop - 24,
        );
        scroller.scrollTo({ top: targetTop, behavior: "smooth" });
        return;
      }

      card.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    scrollToCard(12);
  };

  // Load an initial set of events on mount using the default form values.
  // No regionBounds — blank location shows all events (no location filter).
  useEffect(() => {
    fetchEvents({
      ...DEFAULT_QUERY,
    });
  }, []);

  return (
    // APIProvider must wrap both the Form and MapView so that useMapsLibrary()
    // hooks inside Form (geocoding) and MapView (geocoding) share the same context
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="h-[calc(100svh-64px)] flex flex-col md:flex-row">
        {/* Side panel — visible on desktop only.
          Contains the full filter form with an inline submit button. */}
        <div className="hidden md:flex flex-col p-4 gap-4 w-80 h-full border-r overflow-y-auto">
          <Form fetchEvents={fetchEvents} appliedQuery={appliedQuery} />
        </div>

        {/* Main content area — map + event list stacked vertically */}
        <div ref={contentScrollRef} className="flex-1 flex flex-col overflow-y-auto relative">
          {/* Mobile filter trigger — floating button in the top-left of the map.
            Opens a dialog with the same form fields. */}
          <div className="absolute top-4 left-4 z-10 md:hidden">
            <FiltersDialog fetchEvents={fetchEvents} appliedQuery={appliedQuery} />
          </div>

          {/* Map wrapper — ref used for scroll-to-map from event list clicks */}
          <div ref={mapRef}>
            <MapView
              location={mapLocation}
              radius={mapRadius}
              coordinates={mapCoordinates}
              locationValid={mapLocationValid}
              events={events}
              selectedEventId={selectedEventId}
              onEventSelect={setSelectedEventId}
              onScrollToEvent={handleScrollToEvent}
            />
          </div>

          <EventList
            events={events}
            heading={eventsHeading}
            subheading={eventsSubheading}
            selectedEventId={selectedEventId}
            onEventSelect={handleEventSelect}
            loading={loadingEvents}
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default page;
