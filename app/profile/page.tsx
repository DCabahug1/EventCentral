"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
  Plus,
  Building2,
  Pencil,
  Trash2,
  Upload,
  UserRound,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { getProfile, updateProfile } from "@/lib/profiles";
import { getOrganizationsByUserId } from "@/lib/organizations";
import { getAttendingEvents } from "@/lib/eventsServer";
import { getCurrentUser } from "@/lib/user";
import { createClient } from "@/lib/supabase/client";
import { uploadProfileAvatar } from "@/lib/bucketHandler";
import {
  cn,
  formatUsPhoneDisplay,
  formatUsPhoneInput,
  phoneDigitsForTel,
} from "@/lib/utils";
import { Profile, Organization, Event } from "@/lib/types";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import EventCard from "@/components/events/EventCard";

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
        <Skeleton className="h-2 w-full rounded-md" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <main className="min-h-svh p-4 sm:p-8">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <Skeleton className="h-9 w-40" />
        <Card className="p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Skeleton className="size-20 shrink-0 rounded-full" />
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <EventCardSkeleton />
            <EventCardSkeleton />
            <EventCardSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}

function OrgCard({ org }: { org: Organization }) {
  return (
    <Link href={`/organizations/${org.id}`} className="group block">
      <Card className="flex items-center gap-4 p-4 transition-colors group-hover:bg-muted/50">
        <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-primary/10">
          {org.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.avatar_url} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-lg font-bold text-primary">
              {org.name.slice(0, 1).toUpperCase()}
            </span>
          )}
        </div>
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="truncate font-semibold leading-tight">{org.name}</p>
          {org.location ? (
            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
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

function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
      {action}
    </div>
  );
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

  if (loading) return <ProfileSkeleton />;
  if (!profile) {
    return (
      <main className="min-h-svh p-4">
        <p className="text-muted-foreground">Could not load profile.</p>
      </main>
    );
  }

  const { upcoming, past } = partitionEvents(attendingEvents);
  const phoneDisplay = formatUsPhoneDisplay(profile.phone_number);

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
        result instanceof Error ? result.message : result?.message || "Could not update profile.";
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
                  <h2 className="text-2xl font-semibold leading-tight">{profile.username}</h2>
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
                    <p className="line-clamp-2 text-sm text-muted-foreground">
                      {profile.description}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:flex-row">
                <Button type="button" variant="secondary" onClick={() => setEditOpen(true)}>
                  <Pencil className="size-4" />
                  Edit Profile
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="border-destructive/50 text-destructive hover:bg-destructive/10"
                  onClick={() => {
                    setDeleteError("");
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 className="size-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </Card>

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

      {deleteOpen ? (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-profile-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDeleteOpen(false);
          }}
        >
          <Card className="w-full max-w-md border-border shadow-xl">
            <div className="space-y-4 p-6">
              <h2 id="delete-profile-title" className="text-lg font-semibold">
                Delete account?
              </h2>
              <p className="text-sm text-muted-foreground">
                This permanently deletes your EventCentral account and associated profile,
                organizations, and events.
              </p>
              {deleteError ? <p className="text-sm text-destructive">{deleteError}</p> : null}
              <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDeleteOpen(false)}
                  disabled={deleting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                >
                  {deleting ? "Deleting…" : "Delete account"}
                </Button>
              </div>
            </div>
          </Card>
        </div>
      ) : null}

      <Drawer open={editOpen} onOpenChange={setEditOpen}>
        <DrawerContent className="flex max-h-[92vh] min-h-0 flex-col gap-0 overflow-hidden p-0">
          <form onSubmit={handleEditSubmit} className="flex min-h-0 flex-1 flex-col">
            <DrawerHeader className="shrink-0">
              <DrawerTitle>Edit profile</DrawerTitle>
            </DrawerHeader>
            <div
              ref={formScrollContainerRef}
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 [-webkit-overflow-scrolling:touch]"
            >
              <FieldGroup className="gap-5">
                <Field>
                  <FieldLabel htmlFor={avatarInputId} className="text-muted-foreground">
                    Avatar
                  </FieldLabel>
                  <FieldContent className="gap-2">
                    <label
                      htmlFor={avatarInputId}
                      className={cn(
                        "flex size-32 shrink-0 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                      )}
                    >
                      {avatarPreview ? (
                        // eslint-disable-next-line @next/next/no-img-element -- blob preview
                        <img src={avatarPreview} alt="" className="size-full object-cover" />
                      ) : profile.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- existing avatar preview
                        <img src={profile.avatar_url} alt="" className="size-full object-cover" />
                      ) : (
                        <>
                          <Upload className="mb-2 size-5 text-muted-foreground" />
                          <span className="text-center text-xs text-muted-foreground">
                            Square image
                          </span>
                        </>
                      )}
                      <Input
                        id={avatarInputId}
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                      />
                    </label>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-username" className="text-muted-foreground">
                    Username
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <UserRound
                        className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="edit-username"
                        placeholder="Your display name"
                        className="pl-10"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </div>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-description" className="text-muted-foreground">
                    Description
                  </FieldLabel>
                  <FieldContent>
                    <Textarea
                      id="edit-description"
                      className="min-h-24 resize-none"
                      value={description}
                      placeholder="Tell people about yourself..."
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldLabel htmlFor="edit-phone" className="text-muted-foreground">
                    Phone
                  </FieldLabel>
                  <FieldContent>
                    <div className="relative">
                      <Phone
                        className="pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2 text-muted-foreground"
                        aria-hidden
                      />
                      <Input
                        id="edit-phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="Phone"
                        className="pl-10"
                        value={phone}
                        onChange={(e) => setPhone(formatUsPhoneInput(e.target.value))}
                      />
                    </div>
                    {formError ? (
                      <FieldError ref={formErrorRef} id="edit-profile-error" className="mb-4">
                        {formError}
                      </FieldError>
                    ) : null}
                  </FieldContent>
                </Field>
              </FieldGroup>
            </div>
            <DrawerFooter className="shrink-0 border-t bg-background pt-4">
              <div className="flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <DrawerClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
              </div>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>
    </>
  );
}
