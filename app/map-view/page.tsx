"use client";
import Form from "@/components/map-view/Form";
import MapView from "@/components/map-view/Map";
import FiltersDrawer from "@/components/map-view/FiltersDrawer";
import React, { useRef, useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { todayDateString, daysFromNowDateString } from "@/lib/utils";
import EventList from "@/components/map-view/EventList";
import { getEvents } from "@/lib/events";
import { APIProvider } from "@vis.gl/react-google-maps";

function page() {
  const [events, setEvents] = useState<Event[]>([]);

  // Map focus state — updated only when the form is submitted.
  const [mapLocation, setMapLocation] = useState("United States");
  const [mapRadius, setMapRadius] = useState(10);
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [mapLocationValid, setMapLocationValid] = useState(true);
  const [searchUsingUserLocation, setSearchUsingUserLocation] = useState(false);

  // Tracks which event is selected — syncs the map popup and list highlight
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Ref on the map wrapper div used to scroll it into view when a list card is clicked
  const mapRef = useRef<HTMLDivElement>(null);

  // Derives the event list heading from the current location context
  const eventsHeading = searchUsingUserLocation
    ? "Events Near You"
    : mapLocation === "United States"
    ? "Events Across the US"
    : `Events in ${mapLocation}`;

  // Fetches events on form submission. Map focus also updates here (submit-only).
  const fetchEvents = async (formData: {
    location: string;
    useUserLocation: boolean;
    coordinates?: { lat: number; lng: number };
    locationValid: boolean;
    radius: number;
    startDate: string;
    endDate: string;
    eventType: string;
    regionBounds?: { north: number; south: number; east: number; west: number };
  }) => {
    const newEvents = await getEvents({
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
    const card = document.querySelector(`[data-event-id="${id}"]`);
    card?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Load an initial set of events on mount using the default form values.
  // No regionBounds — the "United States" default shows all events (no location filter).
  useEffect(() => {
    fetchEvents({
      location: "United States",
      useUserLocation: false,
      locationValid: true,
      radius: 10,
      startDate: todayDateString(),
      endDate: daysFromNowDateString(30),
      eventType: "all",
    });
  }, []);

  return (
    // APIProvider must wrap both the Form and MapView so that useMapsLibrary()
    // hooks inside Form (geocoding) and MapView (geocoding) share the same context
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="h-svh flex flex-col md:flex-row">
        {/* Side panel — visible on desktop only.
          Contains the full filter form with an inline submit button. */}
        <div className="hidden md:flex flex-col p-4 gap-4 w-80 h-full border-r overflow-y-auto">
          <Form fetchEvents={fetchEvents} />
        </div>

        {/* Main content area — map + event list stacked vertically */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          {/* Mobile filter trigger — floating button in the top-left of the map.
            Opens a bottom drawer with the same form fields. */}
          <div className="absolute top-4 left-4 z-10 md:hidden">
            <FiltersDrawer fetchEvents={fetchEvents} />
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
            selectedEventId={selectedEventId}
            onEventSelect={handleEventSelect}
          />
        </div>
      </div>
    </APIProvider>
  );
}

export default page;
