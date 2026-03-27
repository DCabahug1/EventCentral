"use client";
import React, { useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LayoutGrid, Locate, LoaderCircle, Search } from "lucide-react";
import LocationInput from "./LocationInput";
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
import { addOneYear, daysFromNowDateString, todayDateString } from "@/lib/utils";

type RegionBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

type FormData = {
  location: string;
  // True while the browser geolocation API is active as the location source
  useUserLocation: boolean;
  // Raw lat/lng — only present when useUserLocation is true (geolocation mode)
  coordinates?: { lat: number; lng: number };
  // True when the location was set via autocomplete selection or geolocation.
  // False while the user is typing freely. Gates form submission.
  locationValid: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
  // Bounding box of the selected region — set when a place is chosen from
  // autocomplete. Used for region-boundary filtering (events inside the region).
  // Not set in geolocation mode (which uses coordinates + radius instead).
  regionBounds?: RegionBounds;
};

function Form({
  fetchEvents,
  // When true, the submit button is hidden (used inside the mobile drawer,
  // which provides its own "Find Events" button in the footer)
  hideSubmitButton,
  // Called on every form data change — used by the map to update focus live
  onFormDataChange,
  // Forwarded ref to the <form> element so the drawer can trigger submission
  // programmatically via formRef.current?.requestSubmit()
  formRef,
}: {
  fetchEvents: (formData: FormData) => void;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: FormData) => void;
  formRef?: React.RefObject<HTMLFormElement>;
}) {
  const [formData, setFormData] = useState<FormData>({
    location: "United States",
    useUserLocation: false,
    locationValid: true,
    radius: 10,
    startDate: todayDateString(),
    endDate: daysFromNowDateString(30),
    eventType: "all",
    // No regionBounds — the "United States" default shows all events (no location filter)
  });

  // Tracks whether the geolocation + reverse geocode request is in flight
  const [locating, setLocating] = useState(false);

  // Lazily load the Geocoding library so it's only fetched when needed
  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) setGeocoder(new geocodingLib.Geocoder());
  }, [geocodingLib]);

  // Notify the parent (page.tsx) of any form data change so the map
  // can update its focus without waiting for form submission
  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData]);

  const handleUseMyLocation = () => {
    // Toggle off: clear geolocation and region state, mark location as unvalidated
    if (formData.useUserLocation) {
      setFormData({ ...formData, useUserLocation: false, coordinates: undefined, regionBounds: undefined, locationValid: false });
      return;
    }
    if (!navigator.geolocation) return;

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        // If the geocoder isn't ready yet, store raw coordinates without a city name
        if (!geocoder) {
          setLocating(false);
          setFormData((prev) => ({ ...prev, useUserLocation: true, coordinates: { lat, lng }, locationValid: true }));
          return;
        }

        // Reverse geocode the coordinates to extract a human-readable city/state string
        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          setLocating(false);
          if (status === "OK" && results && results[0]) {
            const comps = results[0].address_components;
            const city = comps.find((c) => c.types.includes("locality"))?.long_name;
            const state = comps.find((c) =>
              c.types.includes("administrative_area_level_1")
            )?.short_name;
            // Prefer "City, ST" format; fall back to the full formatted address
            const locationStr =
              city && state
                ? `${city}, ${state}`
                : results[0].formatted_address;
            setFormData((prev) => ({
              ...prev,
              location: locationStr,
              useUserLocation: true,
              coordinates: { lat, lng },
              locationValid: true,
            }));
          } else {
            // Reverse geocode failed — still store coordinates, just no city name
            setFormData((prev) => ({ ...prev, useUserLocation: true, coordinates: { lat, lng }, locationValid: true }));
          }
        });
      },
      () => {
        // User denied permission or geolocation otherwise failed
        setLocating(false);
        setFormData((prev) => ({ ...prev, useUserLocation: true }));
      }
    );
  };

  // Called when the user selects a place from the autocomplete dropdown.
  // Geocodes the placeId to extract the region's bounding box, which is stored
  // in regionBounds and used for region-boundary filtering on submit.
  // Coordinates are cleared — region mode filters by bounds, not radius.
  const handlePlaceSelect = (_description: string, placeId: string) => {
    if (!geocoder) return;
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const geo = results[0].geometry;
        // Prefer viewport (always a well-formed rectangle, no antimeridian wrapping).
        // Fall back to bounds for types that may not carry a viewport.
        const src = geo.viewport ?? geo.bounds;
        if (src) {
          setFormData((prev) => ({
            ...prev,
            coordinates: undefined, // region mode does not use center-point + radius
            regionBounds: {
              north: src.getNorthEast().lat(),
              south: src.getSouthWest().lat(),
              east:  src.getNorthEast().lng(),
              west:  src.getSouthWest().lng(),
            },
          }));
        }
      }
    });
  };

  // Updates startDate and clamps endDate to stay within the 1-year max window
  const handleStartDateChange = (value: string) => {
    const maxEnd = addOneYear(value);
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      // If current endDate exceeds the new 1-year ceiling, clamp it down
      endDate: prev.endDate > maxEnd ? maxEnd : prev.endDate < value ? value : prev.endDate,
    }));
  };

  // Updates endDate, clamping it within [startDate, startDate + 1 year]
  const handleEndDateChange = (value: string) => {
    const maxEnd = addOneYear(formData.startDate);
    const clamped = value > maxEnd ? maxEnd : value < formData.startDate ? formData.startDate : value;
    setFormData((prev) => ({ ...prev, endDate: clamped }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchEvents(formData);
  };

  const labelClass = "text-xs font-semibold tracking-widest uppercase text-muted-foreground";

  return (
    <>
      {/* Header — desktop only (hidden inside the mobile drawer) */}
      <div className="hidden md:flex flex-col gap-1">
        <h1 className="text-2xl font-bold">Map View</h1>
        <h2 className="text-sm text-muted-foreground">
          Filter events on the map
        </h2>
      </div>
      <Separator className="hidden md:block" />
      <div className="flex flex-col gap-4">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Location — autocomplete input + geolocation toggle */}
            <Field>
              <FieldLabel className={labelClass}>Location</FieldLabel>
              {/* LocationInput handles Places autocomplete suggestions.
                  readOnly locks it while geolocation is active; onActivate
                  re-enables manual editing and clears geolocation state. */}
              <LocationInput
                value={formData.location}
                onChange={(value) => setFormData({ ...formData, location: value })}
                readOnly={formData.useUserLocation}
                onActivate={() => setFormData({ ...formData, useUserLocation: false, coordinates: undefined, regionBounds: undefined, locationValid: false })}
                onValidityChange={(valid) => setFormData((prev) => ({ ...prev, locationValid: valid }))}
                onPlaceSelect={handlePlaceSelect}
              />
              {/* Geolocation toggle — shows a spinner while the browser resolves
                  the position and reverse geocodes it to a city name */}
              <Button
                type="button"
                variant="outline"
                disabled={locating}
                className={`w-full ${formData.useUserLocation ? "border-primary! bg-primary/10 text-primary! hover:bg-primary/10" : ""}`}
                onClick={handleUseMyLocation}
              >
                {locating ? (
                  <LoaderCircle className="size-4 animate-spin" />
                ) : (
                  <Locate className="size-4" />
                )}
                {locating
                  ? "Locating..."
                  : formData.useUserLocation
                  ? "Using your location"
                  : "Use my location"}
              </Button>
            </Field>

            {/* Radius slider — only shown in geolocation mode.
                Region searches use boundary matching instead of a distance radius. */}
            {formData.useUserLocation && (
              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel className={labelClass}>Radius</FieldLabel>
                  <p className="text-sm text-primary font-medium">{formData.radius} mi</p>
                </div>
                <Slider
                  defaultValue={[formData.radius]}
                  min={10}
                  max={200}
                  step={10}
                  onValueChange={(value) =>
                    setFormData({ ...formData, radius: value[0] })
                  }
                />
                <div className="flex justify-between">
                  <span className="text-xs text-muted-foreground">10 mi</span>
                  <span className="text-xs text-muted-foreground">200 mi</span>
                </div>
              </Field>
            )}

            {/* Date range — end date is clamped to [startDate, startDate + 1 year] */}
            <Field>
              <FieldLabel className={labelClass}>Start Date</FieldLabel>
              <Input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel className={labelClass}>End Date</FieldLabel>
              <Input
                type="date"
                value={formData.endDate}
                min={formData.startDate}
                max={addOneYear(formData.startDate)}
                onChange={(e) => handleEndDateChange(e.target.value)}
              />
            </Field>

            {/* Event type filter */}
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

            {/* Submit — disabled until a valid location is confirmed.
                Hidden when rendered inside the mobile drawer (drawer provides its own button). */}
            {!hideSubmitButton && (
              <Button type="submit" disabled={!formData.locationValid}>
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
