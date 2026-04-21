"use client";
import React, { useEffect, useState } from "react";
import { Event } from "@/lib/types";
import EventCard from "../events/EventCard";
import HappeningNowRail from "./HappeningNowRail";
import PaginationBar from "./PaginationBar";
import {
  DISCOVER_NEAR_ME_RADIUS_MILES,
  DISCOVER_PAGE_SIZE_GRID,
  DISCOVER_PAGE_SIZE_HAPPENING,
} from "@/lib/discoverConstants";
import { motion, AnimatePresence } from "motion/react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";

// Partition and sort helpers
const now = () => new Date();

const partitionEvents = (events: Event[]) => {
  const n = now();

  const happening: Event[] = [];
  const upcoming: Event[] = [];
  const past: Event[] = [];

  for (const e of events) {
    const start = new Date(e.start_time);
    const end = new Date(e.end_time);
    if (n < start) upcoming.push(e);
    else if (n <= end) happening.push(e);
    else past.push(e);
  }

  // Ending soonest first
  happening.sort(
    (a, b) => new Date(a.end_time).getTime() - new Date(b.end_time).getTime(),
  );
  // Starting soonest first
  upcoming.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  // Most recently ended first
  past.sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );

  return { happening, upcoming, past };
};

function locationSummaryLine(
  locationInput: string,
  useUserLocation: boolean,
  hasRegionBounds: boolean,
): string {
  if (useUserLocation) {
    const label = locationInput.trim();
    if (!label || label === "Near you") {
      return `Within ${DISCOVER_NEAR_ME_RADIUS_MILES} mi of your location`;
    }
    return `Within ${DISCOVER_NEAR_ME_RADIUS_MILES} mi of ${label}`;
  }
  if (hasRegionBounds) {
    return `In ${locationInput}`;
  }
  return "All locations";
}

