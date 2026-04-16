"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Mail, MapPin, Phone, Plus, Building2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile } from "@/lib/profiles";
import { getOrganizationsByUserId } from "@/lib/organizations";
import { getAttendingEvents } from "@/lib/eventsServer";
import { getCurrentUser } from "@/lib/user";
import { formatUsPhoneDisplay } from "@/lib/utils";
import { Profile, Organization, Event } from "@/lib/types";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import EventCard from "@/components/events/EventCard";

// ─── helpers ────────────────────────────────────────────────────────────────

function partitionEvents(events: Event[]) {
  const now = new Date();
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    if (new Date(e.end_time) >= now) upcoming.push(e);
    else past.push(e);
  }
  upcoming.sort(
    (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  past.sort(
    (a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );
  return { upcoming, past };
}

// ─── skeleton ────────────────────────────────────────────────────────────────

function EventCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <Skeleton className="h-48 w-full rounded-none" />
      <div className="flex flex-col gap-3 p-4">
        <Skeleton className="h-3 w-28" />
        <Skeleton className="h-7 w-4/5 max-w-xs" />
        <Skeleton className="h-3 w-20" />
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-4 flex-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-4 w-40" />
        </div>
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-svh p-4 sm:p-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <Skeleton className="h-9 w-40" />

        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="size-20 rounded-full shrink-0" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-7 w-40" />
                <Skeleton className="h-4 w-56" />
              </div>
            </div>
            <Skeleton className="h-9 w-28 shrink-0" />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-28 rounded-md" />
            <Skeleton className="h-9 w-28 rounded-md" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}

// ─── org card ────────────────────────────────────────────────────────────────

function OrgCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organizations/${org.id}`} className="group block">
      <Card className="flex items-center gap-4 p-4 transition-colors group-hover:bg-muted/50">
        <div className="relative size-12 shrink-0 overflow-hidden rounded-xl bg-primary/10 flex items-center justify-center">
          {org.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={org.avatar_url}
              alt=""
              className="size-full object-cover"
            />
          ) : (
            <span className="text-lg font-bold text-primary">
              {org.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-semibold leading-tight truncate">{org.name}</p>
          {org.location ? (
            <p className="flex items-center gap-1 text-sm text-muted-foreground truncate">
              <MapPin className="size-3 shrink-0" />
              {org.location}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">Organization</p>
          )}
        </div>
      </Card>
    </Link>
  );
}

// ─── empty state ─────────────────────────────────────────────────────────────

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center flex flex-col items-center gap-4">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);

  useEffect(() => {
    const load = async () => {
      const userResult = await getCurrentUser();

      if (userResult instanceof AuthError || !userResult.user) {
        setLoading(false);
        return;
      }

      const userId = userResult.user.id;

      const [profileResult, orgsResult, eventsResult] = await Promise.all([
        getProfile(userId),
        getOrganizationsByUserId(userId),
        getAttendingEvents(),
      ]);

      if (!(profileResult instanceof PostgrestError) && !(profileResult instanceof AuthError)) {
        setProfile(profileResult);
      }

      if (!(orgsResult instanceof PostgrestError) && orgsResult !== null) {
        setOrganizations(orgsResult);
      }

      setAttendingEvents(eventsResult);
      setLoading(false);
    };

    void load();
  }, []);

  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!profile) {
    return (
      <main className="min-h-svh flex items-center justify-center p-4">
        <p className="text-muted-foreground">Could not load profile.</p>
      </main>
    );
  }

  const { upcoming, past } = partitionEvents(attendingEvents);
  const phoneDisplay = formatUsPhoneDisplay(profile.phone_number);

  return (
    <main className="min-h-svh p-4 sm:p-8">
      <div className="mx-auto max-w-3xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold">My Profile</h1>

        {/* ── header card ── */}
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Avatar className="size-20 shrink-0">
                <AvatarImage src={profile.avatar_url ?? ""} />
                <AvatarFallback className="text-2xl">
                  {profile.username?.charAt(0).toUpperCase() ?? "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-1.5">
                <h2 className="text-2xl font-semibold leading-tight">
                  {profile.username}
                </h2>
                <div className="flex flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
                  {profile.email ? (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Mail className="size-3.5 shrink-0" />
                      {profile.email}
                    </span>
                  ) : null}
                  {phoneDisplay ? (
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="size-3.5 shrink-0" />
                      {phoneDisplay}
                    </span>
                  ) : null}
                </div>
                {profile.description ? (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {profile.description}
                  </p>
                ) : null}
              </div>
            </div>

            <Button variant="outline" className="sm:shrink-0">
              Edit Profile
            </Button>
          </div>
        </Card>

        {/* ── main tabs ── */}
        <Tabs defaultValue="attending">
          <TabsList>
            <TabsTrigger value="attending">
              Attending
              {attendingEvents.length > 0 ? (
                <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {attendingEvents.length}
                </span>
              ) : null}
            </TabsTrigger>
            <TabsTrigger value="organizations">
              Organizations
              {organizations.length > 0 ? (
                <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                  {organizations.length}
                </span>
              ) : null}
            </TabsTrigger>
          </TabsList>

          {/* ── attending tab ── */}
          <TabsContent value="attending" className="mt-4">
            <Tabs defaultValue="upcoming">
              <TabsList className="mb-4">
                <TabsTrigger value="upcoming">
                  Upcoming
                  {upcoming.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                      {upcoming.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="past">
                  Past
                  {past.length > 0 && (
                    <span className="ml-1.5 rounded-full bg-primary/15 px-1.5 py-0.5 text-xs font-medium text-primary">
                      {past.length}
                    </span>
                  )}
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                {upcoming.length === 0 ? (
                  <EmptyState
                    message="You have no upcoming events. Browse Discover to find something!"
                    action={
                      <Button asChild variant="outline" size="sm">
                        <Link href="/">Discover Events</Link>
                      </Button>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {upcoming.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="past">
                {past.length === 0 ? (
                  <EmptyState message="No past events to show." />
                ) : (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {past.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* ── organizations tab ── */}
          <TabsContent value="organizations" className="mt-4">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {organizations.length === 0
                    ? "You haven't created any organizations yet."
                    : `${organizations.length} ${organizations.length === 1 ? "organization" : "organizations"}`}
                </p>
                <Button asChild variant="outline" size="sm">
                  <Link href="/organizations/new">
                    <Plus className="size-4" />
                    New
                  </Link>
                </Button>
              </div>

              {organizations.length === 0 ? (
                <EmptyState
                  message="Create an organization to host events and build a community."
                  action={
                    <Button asChild size="sm">
                      <Link href="/organizations/new">
                        <Building2 className="size-4" />
                        Create Organization
                      </Link>
                    </Button>
                  }
                />
              ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {organizations.map((org) => (
                    <OrgCard key={org.id} org={org} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
