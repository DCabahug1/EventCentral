"use client";

import { useEffect, useId, useState } from "react";
import Image from "next/image";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Upload } from "lucide-react";
import { createEvent } from "@/lib/eventsServer";
import { isEvent } from "@/lib/eventPage";
import {
  CATEGORY_CONFIG,
  DEFAULT_EVENT_CATEGORY,
} from "@/lib/categoryConfig";
import type { Event, Organization } from "@/lib/types";
import { createClient } from "@/lib/supabase/client";
import { uploadEventImage } from "@/lib/bucketHandler";
import { cn } from "@/lib/utils";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationInput } from "@/components/ui/location-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FormRequiredLegend,
  OptionalFieldHint,
  RequiredMark,
} from "@/components/ui/form-field-hints";
import { PostgrestError } from "@supabase/supabase-js";

function defaultStartLocal(): string {
  const startDate = new Date();
  startDate.setMinutes(0, 0, 0);
  startDate.setHours(startDate.getHours() + 1);
  return toLocalInput(startDate);
}

function defaultEndLocal(): string {
  const endDate = new Date();
  endDate.setMinutes(0, 0, 0);
  endDate.setHours(endDate.getHours() + 3);
  return toLocalInput(endDate);
}

function toLocalInput(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export type CreateEventFormProps = {
  org: Organization;
  /** Root form id (for submit buttons in footers via `form=`). */
  formId: string;
  onSuccess: (event: Event) => void;
  /** When the dialog opens or org changes, reset fields. */
  resetKey?: number | string | boolean;
  /** Sync busy state to a parent submit button (e.g. dialog footer). */
  onBusyChange?: (busy: boolean) => void;
  /** `page` drops flex-1 so the form fits a scrolling page layout. */
  layout?: "dialog" | "page";
  /** Fires when the primary location field has a confirmed Places selection (ready to submit). */
  onLocationCommitmentChange?: (ready: boolean) => void;
  /** Fires when an event image file is selected (required). */
  onImageCommitmentChange?: (ready: boolean) => void;
  /** Optional organization selector rendered as part of the form. */
  organizationOptions?: Organization[];
  selectedOrganizationId?: number | null;
  onOrganizationChange?: (organizationId: number) => void;
  className?: string;
  legendClassName?: string;
  bodyClassName?: string;
};

export default function CreateEventForm({
  org,
  formId,
  onSuccess,
  resetKey,
  onBusyChange,
  layout = "dialog",
  onLocationCommitmentChange,
  onImageCommitmentChange,
  organizationOptions,
  selectedOrganizationId,
  onOrganizationChange,
  className,
  legendClassName,
  bodyClassName,
}: CreateEventFormProps) {
  const imageInputId = useId();
  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) {
      setGeocoder(new geocodingLib.Geocoder());
    }
  }, [geocodingLib]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(DEFAULT_EVENT_CATEGORY);
  const [startLocal, setStartLocal] = useState(defaultStartLocal);
  const [endLocal, setEndLocal] = useState(defaultEndLocal);
  const [address, setAddress] = useState("");
  const [locationPlaceId, setLocationPlaceId] = useState<string | null>(null);
  const [locationValid, setLocationValid] = useState(false);
  const [locationDetails, setLocationDetails] = useState("");
  const [maxCapacity, setMaxCapacity] = useState("50");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  useEffect(() => {
    setFormError("");
    setTitle("");
    setDescription("");
    setCategory(DEFAULT_EVENT_CATEGORY);
    setStartLocal(defaultStartLocal());
    setEndLocal(defaultEndLocal());
    setAddress("");
    setLocationPlaceId(null);
    setLocationValid(false);
    setLocationDetails("");
    setMaxCapacity("50");
    setImageFile(null);
    setImagePreview(null);
  }, [resetKey, org.id]);

  useEffect(() => {
    onBusyChange?.(saving);
  }, [saving, onBusyChange]);

  const locationReady = locationValid && locationPlaceId !== null;

  useEffect(() => {
    onLocationCommitmentChange?.(locationReady);
  }, [locationReady, onLocationCommitmentChange]);

  const imageReady = imageFile !== null;

  useEffect(() => {
    onImageCommitmentChange?.(imageReady);
  }, [imageReady, onImageCommitmentChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    const cap = Number(maxCapacity);
    if (!title.trim()) {
      setFormError("Title is required.");
      return;
    }
    if (
      organizationOptions &&
      organizationOptions.length > 1 &&
      selectedOrganizationId == null
    ) {
      setFormError("Organization is required.");
      return;
    }
    if (!imageFile) {
      setFormError("Event image is required.");
      return;
    }
    if (!Number.isFinite(cap) || cap < 1) {
      setFormError("Max capacity must be at least 1.");
      return;
    }
    if (!address.trim() || !locationReady) {
      setFormError("Choose a location from the suggestions.");
      return;
    }
    const start = new Date(startLocal);
    const end = new Date(endLocal);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setFormError("Enter valid start and end times.");
      return;
    }
    if (end <= start) {
      setFormError("End time must be after start time.");
      return;
    }

    setSaving(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setFormError("You must be signed in.");
        return;
      }

      let imageUrl: string;
      try {
        imageUrl = await uploadEventImage(imageFile, user.id);
      } catch (uploadErr) {
        setFormError(
          uploadErr instanceof Error
            ? uploadErr.message
            : "Image upload failed.",
        );
        return;
      }

      let lat: number | null = null;
      let lng: number | null = null;
      if (locationPlaceId && geocoder) {
        const coords = await new Promise<{
          lat: number;
          lng: number;
        } | null>((resolve) => {
          geocoder.geocode({ placeId: locationPlaceId }, (results, status) => {
            if (status !== "OK" || !results?.[0]?.geometry?.location) {
              resolve(null);
              return;
            }
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng() });
          });
        });
        if (coords) {
          lat = coords.lat;
          lng = coords.lng;
        }
      }

      const result = await createEvent({
        organization_id: org.id,
        organization_name: org.name,
        title: title.trim(),
        description: description.trim() || null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        address: address.trim(),
        location_details: locationDetails.trim() || null,
        lat,
        lng,
        max_capacity: cap,
        image_url: imageUrl,
        category,
        CANCELLED: false,
        rsvp_count: null,
      });

      if (isEvent(result)) {
        onSuccess(result);
        return;
      }

      if (result instanceof Error) {
        setFormError(result.message);
        return;
      }
      if (
        result &&
        typeof result === "object" &&
        "message" in result &&
        typeof (result as PostgrestError).message === "string"
      ) {
        setFormError((result as PostgrestError).message);
        return;
      }
      setFormError("Could not create event.");
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={handleSubmit}
      className={cn(
        "flex flex-col",
        layout === "dialog" ? "min-h-0 flex-1" : "flex-none",
        className,
      )}
    >
      <div
        className={cn(
          layout === "dialog"
            ? "min-h-0 flex-1 overflow-y-auto overscroll-contain"
            : "overflow-visible",
          bodyClassName,
        )}
      >
        <FormRequiredLegend className={cn("mb-5", legendClassName)} />
        <FieldGroup className="gap-5">
          {organizationOptions && organizationOptions.length > 1 && onOrganizationChange ? (
            <Field>
              <FieldLabel className="text-muted-foreground">
                Organization <RequiredMark />
              </FieldLabel>
              <FieldContent>
                <Select
                  value={selectedOrganizationId != null ? String(selectedOrganizationId) : ""}
                  onValueChange={(value) => onOrganizationChange(Number(value))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select organization" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizationOptions.map((organizationOption) => (
                      <SelectItem
                        key={organizationOption.id}
                        value={String(organizationOption.id)}
                      >
                        {organizationOption.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>
          ) : null}

          <Field>
            <FieldLabel
              htmlFor={imageInputId}
              className="text-muted-foreground"
            >
              Event image
              <RequiredMark />
            </FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Landscape-oriented images work best. JPEG, PNG, or WebP.
            </FieldDescription>
            <FieldContent className="items-center gap-2">
              <label
                htmlFor={imageInputId}
                className={cn(
                  "relative mx-auto flex h-48 w-full max-w-[600px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-muted transition-colors hover:border-muted-foreground",
                )}
              >
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt=""
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                ) : (
                  <>
                    <Upload className="mb-2 size-5 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Upload event image
                    </span>
                  </>
                )}
                <input
                  id={imageInputId}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    setImageFile(e.target.files?.[0] ?? null);
                  }}
                />
              </label>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-title`} className="text-muted-foreground">
              Title <RequiredMark />
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-title`}
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Event title"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-desc`} className="text-muted-foreground">
              Description
              <OptionalFieldHint />
            </FieldLabel>
            <FieldContent>
              <Textarea
                id={`${formId}-desc`}
                className="min-h-24 resize-none"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What should attendees know?"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel className="text-muted-foreground">
              Category <RequiredMark />
            </FieldLabel>
            <FieldContent>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger
                  id={`${formId}-category`}
                  className="w-full min-w-0"
                >
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORY_CONFIG.map((c) => (
                    <SelectItem key={c.label} value={c.label}>
                      <c.icon className={cn("size-4", c.colorClass)} aria-hidden />
                      {c.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-start`} className="text-muted-foreground">
              Start <RequiredMark />
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-start`}
                type="datetime-local"
                required
                value={startLocal}
                onChange={(e) => setStartLocal(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-end`} className="text-muted-foreground">
              End <RequiredMark />
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-end`}
                type="datetime-local"
                required
                value={endLocal}
                min={startLocal}
                onChange={(e) => setEndLocal(e.target.value)}
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel
              htmlFor={`${formId}-address`}
              className="text-muted-foreground"
            >
              Location <RequiredMark />
            </FieldLabel>
            <FieldDescription className="text-xs text-muted-foreground">
              Type to search, then pick a place from the suggestions. Only
              suggested addresses are accepted.
            </FieldDescription>
            <FieldContent>
              <LocationInput
                id={`${formId}-address`}
                value={address}
                onChange={(value) => {
                  setAddress(value);
                  setLocationPlaceId(null);
                }}
                onValidityChange={setLocationValid}
                onPlaceSelect={(_description, placeId) => {
                  setLocationPlaceId(placeId);
                }}
                treatEmptyAsValid={false}
                placeholder="Search city, neighborhood, or address"
                mapPinSide="left"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-location-details`} className="text-muted-foreground">
              Additional location info
              <OptionalFieldHint />
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-location-details`}
                value={locationDetails}
                onChange={(e) => setLocationDetails(e.target.value)}
                placeholder="e.g. Room 2, East wing"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor={`${formId}-cap`} className="text-muted-foreground">
              Max capacity <RequiredMark />
            </FieldLabel>
            <FieldContent>
              <Input
                id={`${formId}-cap`}
                type="number"
                min={1}
                required
                value={maxCapacity}
                onChange={(e) => setMaxCapacity(e.target.value)}
              />
            </FieldContent>
          </Field>

          {formError ? (
            <FieldError id={`${formId}-error`}>{formError}</FieldError>
          ) : null}
        </FieldGroup>
      </div>

    </form>
  );
}
