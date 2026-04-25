import { notFound } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";
import EventPageMapsProvider from "@/components/events/EventPageMapsProvider";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/eventsServer";
import { getOrganizationById } from "@/lib/organizations";
import { getProfile } from "@/lib/profiles";
import { getReviewsWithProfilesByEvent } from "@/lib/reviews";
import { getEventAttendeeAvatars } from "@/lib/rsvp";
import { isOrganization } from "@/lib/organizationPage";
import EventPageContent from "@/components/events/EventPageContent";
import type { Organization } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EventPage({ params }: PageProps) {
  const { id: idParam } = await params;
  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  const supabase = await createClient();

  const [event, { data: { user } }] = await Promise.all([
    getEventById(id),
    supabase.auth.getUser(),
  ]);

  if (!event) notFound();

  const [orgResult, reviews, attendeeAvatars] = await Promise.all([
    event.organization_id
      ? getOrganizationById(event.organization_id)
      : Promise.resolve(null),
    getReviewsWithProfilesByEvent(event.id),
    getEventAttendeeAvatars(event.id, 4),
  ]);

  const organization: Organization | null = isOrganization(orgResult)
    ? orgResult
    : null;

  let hasRsvp = false;
  let currentUserProfile: { username: string | null; avatar_url: string | null } | null =
    null;

  if (user) {
    const [rsvpResponse, profileResult] = await Promise.all([
      supabase
        .from("rsvps")
        .select("id")
        .eq("event_id", event.id)
        .eq("user_id", user.id)
        .eq("status", "CONFIRMED")
        .maybeSingle(),
      getProfile(user.id),
    ]);

    hasRsvp = !!rsvpResponse.data;

    if (profileResult && !(profileResult instanceof PostgrestError)) {
      currentUserProfile = {
        username: profileResult.username,
        avatar_url: profileResult.avatar_url,
      };
    }
  }

  return (
    <EventPageMapsProvider>
      <EventPageContent
        event={event}
        organization={organization}
        reviews={reviews}
        initialRsvpStatus={hasRsvp}
        currentUserId={user?.id ?? null}
        currentUserProfile={currentUserProfile}
        attendeeAvatars={attendeeAvatars}
      />
    </EventPageMapsProvider>
  );
}
