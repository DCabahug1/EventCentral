"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { AuthError, PostgrestError } from "@supabase/supabase-js";
import { Building2 } from "lucide-react";
import { getCurrentUser } from "@/lib/user";
import { getOrganizationsByUserId } from "@/lib/organizations";
import type { Organization } from "@/lib/types";
import CreateEventForm from "@/components/events/CreateEventForm";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CreateEventPage() {
  const router = useRouter();
  const formId = useId();
  const [loading, setLoading] = useState(true);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    const load = async () => {
      const userResult = await getCurrentUser();
      if (userResult instanceof AuthError || !userResult.user) {
        setLoading(false);
        router.push("/auth/login");
        return;
      }
      const orgsResult = await getOrganizationsByUserId(userResult.user.id);
      if (!(orgsResult instanceof PostgrestError) && orgsResult !== null) {
        setOrgs(orgsResult);
        if (orgsResult.length === 1) {
          setSelectedOrgId(orgsResult[0].id);
        }
      }
      setLoading(false);
    };
    void load();
  }, [router]);

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId) ?? null;

  if (loading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-muted/30">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
  }

  if (orgs.length === 0) {
    return (
      <div className="mx-auto flex min-h-svh max-w-lg flex-col justify-center gap-6 px-4 py-16">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight">Create event</h1>
          <p className="text-muted-foreground">
            Create an organization first, then you can publish events for it.
          </p>
        </div>
        <Button asChild>
          <Link href="/profile">
            <Building2 className="size-4" />
            Go to profile
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="min-h-svh bg-muted/30">
        <div className="mx-auto flex max-w-lg flex-col gap-6 px-4 py-8 sm:px-6 lg:py-12">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 shrink-0 bg-primary" aria-hidden />
            <h1 className="text-2xl font-bold tracking-tight">Create event</h1>
          </div>
          <p className="pl-3 text-sm text-muted-foreground">
            Add details, location, and an optional event image.
          </p>
        </div>

        <Separator />

        {orgs.length > 1 ? (
          <div className="flex flex-col gap-2">
            <span className="text-sm font-medium text-muted-foreground">
              Organization
            </span>
            <Select
              value={selectedOrgId !== null ? String(selectedOrgId) : ""}
              onValueChange={(v) => setSelectedOrgId(Number(v))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select organization" />
              </SelectTrigger>
              <SelectContent>
                {orgs.map((o) => (
                  <SelectItem key={o.id} value={String(o.id)}>
                    {o.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : null}

        {selectedOrg ? (
          <>
            <CreateEventForm
              formId={formId}
              org={selectedOrg}
              resetKey={selectedOrg.id}
              layout="page"
              onBusyChange={setBusy}
              onLocationCommitmentChange={setLocationReady}
              onImageCommitmentChange={setImageReady}
              onSuccess={(event) => {
                router.push(`/events/${event.id}`);
                router.refresh();
              }}
            />
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/">Cancel</Link>
              </Button>
              <Button
                type="submit"
                form={formId}
                disabled={busy || !locationReady || !imageReady}
              >
                {busy ? "Creating…" : "Create event"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-sm text-muted-foreground">
            Select an organization to continue.
          </p>
        )}
        </div>
      </div>
    </APIProvider>
  );
}
