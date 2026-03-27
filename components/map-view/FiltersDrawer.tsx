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
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { SlidersHorizontal, Search, X } from "lucide-react";
import Form from "./Form";
import { daysFromNowDateString, todayDateString } from "@/lib/utils";

type FormData = {
  location: string;
  useUserLocation: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
};

const DEFAULTS: FormData = {
  location: "",
  useUserLocation: true,
  radius: 10,
  startDate: todayDateString(),
  endDate: daysFromNowDateString(30),
  eventType: "all",
};

function countActiveFilters(formData: FormData): number {
  let count = 0;
  if (formData.location.trim() !== "") count++;
  if (formData.radius !== DEFAULTS.radius) count++;
  if (formData.eventType !== DEFAULTS.eventType) count++;
  if (formData.startDate !== DEFAULTS.startDate) count++;
  if (formData.endDate !== DEFAULTS.endDate) count++;
  return count;
}

export default function FiltersDrawer({
  fetchEvents,
}: {
  fetchEvents: (formData: FormData) => void;
}) {
  const [open, setOpen] = useState(false);
  const [trackedFormData, setTrackedFormData] = useState<FormData>(DEFAULTS);
  const formRef = useRef<HTMLFormElement>(null);

  const activeCount = countActiveFilters(trackedFormData);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" className="gap-2 shadow-md">
          <SlidersHorizontal className="size-4" />
          Filters
          {activeCount > 0 && (
            <Badge className="size-5 rounded-full p-0 flex items-center justify-center text-[10px]">
              {activeCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="flex-row items-center justify-between text-left">
          <DrawerTitle className="text-xl">Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon">
              <X className="size-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>
        <div className="overflow-y-auto px-4 pb-2">
          <Form
            fetchEvents={(data) => {
              fetchEvents(data);
              setOpen(false);
            }}
            hideSubmitButton
            onFormDataChange={setTrackedFormData}
            formRef={formRef}
          />
        </div>
        <DrawerFooter>
          <Button
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
