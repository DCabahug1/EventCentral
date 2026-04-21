"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { getProfile, updateProfile } from "@/lib/profiles";
import {
  createOrganization,
  getOrganizationsByUserId,
} from "@/lib/organizations";
import { getAttendingEvents } from "@/lib/eventsServer";
import { getCurrentUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/client";
import { uploadOrganizationAsset, uploadProfileAvatar } from "@/lib/bucketHandler";
import { isOrganization, normalizeWebsite } from "@/lib/organizationPage";
import { formatUsPhoneDisplay, phoneDigitsForTel } from "@/lib/utils";
import { Profile, Organization, Event } from "@/lib/types";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import ProfileSkeleton from "@/components/profile/ProfileSkeleton";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import OrganizationsSection from "@/components/profile/OrganizationsSection";
import EventsSection from "@/components/profile/EventsSection";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import NewOrganizationDialog from "@/components/organizations/NewOrganizationDialog";

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
  const router = useRouter();
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

  const [newOrgOpen, setNewOrgOpen] = useState(false);
  const newOrgAvatarInputId = useId();
  const newOrgBannerInputId = useId();
  const newOrgFormErrorRef = useRef<HTMLDivElement>(null);
  const newOrgFormScrollContainerRef = useRef<HTMLDivElement>(null);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgDescription, setNewOrgDescription] = useState("");
  const [newOrgLocation, setNewOrgLocation] = useState("");
  const [newOrgWebsite, setNewOrgWebsite] = useState("");
  const [newOrgEmail, setNewOrgEmail] = useState("");
  const [newOrgPhone, setNewOrgPhone] = useState("");
  const [newOrgAvatarFile, setNewOrgAvatarFile] = useState<File | null>(null);
  const [newOrgBannerFile, setNewOrgBannerFile] = useState<File | null>(null);
  const [newOrgAvatarPreview, setNewOrgAvatarPreview] = useState<string | null>(
    null,
  );
  const [newOrgBannerPreview, setNewOrgBannerPreview] = useState<string | null>(
    null,
  );
  const [newOrgFormError, setNewOrgFormError] = useState("");
  const [newOrgSaving, setNewOrgSaving] = useState(false);

  const resetNewOrganizationForm = () => {
    setNewOrgName("");
    setNewOrgDescription("");
    setNewOrgLocation("");
    setNewOrgWebsite("");
    setNewOrgEmail("");
    setNewOrgPhone("");
    setNewOrgAvatarFile(null);
    setNewOrgBannerFile(null);
    setNewOrgAvatarPreview(null);
    setNewOrgBannerPreview(null);
    setNewOrgFormError("");
  };

  const handleNewOrgOpenChange = (open: boolean) => {
    setNewOrgOpen(open);
    if (!open) resetNewOrganizationForm();
  };

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

  useEffect(() => {
    if (!newOrgAvatarFile) {
      setNewOrgAvatarPreview(null);
      return;
    }
    const url = URL.createObjectURL(newOrgAvatarFile);
    setNewOrgAvatarPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newOrgAvatarFile]);

  useEffect(() => {
    if (!newOrgBannerFile) {
      setNewOrgBannerPreview(null);
      return;
    }
    const url = URL.createObjectURL(newOrgBannerFile);
    setNewOrgBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [newOrgBannerFile]);

  useEffect(() => {
    if (!newOrgFormError) return;
    const container = newOrgFormScrollContainerRef.current;
    const error = newOrgFormErrorRef.current;
    if (!container || !error) return;
    const errorTop =
      error.getBoundingClientRect().top - container.getBoundingClientRect().top;
    container.scrollBy({ top: errorTop, behavior: "smooth" });
  }, [newOrgFormError]);

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

  const handleCreateOrganization = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewOrgFormError("");
    setNewOrgSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setNewOrgFormError("You must be signed in to create an organization.");
        return;
      }

      if (!newOrgAvatarFile || !newOrgBannerFile) {
        setNewOrgFormError("Avatar and banner images are required.");
        return;
      }

      let avatarUrl: string | null = null;
      let bannerUrl: string | null = null;

      try {
        if (newOrgAvatarFile) {
          avatarUrl = await uploadOrganizationAsset(
            newOrgAvatarFile,
            user.id,
            "avatar",
          );
        }
        if (newOrgBannerFile) {
          bannerUrl = await uploadOrganizationAsset(
            newOrgBannerFile,
            user.id,
            "banner",
          );
        }
      } catch (uploadErr) {
        setNewOrgFormError(
          uploadErr instanceof Error
            ? uploadErr.message
            : "Image upload failed.",
        );
        return;
      }

      const result = await createOrganization(
        newOrgName.trim(),
        newOrgDescription.trim(),
        avatarUrl,
        bannerUrl,
        normalizeWebsite(newOrgWebsite),
        newOrgEmail.trim() || null,
        newOrgPhone.trim() || null,
        newOrgLocation.trim() || null,
      );

      if (isOrganization(result)) {
        const orgId =
          typeof result.id === "number" ? result.id : Number(result.id);
        setNewOrgSaving(false);
        setNewOrgOpen(false);
        resetNewOrganizationForm();
        router.push(`/organizations/${orgId}`);
        return;
      }

      if (
        result &&
        typeof result === "object" &&
        "code" in result &&
        (result as { code?: string }).code === "23505" &&
        typeof (result as { message?: string }).message === "string" &&
        (result as { message: string }).message.includes("organizations_name")
      ) {
        setNewOrgFormError("Name must be unique.");
        return;
      }

      if (result instanceof Error) {
        setNewOrgFormError(result.message || "Could not create organization.");
        return;
      }

      if (
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof (result as { message: unknown }).message === "string"
      ) {
        setNewOrgFormError(
          (result as { message: string }).message ||
            "Could not create organization.",
        );
        return;
      }

      setNewOrgFormError("Could not create organization.");
    } catch {
      setNewOrgFormError("Something went wrong. Try again.");
    } finally {
      setNewOrgSaving(false);
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
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 shrink-0 bg-primary" />
            <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
          </div>

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
            onCreateOrganization={() => setNewOrgOpen(true)}
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
        onOpenChange={setDeleteOpen}
        onConfirm={handleDeleteAccount}
      />

      <EditProfileDialog
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

      <NewOrganizationDialog
        open={newOrgOpen}
        onOpenChange={handleNewOrgOpenChange}
        onSubmit={handleCreateOrganization}
        avatarInputId={newOrgAvatarInputId}
        bannerInputId={newOrgBannerInputId}
        formScrollContainerRef={newOrgFormScrollContainerRef}
        formErrorRef={newOrgFormErrorRef}
        name={newOrgName}
        onNameChange={setNewOrgName}
        description={newOrgDescription}
        onDescriptionChange={setNewOrgDescription}
        location={newOrgLocation}
        onLocationChange={setNewOrgLocation}
        website={newOrgWebsite}
        onWebsiteChange={setNewOrgWebsite}
        email={newOrgEmail}
        onEmailChange={setNewOrgEmail}
        phone={newOrgPhone}
        onPhoneChange={setNewOrgPhone}
        avatarPreview={newOrgAvatarPreview}
        bannerPreview={newOrgBannerPreview}
        onAvatarFileChange={setNewOrgAvatarFile}
        onBannerFileChange={setNewOrgBannerFile}
        formError={newOrgFormError}
        saving={newOrgSaving}
      />
    </>
  );
}
