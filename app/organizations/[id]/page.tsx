"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  ExternalLink,
  ImageIcon,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  Upload,
  FileText,
  Building2,
  Link as LinkIcon,
} from "lucide-react";
import { APIProvider } from "@vis.gl/react-google-maps";
import LocationInput from "@/components/map-view/LocationInput";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Skeleton } from "@/components/ui/skeleton";
import {
  cn,
  formatUsPhoneDisplay,
  formatUsPhoneInput,
  phoneDigitsForTel,
} from "@/lib/utils";
import {
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from "@/lib/organizations";
import { getEventsByOrganizationId } from "@/lib/eventsServer";
import { uploadOrganizationAsset } from "@/lib/bucketHandler";
import { createClient } from "@/lib/supabase/client";
import type { Organization, Event } from "@/lib/types";
import EventCard from "@/components/events/EventCard";

function normalizeWebsite(input: string): string | null {
  const t = input.trim();
  if (!t) return null;
  if (!/^https?:\/\//i.test(t)) return `https://${t}`;
  return t;
}

function partitionEvents(events: Event[]) {
  const now = new Date();
  const upcoming: Event[] = [];
  const past: Event[] = [];
  for (const e of events) {
    if (new Date(e.end_time) >= now) upcoming.push(e);
    else past.push(e);
  }
  upcoming.sort(
    (a, b) =>
      new Date(a.start_time).getTime() - new Date(b.start_time).getTime(),
  );
  past.sort(
    (a, b) =>
      new Date(b.start_time).getTime() - new Date(a.start_time).getTime(),
  );
  return { upcoming, past };
}

function isOrganization(value: unknown): value is Organization {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof (value as Organization).id === "number" &&
    "name" in value
  );
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
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-9 w-full rounded-md" />
      </div>
    </div>
  );
}

