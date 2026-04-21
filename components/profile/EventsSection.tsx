"use client";

import { useState } from "react";
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
  upcomingCount: number;
  pastCount: number;
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
  upcomingCount,
  pastCount,
  upcomingPage,
  totalUpcomingPages,
  pastPage,
  totalPastPages,
  eventsPageSize,
  onUpcomingPageChange,
  onPastPageChange,
}: Props) {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");
  const tabCount = tab === "upcoming" ? upcomingCount : pastCount;

  return (
    <motion.section
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" />
          <h2 className="text-2xl font-bold">Events</h2>
        </div>
        <p className="shrink-0 text-sm text-muted-foreground">
          {tabCount} {tabCount === 1 ? "event" : "events"}
        </p>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as "upcoming" | "past")}
        className="flex flex-col gap-4"
      >
        <TabsList>
          <TabsTrigger value="upcoming">Attending</TabsTrigger>
          <TabsTrigger value="past">Previously Attended</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="flex flex-col gap-4">
          {upcomingCount === 0 ? (
            <EmptyState
              message="No upcoming events found."
              action={
                <Button asChild size="sm">
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
                {upcoming.map((event, index) => (
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
                totalItems={upcomingCount}
                pageSize={eventsPageSize}
                onPageChange={onUpcomingPageChange}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="flex flex-col gap-4">
          {pastCount === 0 ? (
            <EmptyState
              message="No past events found."
              action={
                <Button asChild size="sm">
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
                {past.map((event, index) => (
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
                totalItems={pastCount}
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
