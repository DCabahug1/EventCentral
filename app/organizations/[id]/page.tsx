"use client";

import {
  use,
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import OrganizationBackLink from "@/components/organizations/OrganizationBackLink";
import OrganizationBanner from "@/components/organizations/OrganizationBanner";
import DeleteOrganizationDialog from "@/components/organizations/DeleteOrganizationDialog";
import EditOrganizationDialog from "@/components/organizations/EditOrganizationDialog";
import CreateEventDialog from "@/components/organizations/CreateEventDialog";
import OrganizationEventsTabs from "@/components/organizations/OrganizationEventsTabs";
import OrganizationPageSkeleton from "@/components/organizations/OrganizationPageSkeleton";
import OrganizationProfileHeader from "@/components/organizations/OrganizationProfileHeader";
import { formatUsPhoneDisplay, phoneDigitsForTel } from "@/lib/utils";
import {
  deleteOrganization,
  getOrganizationById,
  updateOrganization,
} from "@/lib/organizations";
import { getEventsByOrganizationIdPage } from "@/lib/eventsServer";
import { logPageView } from "@/lib/analyticsServer";
import { uploadOrganizationAsset } from "@/lib/bucketHandler";
import { createClient } from "@/lib/supabase/client";
import { PostgrestError } from "@supabase/supabase-js";
import type { Organization, Event, Profile } from "@/lib/types";
import { getProfile } from "@/lib/profiles";
import {
  isOrganization,
  normalizeWebsite,
  ORG_EVENTS_PAGE_SIZE,
} from "@/lib/organizationPage";
import { toast } from "sonner";
type OrganizationPageProps = {
  params: Promise<{ id: string }>;
};

export default function OrganizationPage({ params }: OrganizationPageProps) {
  const { id: idParam } = use(params);
  const router = useRouter();
  const orgId = Number(idParam);

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [org, setOrg] = useState<Organization | null>(null);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [cancelledEvents, setCancelledEvents] = useState<Event[]>([]);
  const [upcomingTotal, setUpcomingTotal] = useState(0);
  const [pastTotal, setPastTotal] = useState(0);
  const [cancelledTotal, setCancelledTotal] = useState(0);
  const [founderProfile, setFounderProfile] = useState<Profile | null>(null);
  const [isOwner, setIsOwner] = useState(false);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formError, setFormError] = useState("");
  const [upcomingPage, setUpcomingPage] = useState(1);
  const [pastPage, setPastPage] = useState(1);
  const [cancelledPage, setCancelledPage] = useState(1);
  const [createEventOpen, setCreateEventOpen] = useState(false);

  const avatarInputId = useId();
  const bannerInputId = useId();
  const formErrorRef = useRef<HTMLDivElement>(null);
  const formScrollContainerRef = useRef<HTMLDivElement>(null);

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
      setFounderProfile(null);
      return;
    }

    setLoading(true);
    setNotFound(false);

    try {
      const [
        rawOrg,
        upcomingResult,
        pastResult,
        cancelledResult,
        supabase,
      ] = await Promise.all([
        getOrganizationById(orgId),
        getEventsByOrganizationIdPage(orgId, "upcoming", 1, ORG_EVENTS_PAGE_SIZE),
        getEventsByOrganizationIdPage(orgId, "past", 1, ORG_EVENTS_PAGE_SIZE),
        getEventsByOrganizationIdPage(orgId, "cancelled", 1, ORG_EVENTS_PAGE_SIZE),
        createClient(),
      ]);

      if (!rawOrg || !isOrganization(rawOrg)) {
        setNotFound(true);
        setOrg(null);
        setUpcomingEvents([]);
        setPastEvents([]);
        setCancelledEvents([]);
        setUpcomingTotal(0);
        setPastTotal(0);
        setCancelledTotal(0);
        setFounderProfile(null);
        setIsOwner(false);
        return;
      }

      void logPageView("organization", rawOrg.id);

      if (rawOrg.user_id) {
        const founderResult = await getProfile(rawOrg.user_id);
        if (founderResult && !(founderResult instanceof PostgrestError)) {
          setFounderProfile(founderResult);
        } else {
          setFounderProfile(null);
        }
      } else {
        setFounderProfile(null);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      setOrg(rawOrg);
      setUpcomingEvents(upcomingResult.items);
      setUpcomingTotal(upcomingResult.total);
      setPastEvents(pastResult.items);
      setPastTotal(pastResult.total);
      setCancelledEvents(cancelledResult.items);
      setCancelledTotal(cancelledResult.total);
      setUpcomingPage(1);
      setPastPage(1);
      setCancelledPage(1);
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

  useEffect(() => {
    if (!formError) return;
    const container = formScrollContainerRef.current;
    const error = formErrorRef.current;
    if (!container || !error) return;
    const errorTop =
      error.getBoundingClientRect().top -
      container.getBoundingClientRect().top;
    container.scrollBy({ top: errorTop, behavior: "smooth" });
  }, [formError]);

  const totalUpcomingPages = Math.max(1, Math.ceil(upcomingTotal / ORG_EVENTS_PAGE_SIZE));
  const totalPastPages = Math.max(1, Math.ceil(pastTotal / ORG_EVENTS_PAGE_SIZE));
  const totalCancelledPages = Math.max(1, Math.ceil(cancelledTotal / ORG_EVENTS_PAGE_SIZE));

  const handleUpcomingPageChange = useCallback(async (page: number) => {
    setUpcomingPage(page);
    const result = await getEventsByOrganizationIdPage(orgId, "upcoming", page, ORG_EVENTS_PAGE_SIZE);
    setUpcomingEvents(result.items);
    setUpcomingTotal(result.total);
  }, [orgId]);

  const handlePastPageChange = useCallback(async (page: number) => {
    setPastPage(page);
    const result = await getEventsByOrganizationIdPage(orgId, "past", page, ORG_EVENTS_PAGE_SIZE);
    setPastEvents(result.items);
    setPastTotal(result.total);
  }, [orgId]);

  const handleCancelledPageChange = useCallback(async (page: number) => {
    setCancelledPage(page);
    const result = await getEventsByOrganizationIdPage(orgId, "cancelled", page, ORG_EVENTS_PAGE_SIZE);
    setCancelledEvents(result.items);
    setCancelledTotal(result.total);
  }, [orgId]);

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

      if (!avatarUrl || !bannerUrl) {
        setFormError("Avatar and banner images are required.");
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
        phoneDigitsForTel(phone) || null,
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
        toast.success("Organization saved successfully.");
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

  const handleEventCreated = useCallback(
    (event: Event) => {
      router.replace(`/events/${event.id}`);
    },
    [router],
  );

  const handleDelete = async () => {
    if (!org) return;
    setDeleteError("");
    setDeleting(true);
    try {
      const result = await deleteOrganization(org.id);
      if (result === null) {
        setDeleteOpen(false);
        toast.success("Organization deleted successfully.");
        setTimeout(() => {
          router.replace("/");
        }, 1500);
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
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-4">
        <h1 className="text-2xl font-bold tracking-tight">Organization not found</h1>
        <p className="text-center text-sm text-muted-foreground">
          This organization does not exist or you do not have access.
        </p>
        <Button asChild>
          <Link href="/discover">Back to Discover</Link>
        </Button>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="min-h-svh overflow-x-hidden">
        <OrganizationBanner bannerUrl={org.banner_url} />

        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 pb-16 pt-6 sm:px-6 lg:px-8">
          <OrganizationBackLink />

          <OrganizationProfileHeader
            org={org}
            founderProfile={founderProfile}
            isOwner={isOwner}
            onEdit={() => setEditOpen(true)}
          />

          <Separator />

          <OrganizationEventsTabs
            org={org}
            upcoming={upcomingEvents}
            past={pastEvents}
            cancelled={cancelledEvents}
            upcomingTotal={upcomingTotal}
            pastTotal={pastTotal}
            cancelledTotal={cancelledTotal}
            upcomingPage={upcomingPage}
            pastPage={pastPage}
            cancelledPage={cancelledPage}
            totalUpcomingPages={totalUpcomingPages}
            totalPastPages={totalPastPages}
            totalCancelledPages={totalCancelledPages}
            onUpcomingPageChange={handleUpcomingPageChange}
            onPastPageChange={handlePastPageChange}
            onCancelledPageChange={handleCancelledPageChange}
            isOwner={isOwner}
            onCreateEvent={
              isOwner ? () => setCreateEventOpen(true) : undefined
            }
          />
        </div>

        <CreateEventDialog
          open={createEventOpen}
          onOpenChange={setCreateEventOpen}
          org={org}
          onCreated={handleEventCreated}
        />

        <DeleteOrganizationDialog
          open={deleteOpen}
          orgName={org.name}
          deleteError={deleteError}
          deleting={deleting}
          onOpenChange={setDeleteOpen}
          onConfirm={handleDelete}
        />

        <EditOrganizationDialog
          open={editOpen}
          onOpenChange={setEditOpen}
          onSubmit={handleEditSubmit}
          avatarInputId={avatarInputId}
          bannerInputId={bannerInputId}
          formScrollContainerRef={formScrollContainerRef}
          formErrorRef={formErrorRef}
          name={name}
          onNameChange={setName}
          description={description}
          onDescriptionChange={setDescription}
          location={location}
          onLocationChange={setLocation}
          website={website}
          onWebsiteChange={setWebsite}
          email={email}
          onEmailChange={setEmail}
          phone={phone}
          onPhoneChange={setPhone}
          avatarPreview={avatarPreview}
          bannerPreview={bannerPreview}
          avatarUrl={org.avatar_url}
          bannerUrl={org.banner_url}
          onAvatarFileChange={setAvatarFile}
          onBannerFileChange={setBannerFile}
          formError={formError}
          saving={saving}
          onRequestDelete={() => {
            setEditOpen(false);
            setDeleteError("");
            setDeleteOpen(true);
          }}
        />
      </div>
    </APIProvider>
  );
}