function OrganizationPageSkeleton() {
  return (
    <div className="min-h-svh bg-background">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="size-4 shrink-0 rounded-sm" />
          <Skeleton className="h-5 w-36" />
        </div>

        <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
          <Skeleton className="aspect-[21/9] w-full rounded-none sm:min-h-[180px]" />
        </div>

        <div className="relative z-10 -mt-12 sm:-mt-14 md:-mt-16">
          <Card className="flex flex-col gap-4 rounded-2xl border-border/80 bg-card/95 shadow-sm backdrop-blur-sm sm:flex-row sm:items-center sm:gap-4 sm:px-6 sm:py-4">
            <Skeleton className="size-24 shrink-0 rounded-2xl border-4 border-background sm:size-28 md:size-32" />
            <CardContent className="w-full flex-1 space-y-4 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <Skeleton className="h-9 w-full max-w-[min(100%,20rem)] sm:h-10" />
                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:items-center sm:justify-end">
                  <Skeleton className="h-9 w-full sm:h-9 sm:w-[148px]" />
                  <Skeleton className="h-9 w-full sm:h-9 sm:w-[76px]" />
                  <Skeleton className="h-9 w-full sm:h-9 sm:w-[92px]" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full max-w-2xl" />
                <Skeleton className="h-4 max-w-xl w-4/5" />
              </div>
              <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-36" />
              </div>
            </CardContent>
          </Card>
        </div>

        <section className="mt-12 space-y-10">
          <div>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <Skeleton className="h-7 w-44" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          </div>
          <div>
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
              <Skeleton className="h-7 w-36" />
              <Skeleton className="h-5 w-20" />
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <EventCardSkeleton />
              <EventCardSkeleton />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default function OrganizationPage() {
  const params = useParams();
  const router = useRouter();
  const idParam = params.id;
  const orgId =
    typeof idParam === "string"
      ? Number(idParam)
      : Array.isArray(idParam)
        ? Number(idParam[0])
        : NaN;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [org, setOrg] = useState<Organization | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isOwner, setIsOwner] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");

  const avatarInputId = useId();
  const bannerInputId = useId();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!Number.isFinite(orgId)) {
      setNotFound(true);
      setLoading(false);
      setOrg(null);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const [rawOrg, eventRows, supabase] = await Promise.all([
        getOrganizationById(orgId),
        getEventsByOrganizationId(orgId),
        createClient(),
      ]);

      if (!rawOrg || !isOrganization(rawOrg)) {
        setNotFound(true);
        setOrg(null);
        setEvents([]);
        setIsOwner(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setOrg(rawOrg);
      setEvents(eventRows);
      setIsOwner(!!user?.id && user.id === rawOrg.user_id);
      setName(rawOrg.name);
      setDescription(rawOrg.description ?? "");
      setLocation(rawOrg.location ?? "");
      setWebsite(rawOrg.website ?? "");
      setEmail(rawOrg.email ?? "");
      setPhone(formatUsPhoneDisplay(rawOrg.phone));

      if (typeof document !== "undefined") {
        document.title = `${rawOrg.name} | EventCentral`;
      }
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    if (!editOpen) return;
    if (!org) return;
    setName(org.name);
    setDescription(org.description ?? "");
    setLocation(org.location ?? "");
    setWebsite(org.website ?? "");
    setEmail(org.email ?? "");
    setPhone(formatUsPhoneDisplay(org.phone));
    setAvatarFile(null);
    setBannerFile(null);
    setAvatarPreview(null);
    setBannerPreview(null);
    setFormError("");
  }, [editOpen, org]);

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
    if (!bannerFile) {
      setBannerPreview(null);
      return;
    }
    const url = URL.createObjectURL(bannerFile);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerFile]);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!org) return;
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

      let avatarUrl = org.avatar_url;
      let bannerUrl = org.banner_url;

      try {
        if (avatarFile) {
          avatarUrl = await uploadOrganizationAsset(
            avatarFile,
            user.id,
            "avatar",
          );
        }
        if (bannerFile) {
          bannerUrl = await uploadOrganizationAsset(
            bannerFile,
            user.id,
            "banner",
          );
        }
      } catch (uploadErr) {
        setFormError(
          uploadErr instanceof Error
            ? uploadErr.message
            : "Image upload failed.",
        );
        return;
      }

      const result = await updateOrganization(
        org.id,
        name.trim(),
        description.trim(),
        avatarUrl,
        bannerUrl,
        normalizeWebsite(website),
        email.trim() || null,
        phone.trim() || null,
        location.trim() || null,
      );

      if (
        result &&
        typeof result === "object" &&
        "id" in result &&
        typeof (result as Organization).id === "number"
      ) {
        const updated = result as Organization;
        setOrg(updated);
        setEditOpen(false);
        if (typeof document !== "undefined") {
          document.title = `${updated.name} | EventCentral`;
        }
        router.refresh();
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
        setFormError("Name must be unique.");
        return;
      }

      const msg =
        result instanceof Error
          ? result.message
          : result &&
              typeof result === "object" &&
              "message" in result &&
              typeof (result as { message: unknown }).message === "string"
            ? (result as { message: string }).message
            : "Could not update organization.";
      setFormError(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!org) return;
    setDeleteError("");
    setDeleting(true);
    try {
      const result = await deleteOrganization(org.id);
      if (result === null) {
        setDeleteOpen(false);
        router.push("/");
        router.refresh();
        return;
      }
      const msg =
        result && typeof result === "object" && "message" in result
          ? String((result as { message: string }).message)
          : "Could not delete organization.";
      setDeleteError(msg);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <OrganizationPageSkeleton />;
  }

  if (notFound || !org) {
    return (
      <div className="min-h-svh flex flex-col items-center justify-center gap-4 bg-background px-4">
        <h1 className="text-xl font-semibold">Organization not found</h1>
        <p className="text-center text-sm text-muted-foreground">
          This organization does not exist or you do not have access.
        </p>
        <Button asChild>
          <Link href="/">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  const { upcoming, past } = partitionEvents(events);
  const foundedYear = new Date(org.created_at).getFullYear();
  const bannerSrc = org.banner_url;
  const avatarSrc = org.avatar_url;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="min-h-svh bg-background">
        <div className="mx-auto max-w-5xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Discover
          </Link>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-muted">
            <div className="relative aspect-[21/9] w-full sm:min-h-[180px]">
              {bannerSrc ? (
                <Image
                  src={bannerSrc}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1024px"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-muted to-muted" />
              )}
            </div>
          </div>

          <div className="relative z-10 -mt-12 sm:-mt-14 md:-mt-16">
            <Card className="flex-1 sm:flex-row items-center gap-4 p-6">
              <div
                className={cn(
                  "relative size-48 sm:size-24 shrink-0 overflow-hidden rounded-2xl border-4 border-background bg-card shadow-lg sm:size-28 md:size-32",
                )}
              >
                {avatarSrc ? (
                  <Image
                    src={avatarSrc}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="128px"
                  />
                ) : (
                  <div className="flex size-full items-center justify-center bg-primary/20 text-2xl font-bold text-primary sm:text-3xl">
                    {org.name.slice(0, 1).toUpperCase()}
                  </div>
                )}
              </div>
              <CardContent className="space-y-4 ">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                      {org.name}
                    </h1>
                  </div>
                  <div className="flex shrink-0 flex-col gap-2 sm:flex-row sm:items-center">
                    {org.website ? (
                      <Button asChild className="w-full sm:w-auto" size="sm">
                        <a
                          href={normalizeWebsite(org.website) ?? org.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="size-4" />
                          Visit website
                        </a>
                      </Button>
                    ) : null}
                    {isOwner ? (
                      <>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="w-full sm:w-auto"
                          onClick={() => setEditOpen(true)}
                        >
                          <Pencil className="size-4" />
                          Edit
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="w-full border-destructive/50 text-destructive hover:bg-destructive/10 sm:w-auto"
                          onClick={() => {
                            setDeleteError("");
                            setDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="size-4" />
                          Delete
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>

                {org.description ? (
                  <p className="text-muted-foreground leading-relaxed">
                    {org.description}
                  </p>
                ) : null}

                <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:flex-wrap sm:gap-x-8 sm:gap-y-2">
                  {org.location ? (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                      <span>{org.location}</span>
                    </div>
                  ) : null}
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="size-4 shrink-0 text-muted-foreground" />
                    <span>Founded {foundedYear}</span>
                  </div>
                  {org.email ? (
                    <a
                      href={`mailto:${org.email}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Mail className="size-4 shrink-0" />
                      {org.email}
                    </a>
                  ) : null}
                  {phoneDigitsForTel(org.phone) ? (
                    <a
                      href={`tel:${phoneDigitsForTel(org.phone)}`}
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Phone className="size-4 shrink-0" />
                      {formatUsPhoneDisplay(org.phone)}
                    </a>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          </div>

          <section className="mt-12 space-y-10">
            <div>
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-xl font-semibold">Upcoming events</h2>
                <span className="text-sm text-muted-foreground">
                  {upcoming.length} {upcoming.length === 1 ? "event" : "events"}
                </span>
              </div>
              {upcoming.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
                  No upcoming events scheduled yet.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {upcoming.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      org={org}
                    />
                  ))}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                <h2 className="text-xl font-semibold">Past events</h2>
                <span className="text-sm text-muted-foreground">
                  {past.length} {past.length === 1 ? "event" : "events"}
                </span>
              </div>
              {past.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-sm text-muted-foreground">
                  No past events yet.
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-2">
                  {past.map((ev) => (
                    <EventCard
                      key={ev.id}
                      event={ev}
                      org={org}
                    />
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>

        {deleteOpen ? (
          <div
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-org-title"
            onClick={(e) => {
              if (e.target === e.currentTarget) setDeleteOpen(false);
            }}
          >
            <Card className="w-full max-w-md border-border shadow-xl">
              <CardContent className="space-y-4 p-6">
                <h2 id="delete-org-title" className="text-lg font-semibold">
                  Delete organization?
                </h2>
                <p className="text-sm text-muted-foreground">
                  This will permanently remove{" "}
                  <span className="font-medium text-foreground">
                    {org.name}
                  </span>
                  . This cannot be undone.
                </p>
                {deleteError ? (
                  <p className="text-sm text-destructive">{deleteError}</p>
                ) : null}
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
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting…" : "Delete organization"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : null}

        <Drawer open={editOpen} onOpenChange={setEditOpen}>
          <DrawerContent className="flex max-h-[92vh] min-h-0 flex-col gap-0 overflow-hidden p-0">
            <form
              onSubmit={handleEditSubmit}
              className="flex min-h-0 flex-1 flex-col"
            >
              <DrawerHeader className="shrink-0">
                <DrawerTitle>Edit organization</DrawerTitle>
              </DrawerHeader>
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-2 [-webkit-overflow-scrolling:touch]">
                {formError ? (
                  <FieldError className="mb-4">{formError}</FieldError>
                ) : null}
                <FieldGroup className="gap-5">
                  <Field>
                    <FieldLabel
                      htmlFor={avatarInputId}
                      className="text-muted-foreground"
                    >
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
                          <img
                            src={avatarPreview}
                            alt=""
                            className="size-full object-cover"
                          />
                        ) : avatarSrc ? (
                          <Image
                            src={avatarSrc}
                            alt=""
                            width={128}
                            height={128}
                            className="size-full object-cover"
                          />
                        ) : (
                          <>
                            <Upload className="text-muted-foreground mb-2 size-5" />
                            <span className="text-muted-foreground text-center text-xs">
                              Square image
                            </span>
                          </>
                        )}
                        <Input
                          id={avatarInputId}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) =>
                            setAvatarFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor={bannerInputId}
                      className="text-muted-foreground"
                    >
                      Banner
                    </FieldLabel>
                    <FieldDescription className="text-xs text-muted-foreground">
                      Wide image recommended.
                    </FieldDescription>
                    <FieldContent className="gap-2">
                      <label
                        htmlFor={bannerInputId}
                        className={cn(
                          "flex h-48 w-full max-w-[600px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-muted-foreground",
                        )}
                      >
                        {bannerPreview ? (
                          // eslint-disable-next-line @next/next/no-img-element -- blob preview
                          <img
                            src={bannerPreview}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        ) : bannerSrc ? (
                          <Image
                            src={bannerSrc}
                            alt=""
                            width={800}
                            height={200}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <>
                            <ImageIcon className="text-muted-foreground mb-2 size-5" />
                            <span className="text-muted-foreground text-sm">
                              Upload banner
                            </span>
                          </>
                        )}
                        <Input
                          id={bannerInputId}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) =>
                            setBannerFile(e.target.files?.[0] ?? null)
                          }
                        />
                      </label>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="edit-name"
                      className="text-muted-foreground"
                    >
                      Organization name{" "}
                      <span className="text-destructive" aria-hidden>
                        *
                      </span>
                    </FieldLabel>
                    <FieldContent>
                      <div className="relative">
                        <Building2
                          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                          aria-hidden
                        />
                        <Input
                          id="edit-name"
                          required
                          className="pl-10"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="edit-description"
                      className="text-muted-foreground"
                    >
                      Description
                    </FieldLabel>
                    <FieldContent>
                      <div className="flex gap-2">
                        <FileText
                          className="text-muted-foreground mt-2.5 size-[18px] shrink-0"
                          aria-hidden
                        />
                        <Textarea
                          id="edit-description"
                          className="min-h-24 resize-none"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </div>
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel
                      htmlFor="edit-location"
                      className="text-muted-foreground"
                    >
                      Location
                    </FieldLabel>
                    <FieldContent>
                      <LocationInput
                        id="edit-location"
                        value={location}
                        onChange={setLocation}
                      />
                    </FieldContent>
                  </Field>

                  <Field>
                    <FieldLabel className="text-muted-foreground">
                      Contact &amp; links
                    </FieldLabel>
                    <FieldContent className="gap-3">
                      <div className="relative">
                        <LinkIcon
                          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                          aria-hidden
                        />
                        <Input
                          id="edit-website"
                          type="url"
                          inputMode="url"
                          placeholder="Website URL"
                          className="pl-10"
                          value={website}
                          onChange={(e) => setWebsite(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Mail
                          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                          aria-hidden
                        />
                        <Input
                          id="edit-email"
                          type="email"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="relative">
                        <Phone
                          className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 size-[18px] -translate-y-1/2"
                          aria-hidden
                        />
                        <Input
                          id="edit-phone"
                          type="tel"
                          inputMode="numeric"
                          autoComplete="tel"
                          className="pl-10"
                          value={phone}
                          onChange={(e) =>
                            setPhone(formatUsPhoneInput(e.target.value))
                          }
                        />
                      </div>
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
      </div>
    </APIProvider>
  );
}
