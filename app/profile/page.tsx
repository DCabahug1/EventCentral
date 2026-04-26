import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profiles";
import { getOrganizationsByUserIdPage } from "@/lib/organizations";
import { getAttendingEventsPage } from "@/lib/eventsServer";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfilePageClient from "./ProfilePageClient";

const PROFILE_ORGS_PAGE_SIZE = 4;
const PROFILE_EVENTS_PAGE_SIZE = 6;

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-svh p-4">
        <p className="text-muted-foreground">Could not load profile.</p>
      </main>
    );
  }

  const [profileResult, orgsResult, upcomingResult, pastResult] = await Promise.all([
    getProfile(user.id),
    getOrganizationsByUserIdPage(user.id, 1, PROFILE_ORGS_PAGE_SIZE),
    getAttendingEventsPage(user.id, "upcoming", 1, PROFILE_EVENTS_PAGE_SIZE),
    getAttendingEventsPage(user.id, "past", 1, PROFILE_EVENTS_PAGE_SIZE),
  ]);

  if (!profileResult || "code" in profileResult) {
    return <ProfileSkeleton />;
  }

  if ("code" in orgsResult) {
    return <ProfileSkeleton />;
  }

  return (
    <ProfilePageClient
      userId={user.id}
      initialProfile={profileResult}
      initialOrganizations={orgsResult}
      initialUpcoming={upcomingResult}
      initialPast={pastResult}
    />
  );
}
