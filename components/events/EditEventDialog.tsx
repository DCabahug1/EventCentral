"use client";

import { useState, useEffect, useId } from "react";
import Image from "next/image";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { ImageIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  FormRequiredLegend,
  OptionalFieldHint,
  RequiredMark,
} from "@/components/ui/form-field-hints";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { LocationInput } from "@/components/ui/location-input";
import { CATEGORY_CONFIG } from "@/lib/categoryConfig";
import { uploadEventImage } from "@/lib/bucketHandler";
import { updateEvent } from "@/lib/eventsServer";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/types";

function toLocalInput(isoStr: string): string {
  const d = new Date(isoStr);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type Props = {
  event: Event;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (updated: Event) => void;
  onRequestDelete: () => void;
};

export default function EditEventDialog({
  event,
  open,
  onOpenChange,
  onSuccess,
  onRequestDelete,
}: Props) {
  const imageInputId = useId();
  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) setGeocoder(new geocodingLib.Geocoder());
  }, [geocodingLib]);

  const [title, setTitle] = useState(event.title);
  const [description, setDescription] = useState(event.description ?? "");
  const [category, setCategory] = useState(event.category ?? CATEGORY_CONFIG[0].label);
  const [isCancelled, setIsCancelled] = useState(event.CANCELLED);
  const [startLocal, setStartLocal] = useState(() => toLocalInput(event.start_time));
  const [endLocal, setEndLocal] = useState(() => toLocalInput(event.end_time));
  const [address, setAddress] = useState(event.address ?? "");
  const [locationPlaceId, setLocationPlaceId] = useState<string | null>(null);
  const [locationDetails, setLocationDetails] = useState(event.location_details ?? "");
  const [maxCapacity, setMaxCapacity] = useState(String(event.max_capacity ?? ""));
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    setTitle(event.title);
    setDescription(event.description ?? "");
    setCategory(event.category ?? CATEGORY_CONFIG[0].label);
    setIsCancelled(event.CANCELLED);
    setStartLocal(toLocalInput(event.start_time));
    setEndLocal(toLocalInput(event.end_time));
    setAddress(event.address ?? "");
    setLocationPlaceId(null);
    setLocationDetails(event.location_details ?? "");
    setMaxCapacity(String(event.max_capacity ?? ""));
    setImageFile(null);
    setImagePreview(null);
    setFormError("");
  }, [open]);

  useEffect(() => {
    if (!imageFile) { setImagePreview(null); return; }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const cap = Number(maxCapacity);
    if (!title.trim()) { setFormError("Title is required."); return; }
    if (!Number.isFinite(cap) || cap < 1) { setFormError("Max capacity must be at least 1."); return; }
    if (!address.trim()) { setFormError("Location is required."); return; }

    const addressChanged = address.trim() !== (event.address ?? "").trim();
    if (addressChanged && locationPlaceId === null) {
      setFormError("Choose a location from the suggestions to update the address.");
      return;
    }

    const start = new Date(startLocal);
    const end = new Date(endLocal);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      setFormError("Enter valid start and end times.");
      return;
    }
    if (end <= start) { setFormError("End time must be after start time."); return; }

    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setFormError("You must be signed in."); setSaving(false); return; }

      let imageUrl = event.image_url;
      if (imageFile) {
        try {
          imageUrl = await uploadEventImage(imageFile, user.id);
        } catch (err) {
          setFormError(err instanceof Error ? err.message : "Image upload failed.");
          setSaving(false);
          return;
        }
      }

      let lat = event.lat;
      let lng = event.lng;
      if (locationPlaceId && geocoder) {
        const coords = await new Promise<{ lat: number; lng: number } | null>((resolve) => {
          geocoder.geocode({ placeId: locationPlaceId }, (results, status) => {
            if (status !== "OK" || !results?.[0]?.geometry?.location) { resolve(null); return; }
            const loc = results[0].geometry.location;
            resolve({ lat: loc.lat(), lng: loc.lng() });
          });
        });
        if (coords) { lat = coords.lat; lng = coords.lng; }
      }

      const result = await updateEvent(event.id, {
        title: title.trim(),
        description: description.trim() || null,
        category,
        CANCELLED: isCancelled,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        address: address.trim(),
        location_details: locationDetails.trim() || null,
        lat,
        lng,
        max_capacity: cap,
        image_url: imageUrl,
      });

      if (result && typeof result === "object" && "id" in result) {
        onSuccess(result as Event);
        return;
      }
      setFormError(result instanceof Error ? result.message : "Failed to save changes.");
    } catch {
      setFormError("Something went wrong. Try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[min(92vh,900px)] min-h-0 flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <DialogHeader className="shrink-0 px-4 py-4 sm:px-6">
            <DialogTitle className="text-2xl font-bold tracking-tight">
              Edit event
            </DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4 [-webkit-overflow-scrolling:touch] sm:p-6">
            <FormRequiredLegend className="mb-5" />
            <FieldGroup className="gap-5">

              <Field>
                <FieldLabel htmlFor={imageInputId} className="text-muted-foreground">
                  Event image
                  <OptionalFieldHint />
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  Landscape-oriented images work best. JPEG, PNG, or WebP. Leave blank to keep the current image.
                </FieldDescription>
                <FieldContent className="items-center gap-2">
                  <label
                    htmlFor={imageInputId}
                    className="relative mx-auto flex h-48 w-full max-w-[600px] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-md border border-border bg-muted transition-colors hover:border-muted-foreground"
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
                    ) : event.image_url ? (
                      <Image
                        src={event.image_url}
                        alt=""
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 600px"
                      />
                    ) : (
                      <>
                        <ImageIcon className="mb-2 size-5 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Upload event image</span>
                      </>
                    )}
                    <input
                      id={imageInputId}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-event-title" className="text-muted-foreground">
                  Title <RequiredMark />
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="edit-event-title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Event title"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-event-desc" className="text-muted-foreground">
                  Description
                  <OptionalFieldHint />
                </FieldLabel>
                <FieldContent>
                  <Textarea
                    id="edit-event-desc"
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
                    <SelectTrigger className="w-full min-w-0">
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
                <FieldLabel htmlFor="edit-event-start" className="text-muted-foreground">
                  Start <RequiredMark />
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="edit-event-start"
                    type="datetime-local"
                    required
                    value={startLocal}
                    onChange={(e) => setStartLocal(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-event-end" className="text-muted-foreground">
                  End <RequiredMark />
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="edit-event-end"
                    type="datetime-local"
                    required
                    value={endLocal}
                    min={startLocal}
                    onChange={(e) => setEndLocal(e.target.value)}
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-event-address" className="text-muted-foreground">
                  Location <RequiredMark />
                </FieldLabel>
                <FieldDescription className="text-xs text-muted-foreground">
                  To change the location, type and pick a place from the suggestions.
                </FieldDescription>
                <FieldContent>
                  <LocationInput
                    id="edit-event-address"
                    value={address}
                    onChange={(value) => {
                      setAddress(value);
                      setLocationPlaceId(null);
                    }}
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
                <FieldLabel htmlFor="edit-event-location-details" className="text-muted-foreground">
                  Additional location info
                  <OptionalFieldHint />
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="edit-event-location-details"
                    value={locationDetails}
                    onChange={(e) => setLocationDetails(e.target.value)}
                    placeholder="e.g. Room 2, East wing"
                  />
                </FieldContent>
              </Field>

              <Field>
                <FieldLabel htmlFor="edit-event-cap" className="text-muted-foreground">
                  Max capacity <RequiredMark />
                </FieldLabel>
                <FieldContent>
                  <Input
                    id="edit-event-cap"
                    type="number"
                    min={1}
                    required
                    value={maxCapacity}
                    onChange={(e) => setMaxCapacity(e.target.value)}
                  />
                </FieldContent>
              </Field>

              {formError ? (
                <FieldError id="edit-event-error">{formError}</FieldError>
              ) : null}

            </FieldGroup>
          </div>

          <DialogFooter className="shrink-0 border-t bg-background px-4 py-4 sm:px-6">
            <Button
              type="button"
              variant="destructive"
              onClick={onRequestDelete}
            >
              Delete event
            </Button>
            <Button
              type="button"
              variant={isCancelled ? "outline" : "destructive"}
              onClick={() => setIsCancelled((v) => !v)}
            >
              {isCancelled ? "Uncancel event" : "Cancel event"}
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
