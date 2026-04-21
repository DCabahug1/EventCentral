import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaginationBar from "@/components/discover/PaginationBar";
import EventCard from "@/components/events/EventCard";
import { ORG_EVENTS_PAGE_SIZE } from "@/lib/organizationPage";
import type { Event, Organization } from "@/lib/types";

type Props = {
  org: Organization;
  upcoming: Event[];
  past: Event[];
  paginatedUpcoming: Event[];
  paginatedPast: Event[];
  upcomingPage: number;
  pastPage: number;
  totalUpcomingPages: number;
  totalPastPages: number;
  onUpcomingPageChange: (page: number) => void;
  onPastPageChange: (page: number) => void;
};

export default function OrganizationEventsTabs({
  org,
  upcoming,
  past,
  paginatedUpcoming,
  paginatedPast,
  upcomingPage,
  pastPage,
  totalUpcomingPages,
  totalPastPages,
  onUpcomingPageChange,
  onPastPageChange,
}: Props) {
  return (
    <section className="flex flex-col gap-4" aria-labelledby="org-events-heading">
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" aria-hidden />
          <h2 id="org-events-heading" className="text-xl font-bold">
            Events
          </h2>
        </div>
        <p className="pl-3 text-sm text-muted-foreground">
          Upcoming and past events from this organization.
        </p>
      </div>

      <Tabs defaultValue="upcoming" className="flex flex-col gap-4">
        <TabsList className="w-full max-w-md sm:w-fit">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="flex flex-col gap-4">
          {upcoming.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No upcoming events scheduled yet.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {paginatedUpcoming.map((ev) => (
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
                totalItems={upcoming.length}
                pageSize={ORG_EVENTS_PAGE_SIZE}
                onPageChange={onUpcomingPageChange}
              />
            </>
          )}
        </TabsContent>

        <TabsContent value="past" className="flex flex-col gap-4">
          {past.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No past events yet.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
                {paginatedPast.map((ev) => (
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
                totalItems={past.length}
                pageSize={ORG_EVENTS_PAGE_SIZE}
                onPageChange={onPastPageChange}
              />
            </>
          )}
        </TabsContent>
      </Tabs>
    </section>
  );
}
