"use client";
import React, { useEffect, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Field, FieldGroup, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { LayoutGrid, Locate, LoaderCircle, Search, X } from "lucide-react";
import { LocationInput } from "@/components/ui/location-input";
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
import { SEARCH_CATEGORY_CONFIG } from "@/lib/events/categories";
import { addOneYear, daysFromNowDateString, todayDateString } from "@/lib/utils";

type RegionBounds = {
  north: number;
  south: number;
  east: number;
  west: number;
};

type FormData = {
  keyword: string;
  location: string;
  // True while the browser geolocation API is active as the location source
  useUserLocation: boolean;
  // Raw lat and lng only in geolocation mode.
  coordinates?: { lat: number; lng: number };
  // True when the location was set via autocomplete selection or geolocation.
  // False while the user is typing freely. Gates form submission.
  locationValid: boolean;
  radius: number;
  startDate: string;
  endDate: string;
  eventType: string;
  // Bounding box from selected autocomplete place.
  // autocomplete. Used for region-boundary filtering (events inside the region).
  // Not set in geolocation mode (which uses coordinates + radius instead).
  regionBounds?: RegionBounds;
};

const buildDefaultFormData = (): FormData => ({
  keyword: "",
  location: "",
  useUserLocation: false,
  locationValid: true,
  radius: 10,
  startDate: todayDateString(),
  endDate: daysFromNowDateString(30),
  eventType: "all",
});

/** True when form matches the default clear state. */
function matchesOriginalDefaults(data: FormData): boolean {
  const orig = buildDefaultFormData();
  return (
    data.keyword.trim() === orig.keyword &&
    data.location === orig.location &&
    data.useUserLocation === orig.useUserLocation &&
    data.locationValid === orig.locationValid &&
    data.radius === orig.radius &&
    data.startDate === orig.startDate &&
    data.endDate === orig.endDate &&
    data.eventType === orig.eventType &&
    data.coordinates === undefined &&
    data.regionBounds === undefined
  );
}

function Form({
  fetchEvents,
  appliedQuery,
  // When true the submit button is hidden. Used in the mobile filters dialog,
  // which provides its own "Find Events" button in the footer)
  hideSubmitButton,
  // Called on every form change so map focus can update live.
  onFormDataChange,
  // Forwarded ref to the <form> element so the dialog can trigger submission
  // programmatically via formRef.current?.requestSubmit()
  formRef,
  // Emits whether the current form state can be submitted.
  onCanSubmitChange,
}: {
  fetchEvents: (formData: FormData) => void;
  appliedQuery: FormData;
  hideSubmitButton?: boolean;
  onFormDataChange?: (formData: FormData) => void;
  formRef?: React.RefObject<HTMLFormElement>;
  onCanSubmitChange?: (canSubmit: boolean) => void;
}) {
  const [formData, setFormData] = useState<FormData>(appliedQuery);

  // Tracks whether the geolocation + reverse geocode request is in flight
  const [locating, setLocating] = useState(false);

  // Lazily load the Geocoding library so it's only fetched when needed
  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) setGeocoder(new geocodingLib.Geocoder());
  }, [geocodingLib]);

  // Keep local form state aligned with latest applied query.
  // This ensures dialog reopen on mobile shows the last submitted values.
  useEffect(() => {
    setFormData(appliedQuery);
  }, [appliedQuery]);

  // Notify parent on form changes so the map
  // can update its focus without waiting for form submission
  useEffect(() => {
    onFormDataChange?.(formData);
  }, [formData, onFormDataChange]);

  const formCoordinatesKey = formData.coordinates
    ? `${formData.coordinates.lat}:${formData.coordinates.lng}`
    : "";
  const appliedCoordinatesKey = appliedQuery.coordinates
    ? `${appliedQuery.coordinates.lat}:${appliedQuery.coordinates.lng}`
    : "";
  const formRegionBoundsKey = formData.regionBounds
    ? `${formData.regionBounds.north}:${formData.regionBounds.south}:${formData.regionBounds.east}:${formData.regionBounds.west}`
    : "";
  const appliedRegionBoundsKey = appliedQuery.regionBounds
    ? `${appliedQuery.regionBounds.north}:${appliedQuery.regionBounds.south}:${appliedQuery.regionBounds.east}:${appliedQuery.regionBounds.west}`
    : "";

  const isDirty = Boolean(
    formData.keyword !== appliedQuery.keyword ||
      formData.location !== appliedQuery.location ||
      formData.useUserLocation !== appliedQuery.useUserLocation ||
      formCoordinatesKey !== appliedCoordinatesKey ||
      formData.locationValid !== appliedQuery.locationValid ||
      formData.radius !== appliedQuery.radius ||
      formData.startDate !== appliedQuery.startDate ||
      formData.endDate !== appliedQuery.endDate ||
      formData.eventType !== appliedQuery.eventType ||
      formRegionBoundsKey !== appliedRegionBoundsKey,
  );

  const canSubmit = formData.locationValid && isDirty;

  const showClearFilters = !matchesOriginalDefaults(formData);

  useEffect(() => {
    onCanSubmitChange?.(canSubmit);
  }, [canSubmit, onCanSubmitChange]);

  const handleUseMyLocation = () => {
    // Toggle off clears geolocation and region values.
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

        // Reverse geocode and build a city and state label.
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
            // If reverse geocode fails keep the coordinates only.
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

  // Runs when user selects an autocomplete place.
  // Geocodes the placeId to extract the region's bounding box, which is stored
  // in regionBounds and used for region-boundary filtering on submit.
  // Region mode uses bounds so clear coordinates.
  const handlePlaceSelect = (_description: string, placeId: string) => {
    if (!geocoder) return;
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results && results[0]) {
        const geo = results[0].geometry;
        // Prefer viewport because it is always a rectangle.
        // Fall back to bounds for types that may not carry a viewport.
        const src = geo.viewport ?? geo.bounds;
        if (src) {
          setFormData((prev) => ({
            ...prev,
            coordinates: undefined, // Region mode does not use center point radius.
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

  // Updates start date and clamps end date to one year max.
  const handleStartDateChange = (value: string) => {
    const maxEnd = addOneYear(value);
    setFormData((prev) => ({
      ...prev,
      startDate: value,
      // Clamp end date if it goes outside the allowed range.
      endDate: prev.endDate > maxEnd ? maxEnd : prev.endDate < value ? value : prev.endDate,
    }));
  };

  // Updates end date and keeps it in the allowed range.
  const handleEndDateChange = (value: string) => {
    const maxEnd = addOneYear(formData.startDate);
    const clamped = value > maxEnd ? maxEnd : value < formData.startDate ? formData.startDate : value;
    setFormData((prev) => ({ ...prev, endDate: clamped }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;
    fetchEvents(formData);
  };

  const labelClass = "text-xs font-semibold tracking-widest uppercase text-muted-foreground";

  return (
    <>
      {/* Header shown on desktop only */}
      <div className="hidden md:flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="h-5 w-1 shrink-0 bg-primary" aria-hidden />
          <h1 className="text-2xl font-bold tracking-tight">Map View</h1>
        </div>
        <h2 className="pl-3 text-sm text-muted-foreground">
          Filter events on the map.
        </h2>
      </div>
      <Separator className="hidden md:block" />
      <div className="flex flex-col gap-4">
        <form ref={formRef} onSubmit={handleSubmit}>
          <FieldGroup>
            {/* Location input plus geolocation toggle */}
            <Field>
              <FieldLabel className={labelClass}>Keyword</FieldLabel>
              <Input
                type="text"
                placeholder="Search event title or description"
                value={formData.keyword}
                onChange={(e) =>
                  setFormData({ ...formData, keyword: e.target.value })
                }
              />
            </Field>

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
              {/* Geolocation toggle shows a spinner while browser resolves
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

            {/* Radius slider shown only in geolocation mode.
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

            {/* Date range with end date clamped to one year window */}
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
                  {SEARCH_CATEGORY_CONFIG.map((category) => (
                    <SelectItem key={category.label} value={category.label}>
                      <category.icon className={category.colorClass} />
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            {/* Submit disabled until location is valid.
                Hidden when rendered inside the mobile filters dialog (dialog provides its own button). */}
            <div
              className={`flex flex-col w-full gap-2 ${hideSubmitButton && !showClearFilters ? "hidden" : ""}`}
            >
              {!hideSubmitButton && (
                <Button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full"
                >
                  <Search className="size-4" /> Find Events
                </Button>
              )}
              {showClearFilters && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setFormData(buildDefaultFormData())}
                >
                  <X className="size-4" /> Clear filters
                </Button>
              )}
            </div>
          </FieldGroup>
        </form>
      </div>
    </>
  );
}

export default Form;
