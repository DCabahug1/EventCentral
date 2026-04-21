"use client";
import React, { useRef, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal, Search, X } from "lucide-react";
import Form from "./Form";

type FormData = {
  keyword: string;
  location: string;
  useUserLocation: boolean;
  coordinates?: { lat: number; lng: number };
  locationValid: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
  regionBounds?: { north: number; south: number; east: number; west: number };
};

export default function FiltersDialog({
  fetchEvents,
  appliedQuery,
  onFormDataChange,
}: {
  fetchEvents: (formData: FormData) => void;
  appliedQuery: FormData;
  onFormDataChange?: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [canSubmit, setCanSubmit] = useState(false);
  const formRef = useRef<HTMLFormElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-2 shadow-md">
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[85svh] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        <div className="relative flex shrink-0 items-center justify-center border-b border-border px-4 py-4 sm:px-6">
          <DialogTitle className="text-center text-2xl font-bold tracking-tight">
            Filters
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 shrink-0"
              aria-label="Close"
            >
              <X className="size-4" />
            </Button>
          </DialogClose>
        </div>
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4 sm:p-6">
          <div className="min-h-0 flex-1 overflow-y-auto">
            <Form
              fetchEvents={(data) => {
                fetchEvents(data);
                setOpen(false);
              }}
              appliedQuery={appliedQuery}
              hideSubmitButton
              onFormDataChange={(data) => {
                onFormDataChange?.(data);
              }}
              onCanSubmitChange={setCanSubmit}
              formRef={formRef as React.RefObject<HTMLFormElement>}
            />
          </div>
        </div>
        <DialogFooter className="shrink-0 border-t px-4 py-4 pb-[max(env(safe-area-inset-bottom),0.75rem)] sm:px-6">
          <Button
            disabled={!canSubmit}
            className="w-full"
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
          >
            <Search className="size-4" /> Find Events
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
