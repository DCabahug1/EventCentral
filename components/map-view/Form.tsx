"use client";
import React, { useEffect, useState } from "react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LayoutGrid, Locate, MapPin, Search } from "lucide-react";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { CATEGORY_CONFIG } from "@/lib/categoryConfig";
import { daysFromNowDateString, todayDateString } from "@/lib/utils";

type FormData = {
  location: string;
  useUserLocation: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
};

function Form({
  fetchEvents,
  hideSubmitButton,
  onFormDataChange,
  formRef,
}: {
  fetchEvents: (formData: FormData) => void;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: FormData) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}) {
  const [formData, setFormData] = useState<FormData>({
    location: "Northridge, CA",
    useUserLocation: true,
    radius: 10,
    startDate: todayDateString(),
    endDate: daysFromNowDateString(30),
    eventType: "all",
  });

  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEvents(formData);
  };

  const labelClass = "text-xs font-semibold tracking-widest uppercase text-muted-foreground";

  return (
    <>
      {/* Header — desktop only */}
      <div className="hidden md:flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Map View</h1>
        <h2 className="text-sm text-muted-foreground">
          Filter events on the map
        </h2>
      </div>
      <Separator className="hidden md:block" />
      {/* Fields */}
      <div className="flex flex-col gap-4">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              {/* Location field */}
              <FieldLabel className={labelClass}>Location</FieldLabel>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input placeholder="Location (e.g. Northridge, CA)" className="pr-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              {/* Use your location button */}
              <Button
                type="button"
                variant="outline"
                className={`w-full ${formData.useUserLocation ? "border-primary! bg-primary/10 text-primary! hover:bg-primary/10" : ""}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    useUserLocation: !formData.useUserLocation,
                  })
                }
              >
                <Locate className="size-4" />
                {formData.useUserLocation
                  ? "Using your location"
                  : "Use my location"}
              </Button>
            </Field>
            {/* Radius field */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel className={labelClass}>Radius</FieldLabel>
                <p className="text-sm text-primary font-medium">{formData.radius} mi</p>
              </div>
              <Slider
                defaultValue={[formData.radius]}
                min={5}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setFormData({ ...formData, radius: value[0] })
                }
              />
              <div className="flex justify-between">
                <span className="text-xs text-muted-foreground">5 mi</span>
                <span className="text-xs text-muted-foreground">100 mi</span>
              </div>
            </Field>
            {/* Date Range field */}
            <Field>
              <FieldLabel className={labelClass}>Start Date</FieldLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
            </Field>
            <Field>
              <FieldLabel className={labelClass}>End Date</FieldLabel>
              <Input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
              />
            </Field>
            {/* Event Type field */}
            <Field>
              <FieldLabel className={labelClass}>Event Type</FieldLabel>
              <Select
                value={formData.eventType}
                onValueChange={(value) =>
                  setFormData({ ...formData, eventType: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an event type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <LayoutGrid className="size-4" /> All
                  </SelectItem>
                  {CATEGORY_CONFIG.map((category) => (
                    <SelectItem key={category.label} value={category.label}>
                      <category.icon className={category.colorClass} />
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            {!hideSubmitButton && (
              <Button type="submit">
                <Search className="size-4" /> Find Events
              </Button>
            )}
          </FieldGroup>
        </form>
      </div>
    </>
  );
}

export default Form;
