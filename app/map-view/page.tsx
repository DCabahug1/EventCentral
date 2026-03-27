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

  // Map focus state — updated live on every form change via handleMapFocus,
  // independently of event fetching (which only happens on form submit)
  const [mapLocation, setMapLocation] = useState("Northridge, CA");
  const [mapRadius, setMapRadius] = useState(10);
  const [mapCoordinates, setMapCoordinates] = useState<{ lat: number; lng: number } | undefined>(undefined);
  const [mapLocationValid, setMapLocationValid] = useState(true);

  // Tracks which event is selected — syncs the map popup and list highlight
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);

  // Ref on the map wrapper div used to scroll it into view when a list card is clicked
  const mapRef = useRef<HTMLDivElement>(null);

  // Receives form data changes and keeps map focus state in sync.
  // Called by both the desktop Form and the mobile FiltersDrawer on every change.
  const handleMapFocus = (formData: {
    location: string;
    radius: number;
    coordinates?: { lat: number; lng: number };
    locationValid: boolean;
  }) => {
    setMapLocation(formData.location);
    setMapRadius(formData.radius);
    setMapCoordinates(formData.coordinates);
    setMapLocationValid(formData.locationValid);
  };

  // Fetches events from the API on form submission.
  // Map focus is handled separately by handleMapFocus — no overlap here.
  const fetchEvents = async (formData: {
    location: string;
    useUserLocation: boolean;
    coordinates?: { lat: number; lng: number };
    locationValid: boolean;
    radius: number;
    startDate: string;
    endDate: string;
    eventType: string;
  }) => {
    // TODO: Fetch events from the API
    console.log(formData);
    const newEvents = await getEvents();
    setEvents(newEvents);
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

  // Load an initial set of events on mount using the default form values
  useEffect(() => {
    fetchEvents({
      location: "Northridge, CA",
      useUserLocation: true,
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
        <Form fetchEvents={fetchEvents} onFormDataChange={handleMapFocus} />
      </div>

      {/* Main content area — map + event list stacked vertically */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">

        {/* Mobile filter trigger — floating button in the top-left of the map.
            Opens a bottom drawer with the same form fields. */}
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <FiltersDrawer fetchEvents={fetchEvents} onFormDataChange={handleMapFocus} />
        </div>

        {/* Map wrapper — ref used for scroll-to-map from event list clicks */}
        <div ref={mapRef}>
          <MapView
            eventCount={events.length}
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
          selectedEventId={selectedEventId}
          onEventSelect={handleEventSelect}
        />
      </div>
    </div>
    </APIProvider>
  );
}

export default page;