// Staggered grid of event cards
function EventGrid({
  events,
  pagination,
}: {
  events: Event[];
  pagination: {
    page: number;
    totalPages: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    label: string;
  };
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full max-w-7xl">
        {events.map((event, index) => (
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
              delay: index * 0.08,
            }}
            key={event.id}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </div>
      <PaginationBar
        label={pagination.label}
        page={pagination.page}
        totalPages={pagination.totalPages}
        totalItems={pagination.totalItems}
        pageSize={pagination.pageSize}
        onPageChange={pagination.onPageChange}
      />
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-muted-foreground text-sm py-12 text-center"
    >
      {message}
    </motion.p>
  );
}

function EventsList({
  events,
  query,
  activeCategory,
  locationInput,
  useUserLocation,
  hasRegionBounds,
}: {
  events: Event[];
  query: string;
  activeCategory: string;
  locationInput: string;
  useUserLocation: boolean;
  hasRegionBounds: boolean;
}) {
  const hasQuery = Boolean(query.trim());
  const hasCategory = Boolean(activeCategory);
  const heading = hasQuery && hasCategory
    ? `Results for "${query}" in ${activeCategory}`
    : hasQuery
      ? `Results for "${query}"`
      : hasCategory
        ? `Category: ${activeCategory}`
        : "All Events";
  const emptyContext = hasQuery && hasCategory
    ? `"${query}" in "${activeCategory}"`
    : hasQuery
      ? `"${query}"`
      : hasCategory
        ? `"${activeCategory}"`
        : null;
  const locationLine = locationSummaryLine(
    locationInput,
    useUserLocation,
    hasRegionBounds,
  );
  const { happening, upcoming, past } = partitionEvents(events);

  const [happeningPage, setHappeningPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

  useEffect(() => {
    setHappeningPage(1);
    setUpcomingPage(1);
    setPastPage(1);
  }, [
    query,
    activeCategory,
    events.length,
    locationInput,
    useUserLocation,
    hasRegionBounds,
  ]);

  const happeningTotalPages = Math.max(
    1,
    Math.ceil(happening.length / DISCOVER_PAGE_SIZE_HAPPENING),
  );
  const happeningSafePage = Math.min(happeningPage, happeningTotalPages);
  const happeningStart = (happeningSafePage - 1) * DISCOVER_PAGE_SIZE_HAPPENING;
  const happeningSlice = happening.slice(
    happeningStart,
    happeningStart + DISCOVER_PAGE_SIZE_HAPPENING,
  );

  useEffect(() => {
    if (happeningPage !== happeningSafePage) {
      setHappeningPage(happeningSafePage);
    }
  }, [happeningPage, happeningSafePage]);

  const upcomingTotalPages = Math.max(
    1,
    Math.ceil(upcoming.length / DISCOVER_PAGE_SIZE_GRID),
  );
  const upcomingSafePage = Math.min(upcomingPage, upcomingTotalPages);
  const upcomingStart = (upcomingSafePage - 1) * DISCOVER_PAGE_SIZE_GRID;
  const upcomingSlice = upcoming.slice(
    upcomingStart,
    upcomingStart + DISCOVER_PAGE_SIZE_GRID,
  );

  useEffect(() => {
    if (upcomingPage !== upcomingSafePage) {
      setUpcomingPage(upcomingSafePage);
    }
  }, [upcomingPage, upcomingSafePage]);

  const pastTotalPages = Math.max(
    1,
    Math.ceil(past.length / DISCOVER_PAGE_SIZE_GRID),
  );
  const pastSafePage = Math.min(pastPage, pastTotalPages);
  const pastStart = (pastSafePage - 1) * DISCOVER_PAGE_SIZE_GRID;
  const pastSlice = past.slice(pastStart, pastStart + DISCOVER_PAGE_SIZE_GRID);

  useEffect(() => {
    if (pastPage !== pastSafePage) {
      setPastPage(pastSafePage);
    }
  }, [pastPage, pastSafePage]);

  return (
    <div className="flex flex-col gap-10 px-6 py-8 items-center w-full border-t">
      {(happening.length > 0 || emptyContext !== null) && (
        <motion.div
          className="w-full flex flex-col items-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
        >
          <HappeningNowRail
            events={happeningSlice}
            totalCount={happening.length}
            emptyContext={emptyContext}
            page={happeningSafePage}
            totalPages={happeningTotalPages}
            pageSize={DISCOVER_PAGE_SIZE_HAPPENING}
            onPageChange={setHappeningPage}
          />
        </motion.div>
      )}

      <div className="flex flex-col gap-4 w-full max-w-7xl items-center">
        <AnimatePresence mode="wait">
          {heading && (
            <motion.div
              key={`${heading}|${locationLine}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="flex w-full flex-wrap items-start justify-between gap-4 text-2xl lg:text-start"
            >
              <div className="flex min-w-0 flex-1 flex-col gap-1 text-left">
                <div className="flex items-center gap-2 justify-start">
                  <div className="h-5 w-1 shrink-0 bg-primary" />
                  <span className="min-w-0 font-bold">{heading}</span>
                </div>
                <p className="pl-3 text-sm font-normal text-muted-foreground">
                  {locationLine}
                </p>
              </div>
              <span className="text-sm font-normal text-muted-foreground shrink-0">
                {upcoming.length + past.length}{" "}
                {upcoming.length + past.length === 1 ? "event" : "events"}
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          className="w-full"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut", delay: 0.1 }}
        >
          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="lg:self-start self-center">
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming" className="mt-4">
              {upcoming.length === 0 ? (
                <EmptyState
                  message={
                    emptyContext
                      ? `No upcoming events match ${emptyContext}.`
                      : "No upcoming events scheduled."
                  }
                />
              ) : (
                <EventGrid
                  events={upcomingSlice}
                  pagination={{
                    page: upcomingSafePage,
                    totalPages: upcomingTotalPages,
                    totalItems: upcoming.length,
                    pageSize: DISCOVER_PAGE_SIZE_GRID,
                    onPageChange: setUpcomingPage,
                    label: "Upcoming events",
                  }}
                />
              )}
            </TabsContent>

            <TabsContent value="past" className="mt-4">
              {past.length === 0 ? (
                <EmptyState
                  message={
                    emptyContext
                      ? `No past events match ${emptyContext}.`
                      : "No past events to show."
                  }
                />
              ) : (
                <EventGrid
                  events={pastSlice}
                  pagination={{
                    page: pastSafePage,
                    totalPages: pastTotalPages,
                    totalItems: past.length,
                    pageSize: DISCOVER_PAGE_SIZE_GRID,
                    onPageChange: setPastPage,
                    label: "Past events",
                  }}
                />
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}

export default EventsList;
