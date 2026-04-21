"use client";

import { useId, useState } from "react";
import type { Event, Organization } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateEventForm from "@/components/events/CreateEventForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  org: Organization;
  onCreated: (event: Event) => void;
};

export default function CreateEventDialog({
  open,
  onOpenChange,
  org,
  onCreated,
}: Props) {
  const formId = useId();
  const [busy, setBusy] = useState(false);
  const [locationReady, setLocationReady] = useState(false);
  const [imageReady, setImageReady] = useState(false);

  return (
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
              For {org.name}
            </p>
          </DialogHeader>

          <CreateEventForm
            formId={formId}
            org={org}
            resetKey={open}
            onBusyChange={setBusy}
            onLocationCommitmentChange={setLocationReady}
            onImageCommitmentChange={setImageReady}
            onSuccess={(event) => {
              onCreated(event);
              onOpenChange(false);
            }}
            bodyClassName="p-4 [-webkit-overflow-scrolling:touch] sm:p-6"
          />

          <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              form={formId}
              disabled={busy || !locationReady || !imageReady}
            >
              {busy ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
  );
}
