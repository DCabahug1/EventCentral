import { notFound } from "next/navigation";
import { PostgrestError } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/server";
import { getEventById } from "@/lib/eventsServer";
import { getOrganizationById } from "@/lib/organizations";
import { getProfile } from "@/lib/profiles";
import { getReviewsWithProfilesByEvent } from "@/lib/reviews";
import { isOrganization } from "@/lib/organizationPage";
import EventHero from "@/components/events/EventHero";
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

  const [orgResult, reviews] = await Promise.all([
    event.organization_id
      ? getOrganizationById(event.organization_id)
      : Promise.resolve(null),
    getReviewsWithProfilesByEvent(event.id),
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
    <>
      <EventHero imageUrl={event.image_url} title={event.title} />
      <EventPageContent
        event={event}
        organization={organization}
        reviews={reviews}
        initialRsvpStatus={hasRsvp}
        currentUserId={user?.id ?? null}
        currentUserProfile={currentUserProfile}
      />
    </>
  );
}
