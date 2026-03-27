"use client";
import Form from "@/components/map-view/Form";
import MapView from "@/components/map-view/Map";
import FiltersDrawer from "@/components/map-view/FiltersDrawer";
import React, { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { todayDateString, daysFromNowDateString } from "@/lib/utils";
import EventList from "@/components/map-view/EventList";
import { getEvents } from "@/lib/events";
import { APIProvider } from "@vis.gl/react-google-maps";

function page() {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async (formData: {
    location: string;
    useUserLocation: boolean;
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

  useEffect(() => {
    fetchEvents({
      location: "Northridge, CA",
      useUserLocation: true,
      radius: 10,
      startDate: todayDateString(),
      endDate: daysFromNowDateString(30),
      eventType: "all",
    });
  }, []);

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
    <div className="h-svh flex flex-col md:flex-row">
      {/* Side panel — desktop only */}
      <div className="hidden md:flex flex-col p-4 gap-4 w-80 h-full border-r overflow-y-auto">
        <Form fetchEvents={fetchEvents} />
      </div>
      {/* Map & Event List */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Filters drawer trigger — mobile only */}
        <div className="absolute top-4 left-4 z-10 md:hidden">
          <FiltersDrawer fetchEvents={fetchEvents} />
        </div>
        <MapView eventCount={events.length} />
        <EventList events={events} />
      </div>
    </div>
    </APIProvider>
  );
}

export default page;
