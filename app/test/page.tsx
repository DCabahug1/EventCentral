"use client";
import React, { useEffect, useState } from "react";
import { Event, getEvents } from "@/lib/events";
import EventCard from "@/components/event/EventCard";

function page() {
  // TODO: Implement the events page.
  //
  // Hints for the candidate:
  // - Use `useState<Event[]>` to hold the list of events.
  // - Use an `async` function that calls `getEvents()` and updates state.
  // - Trigger that fetch on mount using `useEffect`.
  // - Render the list of events using the `EventCard` component.
  // - Consider a simple layout using flexbox or grid for the cards.

  return (
    <div>
      {/* Render the list of events here using `EventCard`. */}
    </div>
  );
}

export default page;
