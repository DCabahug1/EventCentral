"use client";

import { useEffect, useId, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { APIProvider } from "@vis.gl/react-google-maps";
import { PostgrestError } from "@supabase/supabase-js";
import { Building2 } from "lucide-react";
import { getOrganizationsByUserId } from "@/lib/organizations";
import type { Organization, Profile } from "@/lib/types";
import CreateEventForm from "@/components/events/CreateEventForm";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: Profile | null;
};

export default function CreateEventGlobalDialog({
  open,
  onOpenChange,
  profile,
}: Props) {
  const router = useRouter();
  const formId = useId();
  const [loading, setLoading] = useState(false);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (!profile?.user_id) return;

    const loadOrgs = async () => {
      setLoading(true);
      try {
        const orgsResult = await getOrganizationsByUserId(profile.user_id);
        if (!(orgsResult instanceof PostgrestError) && orgsResult !== null) {
          setOrgs(orgsResult);
          setSelectedOrgId((prev) => {
            if (prev !== null && orgsResult.some((o) => o.id === prev)) {
              return prev;
            }
            return orgsResult[0]?.id ?? null;
          });
        } else {
          setOrgs([]);
          setSelectedOrgId(null);
        }
      } finally {
        setLoading(false);
      }
    };

    void loadOrgs();
  }, [open, profile?.user_id]);

  const selectedOrg = orgs.find((o) => o.id === selectedOrgId) ?? null;

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[min(92vh,900px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
        >
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Create event
            </DialogTitle>
            <p className="text-left text-sm text-muted-foreground">
              Add details, location, and a required event image.
            </p>
          </DialogHeader>

          {!profile?.user_id ? (
            <div className="p-4 text-sm text-muted-foreground sm:p-6">
              Sign in to host events.
            </div>
          ) : loading ? (
            <div className="p-4 text-sm text-muted-foreground sm:p-6">
              Loading…
            </div>
          ) : orgs.length === 0 ? (
            <div className="flex flex-col gap-5 p-4 sm:p-6">
              <p className="text-sm text-muted-foreground">
                You need an organization before you can host an event.
              </p>
              <Button asChild onClick={() => onOpenChange(false)}>
                <Link href="/profile">
                  <Building2 className="size-4" />
                  Go to profile to create one
                </Link>
              </Button>
            </div>
          ) : (
            <>
              {selectedOrg ? (
                <CreateEventForm
                  formId={formId}
                  org={selectedOrg}
                  resetKey={`${open}-${selectedOrg.id}`}
                  onBusyChange={setBusy}
                  onLocationCommitmentChange={setLocationReady}
                  onImageCommitmentChange={setImageReady}
                  organizationOptions={orgs}
                  selectedOrganizationId={selectedOrgId}
                  onOrganizationChange={setSelectedOrgId}
                  onSuccess={(event) => {
                    onOpenChange(false);
                    router.replace(`/events/${event.id}`);
                  }}
                  bodyClassName="p-4 [-webkit-overflow-scrolling:touch] sm:p-6"
                />
              ) : (
                <p className="p-4 text-sm text-muted-foreground sm:p-6">
                  Select an organization to continue.
                </p>
              )}
            </>
          )}

          <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={busy}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={
                busy ||
                loading ||
                !selectedOrg ||
                orgs.length === 0 ||
                !locationReady ||
                !imageReady
              }
            >
              {busy ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </APIProvider>
  );
}
