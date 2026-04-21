"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import PaginationBar from "@/components/discover/PaginationBar";
import EventCard from "@/components/events/EventCard";
import type { Event } from "@/lib/types";
import EmptyState from "@/components/profile/EmptyState";

type Props = {
  upcoming: Event[];
  past: Event[];
  paginatedUpcoming: Event[];
  paginatedPast: Event[];
  upcomingPage: number;
  totalUpcomingPages: number;
  pastPage: number;
  totalPastPages: number;
  eventsPageSize: number;
  onUpcomingPageChange: (page: number) => void;
  onPastPageChange: (page: number) => void;
};

export default function EventsSection({
  upcoming,
  past,
  paginatedUpcoming,
  paginatedPast,
  upcomingPage,
  totalUpcomingPages,
  pastPage,
  totalPastPages,
  eventsPageSize,
  onUpcomingPageChange,
  onPastPageChange,
}: Props) {
  return (
    <motion.section
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" />
          <h2 className="text-2xl font-bold">Events</h2>
        </div>
        <p className="pl-3 text-sm text-muted-foreground">
        Track your upcoming events and attendance history.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="flex flex-col gap-4">
        <TabsList>
          <TabsTrigger value="upcoming">Attending</TabsTrigger>
          <TabsTrigger value="past">Previously Attended</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="flex flex-col gap-4">
          {upcoming.length === 0 ? (
            <EmptyState
              message="You have no upcoming events."
              action={
                <Button asChild variant="outline" size="sm">
                  <Link href="/">Discover Events</Link>
                </Button>
              }
            />
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {paginatedUpcoming.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
              <PaginationBar
                label="Attending events"
                page={upcomingPage}
                totalPages={totalUpcomingPages}
                totalItems={upcoming.length}
                pageSize={eventsPageSize}
                onPageChange={onUpcomingPageChange}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="flex flex-col gap-4">
          {past.length === 0 ? (
            <EmptyState message="No previously attended events to show." />
          ) : (
            <>
              <motion.div
                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
              >
                {paginatedPast.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.04 }}
                  >
                    <EventCard event={event} />
                  </motion.div>
                ))}
              </motion.div>
              <PaginationBar
                label="Previously attended events"
                page={pastPage}
                totalPages={totalPastPages}
                totalItems={past.length}
                pageSize={eventsPageSize}
                onPageChange={onPastPageChange}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </motion.section>
  );
}
