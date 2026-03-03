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
  return (
    <Card className="w-72 max-w-md p-4 gap-3 hover:opacity-80 hover:shadow-md transition-all duration-300 cursor-pointer">
      {/* Event Image */}
      <div className="w-full h-48 relative rounded-lg overflow-hidden">
        <Image
          src={event.image_url}
          alt={event.title}
          width={100}
          height={100}
          className="object-cover w-full h-full"
        />
      </div>
      {/* Event Title */}
      <h1 className="text-2xl font-bold">{event.title}</h1>
      {/* Event Details */}
      <div className="flex flex-col gap-2">
        {/* Start Time & Date */}
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" />
          {/* Format time 12 hour format */}
          <span>{formatDate(event.start_date)}</span>
        </div>
        {/* Location */}
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4" />
          <span>{event.location}</span>
        </div>
        {/* Capacity */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span>{event.current_attendees} / {event.capacity} Attendees</span>
        </div>
        {/* Attendees Progress Bar */}
        <Progress value={event.current_attendees / event.capacity * 100} />
      </div>
    </Card>
  );
}

export default EventCard;
