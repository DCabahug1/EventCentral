"use client";
import React, { useRef, useState } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
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

export default function FiltersDrawer({
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
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="gap-2 shadow-md">
          <SlidersHorizontal className="size-4" />
          Filters
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex max-h-[85svh] flex-col">
        <DrawerHeader className="flex-row items-center justify-between text-left">
          <DrawerTitle className="text-xl">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto px-4 pb-3">
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
        <DrawerFooter className="border-t pb-[max(env(safe-area-inset-bottom),0.75rem)]">
          <Button
            disabled={!canSubmit}
            className="w-full"
            onClick={() => {
              formRef.current?.requestSubmit();
            }}
          >
            <Search className="size-4" /> Find Events
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
