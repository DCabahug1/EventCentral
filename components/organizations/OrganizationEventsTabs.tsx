"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaginationBar from "@/components/discover/PaginationBar";
import EventCard from "@/components/events/EventCard";
import ListEmptyState from "@/components/ui/list-empty-state";
import { ORG_EVENTS_PAGE_SIZE } from "@/lib/organizations/page";
import type { Event, Organization } from "@/lib/types";

type TabValue = "upcoming" | "past" | "cancelled";

type Props = {
  org: Organization;
  upcoming: Event[];
  past: Event[];
  cancelled: Event[];
  upcomingTotal: number;
  pastTotal: number;
  cancelledTotal: number;
  upcomingPage: number;
  pastPage: number;
  cancelledPage: number;
  totalUpcomingPages: number;
  totalPastPages: number;
  totalCancelledPages: number;
  onUpcomingPageChange: (page: number) => void;
  onPastPageChange: (page: number) => void;
  onCancelledPageChange: (page: number) => void;
  isOwner?: boolean;
  onCreateEvent?: () => void;
};

export default function OrganizationEventsTabs({
  org,
  upcoming,
  past,
  cancelled,
  upcomingTotal,
  pastTotal,
  cancelledTotal,
  upcomingPage,
  pastPage,
  cancelledPage,
  totalUpcomingPages,
  totalPastPages,
  totalCancelledPages,
  onUpcomingPageChange,
  onPastPageChange,
  onCancelledPageChange,
  isOwner = false,
  onCreateEvent,
}: Props) {
  const [tab, setTab] = useState<TabValue>("upcoming");
  const tabCount =
    tab === "upcoming"
      ? upcomingTotal
      : tab === "past"
        ? pastTotal
        : cancelledTotal;

  return (
    <section className="flex flex-col gap-4" aria-labelledby="org-events-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" aria-hidden />
          <h2 id="org-events-heading" className="text-2xl font-bold">
            Events
          </h2>
        </div>
        <div className="flex shrink-0 flex-wrap items-center justify-end gap-3">
          <p className="text-sm text-muted-foreground">
            {tabCount} {tabCount === 1 ? "event" : "events"}
          </p>
          {isOwner && onCreateEvent ? (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCreateEvent}
            >
              <Plus className="size-4" />
              Create event
            </Button>
          ) : null}
        </div>
      </div>

      <Tabs
        value={tab}
        onValueChange={(v) => setTab(v as TabValue)}
        className="flex flex-col gap-4"
      >
        <TabsList className="w-full max-w-md sm:w-fit">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="flex flex-col gap-4">
          {upcomingTotal === 0 ? (
            <ListEmptyState message="No upcoming events found." />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {upcoming.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    org={org}
                    variant="organization"
                  />
                ))}
              </div>
              <PaginationBar
                label="Upcoming organization events"
                page={upcomingPage}
                totalPages={totalUpcomingPages}
                totalItems={upcomingTotal}
                pageSize={ORG_EVENTS_PAGE_SIZE}
                onPageChange={onUpcomingPageChange}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="flex flex-col gap-4">
          {pastTotal === 0 ? (
            <ListEmptyState message="No past events found." />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {past.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    org={org}
                    variant="organization"
                  />
                ))}
              </div>
              <PaginationBar
                label="Past organization events"
                page={pastPage}
                totalPages={totalPastPages}
                totalItems={pastTotal}
                pageSize={ORG_EVENTS_PAGE_SIZE}
                onPageChange={onPastPageChange}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="cancelled" className="flex flex-col gap-4">
          {cancelledTotal === 0 ? (
            <ListEmptyState message="No cancelled events found." />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {cancelled.map((ev) => (
                  <EventCard
                    key={ev.id}
                    event={ev}
                    org={org}
                    variant="organization"
                  />
                ))}
              </div>
              <PaginationBar
                label="Cancelled organization events"
                page={cancelledPage}
                totalPages={totalCancelledPages}
                totalItems={cancelledTotal}
                pageSize={ORG_EVENTS_PAGE_SIZE}
                onPageChange={onCancelledPageChange}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
