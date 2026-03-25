"use client";
import Form from "@/components/map-view/Form";
import MapView from "@/components/map-view/Map";
import React, { useState, useEffect } from "react";
import { Event } from "@/lib/types";
import { todayDateString, daysFromNowDateString } from "@/lib/utils";

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

  }



  return (
    <div className="h-svh flex">
      {/* Sidepanel */}
      <div className="flex flex-col p-4 gap-4 w-80 h-full border-r">
        {/* Content */}
        <Form fetchEvents={fetchEvents} />
      </div>
      {/* Map & Event List */}
      <div className="flex-1 h-full">
        <MapView />
      </div>
    </div>
  );
}

export default page;
