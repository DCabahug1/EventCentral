"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { getProfile, updateProfile } from "@/lib/profiles";
import { getOrganizationsByUserId } from "@/lib/organizations";
import { getAttendingEvents } from "@/lib/eventsServer";
import { getCurrentUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/client";
import { uploadProfileAvatar } from "@/lib/bucketHandler";
import { formatUsPhoneDisplay, phoneDigitsForTel } from "@/lib/utils";
import { Profile, Organization, Event } from "@/lib/types";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import OrganizationsSection from "@/components/profile/OrganizationsSection";
import EventsSection from "@/components/profile/EventsSection";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";
import EditProfileDrawer from "@/components/profile/EditProfileDrawer";

const PROFILE_ORGS_PAGE_SIZE = 4;
const PROFILE_EVENTS_PAGE_SIZE = 8;

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


export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [deleteError, setDeleteError] = useState("");

  const avatarInputId = useId();
  const formErrorRef = useRef<HTMLParagraphElement>(null);
  const formScrollContainerRef = useRef<HTMLDivElement>(null);

  const [username, setUsername] = useState("");
  const [description, setDescription] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [organizationsPage, setOrganizationsPage] = useState(1);
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);

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

  useEffect(() => {
    if (!editOpen || !profile) return;
    setUsername(profile.username ?? "");
    setDescription(profile.description ?? "");
    setPhone(formatUsPhoneDisplay(profile.phone_number));
    setAvatarFile(null);
    setAvatarPreview(null);
    setFormError("");
  }, [editOpen, profile]);

  useEffect(() => {
    if (!avatarFile) {
      setAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(avatarFile);
    setAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [avatarFile]);

  useEffect(() => {
    if (!formError) return;
    const container = formScrollContainerRef.current;
    const error = formErrorRef.current;
    if (!container || !error) return;
    const errorTop =
      error.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollBy({ top: errorTop, behavior: "smooth" });
  }, [formError]);

  const { upcoming, past } = partitionEvents(attendingEvents);

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(organizations.length / PROFILE_ORGS_PAGE_SIZE),
    );
    if (organizationsPage > totalPages) {
      setOrganizationsPage(totalPages);
    }
  }, [organizations.length, organizationsPage]);

  useEffect(() => {
    const totalUpcomingPages = Math.max(
      1,
      Math.ceil(upcoming.length / PROFILE_EVENTS_PAGE_SIZE),
    );
    if (upcomingPage > totalUpcomingPages) {
      setUpcomingPage(totalUpcomingPages);
    }

    const totalPastPages = Math.max(1, Math.ceil(past.length / PROFILE_EVENTS_PAGE_SIZE));
    if (pastPage > totalPastPages) {
      setPastPage(totalPastPages);
    }
  }, [upcoming.length, past.length, upcomingPage, pastPage]);

  if (loading) return <ProfileSkeleton />;
  if (!profile) {
    return (
      <main className="min-h-svh p-4">
        <p className="text-muted-foreground">Could not load profile.</p>
      </main>
    );
  }

  const phoneDisplay = formatUsPhoneDisplay(profile.phone_number);
  const totalOrganizationPages = Math.max(
    1,
    Math.ceil(organizations.length / PROFILE_ORGS_PAGE_SIZE),
  );
  const paginatedOrganizations = organizations.slice(
    (organizationsPage - 1) * PROFILE_ORGS_PAGE_SIZE,
    organizationsPage * PROFILE_ORGS_PAGE_SIZE,
  );
  const totalUpcomingPages = Math.max(
    1,
    Math.ceil(upcoming.length / PROFILE_EVENTS_PAGE_SIZE),
  );
  const paginatedUpcoming = upcoming.slice(
    (upcomingPage - 1) * PROFILE_EVENTS_PAGE_SIZE,
    upcomingPage * PROFILE_EVENTS_PAGE_SIZE,
  );
  const totalPastPages = Math.max(1, Math.ceil(past.length / PROFILE_EVENTS_PAGE_SIZE));
  const paginatedPast = past.slice(
    (pastPage - 1) * PROFILE_EVENTS_PAGE_SIZE,
    pastPage * PROFILE_EVENTS_PAGE_SIZE,
  );

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setFormError("You must be signed in.");
        return;
      }
      let avatarUrl = profile.avatar_url;
      if (avatarFile) avatarUrl = await uploadProfileAvatar(avatarFile, user.id);
      const phoneDigits = phoneDigitsForTel(phone);
      const result = await updateProfile({
        username: username.trim() || null,
        description: description.trim() || null,
        avatar_url: avatarUrl,
        phone_number: phoneDigits ? Number(phoneDigits) : null,
      });
      if (result && !(result instanceof Error) && !(result instanceof PostgrestError)) {
        setProfile(result);
        setEditOpen(false);
        return;
      }
      const message =
        result instanceof Error ? result.message : result && typeof result === "object" && "message" in result && typeof (result as { message: unknown }).message === "string" ? (result as { message: string }).message : "Could not update profile.";
      setFormError(message);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDeleteError("");
    setDeleting(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      const body = (await res.json()) as { error?: string };
      if (!res.ok) {
        setDeleteError(body.error ?? "Could not delete account.");
        return;
      }
      const supabase = createClient();
      await supabase.auth.signOut();
      window.location.href = "/auth/login";
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Could not delete account.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <main className="min-h-svh p-4 sm:p-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-6">
          <h1 className="text-3xl font-bold">My Profile</h1>

          <ProfileHeaderCard
            profile={profile}
            phoneDisplay={phoneDisplay}
            onEdit={() => setEditOpen(true)}
          />

          <OrganizationsSection
            organizations={organizations}
            paginatedOrganizations={paginatedOrganizations}
            organizationsPage={organizationsPage}
            totalOrganizationPages={totalOrganizationPages}
            organizationsPageSize={PROFILE_ORGS_PAGE_SIZE}
            onPageChange={setOrganizationsPage}
          />

          <EventsSection
            upcoming={upcoming}
            past={past}
            paginatedUpcoming={paginatedUpcoming}
            paginatedPast={paginatedPast}
            upcomingPage={upcomingPage}
            totalUpcomingPages={totalUpcomingPages}
            pastPage={pastPage}
            totalPastPages={totalPastPages}
            eventsPageSize={PROFILE_EVENTS_PAGE_SIZE}
            onUpcomingPageChange={setUpcomingPage}
            onPastPageChange={setPastPage}
          />
        </div>
      </main>

      <DeleteAccountDialog
        open={deleteOpen}
        deleting={deleting}
        error={deleteError}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteAccount}
      />

      <EditProfileDrawer
        open={editOpen}
        saving={saving}
        formError={formError}
        username={username}
        description={description}
        phone={phone}
        avatarInputId={avatarInputId}
        avatarPreview={avatarPreview}
        profileAvatarUrl={profile.avatar_url}
        formErrorRef={formErrorRef}
        formScrollContainerRef={formScrollContainerRef}
        onOpenChange={setEditOpen}
        onSubmit={handleEditSubmit}
        onAvatarChange={setAvatarFile}
        onUsernameChange={setUsername}
        onDescriptionChange={setDescription}
        onPhoneChange={setPhone}
        onRequestDelete={() => {
          setEditOpen(false);
          setDeleteError("");
          setDeleteOpen(true);
        }}
      />
    </>
  );
}
