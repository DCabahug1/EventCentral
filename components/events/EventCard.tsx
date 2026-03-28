"use client";
import React, { useState } from "react";
import { Card, CardHeader, CardTitle } from "../ui/card";
import { Event } from "@/lib/types";
import Image from "next/image";
import { MapPin, Calendar, Users } from "lucide-react";
import { Progress } from "../ui/progress";
import { motion } from "motion/react";
import { Badge } from "../ui/badge";
import { getCategoryConfig } from "@/lib/categoryConfig";
import Link from "next/link";

// Formats an ISO date string to a readable "Month Day, Year at HH:MM AM/PM" label
const formatDateTime = (date: string) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Returns a Tailwind color class based on how full the event is
const getProgressColor = (pct: number) => {
  if (pct >= 100) return "bg-red-500";
  if (pct >= 75) return "bg-orange-500";
  return "bg-primary";
};

type EventStatus = "upcoming" | "live" | "ended";

// Derives event status by comparing start/end times against now
const getEventStatus = (start: string, end: string): EventStatus => {
  const now = new Date();
  if (now < new Date(start)) return "upcoming";
  if (now <= new Date(end)) return "live";
  return "ended";
};

// Visual config for each status — controls badge label, styles, and whether to show a pulse dot
const statusConfig: Record<
  EventStatus,
  { label: string; className: string; dot?: boolean }
> = {
  upcoming: {
    label: "Upcoming",
    className: "bg-black/50 text-white border border-white/20",
  },
  live: {
    label: "Live",
    className: "bg-green-500/90 text-white",
    dot: true, // pulsing dot to draw attention to active events
  },
  ended: {
    label: "Ended",
    className: "bg-black/50 text-white/50 border border-white/10",
  },
};

function EventCard({ event }: { event: Event }) {
  // Randomized attendee count used as a stand-in until real registration data exists
  const [attendees, setAttendees] = useState(
    Math.floor(Math.random() * event.max_capacity),
  );
  const pct = (attendees / event.max_capacity) * 100;
  const status = getEventStatus(event.start_time, event.end_time);
  const { label, className, dot } = statusConfig[status];

  // For the hover effect
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div className="w-60 shrink-0">
      <Link href={`/events/${event.id}`}>
        <Card
          className="w-full p-0 gap-0 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image + overlays */}
          <div className="relative overflow-hidden">
            <div
              className={`absolute inset-0 bg-linear-to-t from-black/70 dark:from-background to-transparent z-10 ${isHovered ? "opacity-70" : "opacity-80"} transition-all duration-300`}
            />

            {/* Status badge — positioned over the image in the top-left */}
            <div
              className={`absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-sm ${className}`}
            >
              {dot && (
                // Ping animation only shown for live events
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
                </span>
              )}
              {label}
            </div>

            {/* Image scales up slightly on hover */}
            <motion.div
              whileHover={{ scale: 1.04 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image
                src={event.image_url}
                alt={event.title}
                width={500}
                height={500}
                className="w-full h-40 object-cover"
              />
            </motion.div>
          </div>

          {/* Event details */}
          <div className="flex flex-col gap-2 p-4">
            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {event.tags.map((tag) => {
                const config = getCategoryConfig(tag);
                const Icon = config?.icon;
                return (
                  <Badge key={tag} variant="outline">
                    {Icon && <Icon className={config?.colorClass} />}
                    {tag}
                  </Badge>
                );
              })}
            </div>
            {/* Heading */}
            <div className="flex flex-col gap-1">
              <h2 className="text-sm text-muted-foreground">
                Organization Placeholder
              </h2>
              <h1 className="text-lg font-bold">{event.title}</h1>
            </div>
            <div className="flex gap-2">
              <MapPin className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">{event.location}</p>
            </div>
            <div className="flex gap-2">
              <Calendar className="w-3 h-3 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {formatDateTime(event.start_time)}
              </p>
            </div>
            {/* Capacity bar — color shifts as the event fills up */}
            <Progress value={pct} indicatorClassName={getProgressColor(pct)} />
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

export default EventCard;
