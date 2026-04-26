"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/profiles";
import {
  createOrganization,
  getOrganizationsByUserIdPage,
} from "@/lib/organizations";
import { getAttendingEventsPage } from "@/lib/eventsServer";
import { createClient } from "@/lib/supabase/client";
import { uploadOrganizationAsset, uploadProfileAvatar } from "@/lib/bucketHandler";
import { isOrganization, normalizeWebsite } from "@/lib/organizationPage";
import { formatUsPhoneDisplay, phoneDigitsForTel } from "@/lib/utils";
import { Event, Organization, Profile } from "@/lib/types";
import { PostgrestError } from "@supabase/supabase-js";
import ProfileHeaderCard from "@/components/profile/ProfileHeaderCard";
import OrganizationsSection from "@/components/profile/OrganizationsSection";
import EventsSection from "@/components/profile/EventsSection";
import DeleteAccountDialog from "@/components/profile/DeleteAccountDialog";
import EditProfileDialog from "@/components/profile/EditProfileDialog";
import NewOrganizationDialog from "@/components/organizations/NewOrganizationDialog";

const PROFILE_ORGS_PAGE_SIZE = 4;
const PROFILE_EVENTS_PAGE_SIZE = 6;

type Props = {
  userId: string;
  initialProfile: Profile;
  initialOrganizations: { items: Organization[]; total: number };
  initialUpcoming: { items: Event[]; total: number };
  initialPast: { items: Event[]; total: number };
};

export default function ProfilePageClient({
  userId,
  initialProfile,
  initialOrganizations,
  initialUpcoming,
  initialPast,
}: Props) {
  // Seed state with server fetched data so the first paint is ready.
  const router = useRouter();
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [organizations, setOrganizations] = useState<Organization[]>(
    initialOrganizations.items,
  );
  const [organizationsTotal, setOrganizationsTotal] = useState(
    initialOrganizations.total,
  );
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>(initialUpcoming.items);
  const [pastEvents, setPastEvents] = useState<Event[]>(initialPast.items);
  const [upcomingTotal, setUpcomingTotal] = useState(initialUpcoming.total);
  const [pastTotal, setPastTotal] = useState(initialPast.total);

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

  // Reset the create org dialog every time it closes.
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
    if (!editOpen) return;
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
    // Scroll dialog to the error if submit validation fails.
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

  const totalOrganizationPages = Math.max(
    1,
    Math.ceil(organizationsTotal / PROFILE_ORGS_PAGE_SIZE),
  );
  const totalUpcomingPages = Math.max(
    1,
    Math.ceil(upcomingTotal / PROFILE_EVENTS_PAGE_SIZE),
  );
  const totalPastPages = Math.max(1, Math.ceil(pastTotal / PROFILE_EVENTS_PAGE_SIZE));

  useEffect(() => {
    // Keep org list page in sync with server data.
    void getOrganizationsByUserIdPage(
      userId,
      organizationsPage,
      PROFILE_ORGS_PAGE_SIZE,
    ).then((result) => {
      if (result instanceof PostgrestError) return;
      setOrganizations(result.items);
      setOrganizationsTotal(result.total);
    });
  }, [organizationsPage, userId]);

  useEffect(() => {
    // Load only the selected upcoming page.
    void getAttendingEventsPage(
      userId,
      "upcoming",
      upcomingPage,
      PROFILE_EVENTS_PAGE_SIZE,
    ).then((result) => {
      setUpcomingEvents(result.items);
      setUpcomingTotal(result.total);
    });
  }, [upcomingPage, userId]);

  useEffect(() => {
    // Load only the selected past page.
    void getAttendingEventsPage(
      userId,
      "past",
      pastPage,
      PROFILE_EVENTS_PAGE_SIZE,
    ).then((result) => {
      setPastEvents(result.items);
      setPastTotal(result.total);
    });
  }, [pastPage, userId]);

  const phoneDisplay = formatUsPhoneDisplay(profile.phone_number);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    setSaving(true);
    try {
      let avatarUrl = profile.avatar_url;
      if (avatarFile) avatarUrl = await uploadProfileAvatar(avatarFile, userId);
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
        result instanceof Error
          ? result.message
          : result &&
              typeof result === "object" &&
              "message" in result &&
              typeof (result as { message: unknown }).message === "string"
            ? (result as { message: string }).message
            : "Could not update profile.";
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
      if (!newOrgAvatarFile || !newOrgBannerFile) {
        setNewOrgFormError("Avatar and banner images are required.");
        return;
      }

      let avatarUrl: string | null = null;
      let bannerUrl: string | null = null;

      try {
        avatarUrl = await uploadOrganizationAsset(newOrgAvatarFile, userId, "avatar");
        bannerUrl = await uploadOrganizationAsset(newOrgBannerFile, userId, "banner");
      } catch (uploadErr) {
        setNewOrgFormError(
          uploadErr instanceof Error ? uploadErr.message : "Image upload failed.",
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
        phoneDigitsForTel(newOrgPhone) || null,
        newOrgLocation.trim() || null,
      );

      if (isOrganization(result)) {
        const orgId = typeof result.id === "number" ? result.id : Number(result.id);
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

      if (
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof (result as { message: unknown }).message === "string"
      ) {
        setNewOrgFormError((result as { message: string }).message);
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
            organizationsCount={organizationsTotal}
            organizationsPage={organizationsPage}
            totalOrganizationPages={totalOrganizationPages}
            organizationsPageSize={PROFILE_ORGS_PAGE_SIZE}
            onPageChange={setOrganizationsPage}
            onCreateOrganization={() => setNewOrgOpen(true)}
          />

          <EventsSection
            upcoming={upcomingEvents}
            past={pastEvents}
            upcomingCount={upcomingTotal}
            pastCount={pastTotal}
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
