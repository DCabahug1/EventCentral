"use client";

import Link from "next/link";
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
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Events</h2>
        <p className="text-sm text-muted-foreground">
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {paginatedUpcoming.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {paginatedPast.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
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
    </section>
  );
}
