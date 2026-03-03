import React from "react";
import { Event } from "@/lib/events";
import { Card } from "../ui/card";
import Image from "next/image";
import { Clock, MapPin, Users } from "lucide-react";
import { Progress } from "../ui/progress";

// Use this to format the date and time of the event
const formatDate = (date: string) => {
  const dateStr = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timeStr = new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  return `${dateStr} at ${timeStr}`;
};

function EventCard({ event }: { event: Event }) {
  // TODO: Implement the event card UI.
  //
  // Guide:
  // - Use the `Card` component as the outer container.
  // - Use the `Image` component to display the event image (`event.image_url`) with a nice aspect ratio.
  // - Show the event title prominently.
  // - Display the start date/time using the `formatDate` helper above.
  // - Include the location and capacity information from the `event` object.
  // - Use the `Clock`, `MapPin`, and `Users` icons next to the corresponding pieces of information.
  // - Show a visual indication of how full the event is using the `Progress` component
  //   (derivable from `event.current_attendees` and `event.max_capacity`).
  // - Refer to the Shadcn-UI documentation for the `Card` and 'Progress' components.

  return (
    <Card>
      {/* Implement the layout and styling for the event card here. */}
    </Card>
  );
}

export default EventCard;
