"use client";
import React, { useState } from "react";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LayoutGrid, List, Locate, MapPin, Search } from "lucide-react";
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

function Form({
  fetchEvents,
}: {
  fetchEvents: (formData: {
    location: string;
    useUserLocation: boolean;
    radius: number;
    startDate: string;
    endDate: string;
    eventType: string;
  }) => void;
}) {
  const [formData, setFormData] = useState({
    location: "Northridge, CA",
    useUserLocation: true,
    radius: 10,
    startDate: todayDateString(),
    endDate: daysFromNowDateString(30),
    eventType: "all",
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEvents(formData);
  };

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Map View</h1>
        <h2 className="text-sm text-muted-foreground">
          Filter events on the map
        </h2>
      </div>
      <Separator />
      {/* Fields */}
      <div className="flex flex-col gap-4">
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              {/* Location field */}
              <FieldLabel>Location</FieldLabel>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4" />
                <Input placeholder="Location (e.g. Northridge, CA)" className="pr-10" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
              </div>
              {/* Use your location button */}
              <Button
                variant="outline"
                className={`${formData.useUserLocation ? "border-primary! bg-primary/10 text-primary! hover:bg-primary/10" : ""}`}
                onClick={() =>
                  setFormData({
                    ...formData,
                    useUserLocation: !formData.useUserLocation,
                  })
                }
              >
                {formData.useUserLocation
                  ? "Using your location"
                  : "Use your location"}{" "}
                <Locate className="size-4" />
              </Button>
            </Field>
            {/* Radius field */}
            <Field>
              <div className="flex items-center justify-between">
                <FieldLabel>Radius</FieldLabel>
                <p className="text-sm text-primary">{formData.radius} mi</p>
              </div>
              <Slider
                defaultValue={[formData.radius]}
                max={100}
                step={1}
                onValueChange={(value) =>
                  setFormData({ ...formData, radius: value[0] })
                }
              />
            </Field>
            {/* Date Range field */}
            <Field>
              <FieldLabel>Start Date</FieldLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
              />
              <FieldLabel>End Date</FieldLabel>
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
              <FieldLabel>Event Type</FieldLabel>
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
                    {" "}
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
            <Button type="submit">Find Events <Search className="size-4" /></Button>
          </FieldGroup>
        </form>
      </div>
    </>
  );
}

export default Form;
