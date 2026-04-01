"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Input } from "../ui/input";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

type Suggestion = {
  placeId: string;
  description: string;
};

// Text input with Google Places region autocomplete.
// Supports countries, states, cities, and neighborhoods.
// Supports a read-only mode for when geolocation is active — clicking the input
// in that state calls onActivate (which re-enables manual editing) instead of
// opening the dropdown.
export default function LocationInput({
  value,
  onChange,
  // When true, the input is locked and shows the geolocated city name
  readOnly,
  // Called when the user clicks/focuses the input while readOnly is true —
  // signals the parent to disable geolocation and restore manual editing
  onActivate,
  // Called false when the user starts typing (unvalidated),
  // called true when the user selects a suggestion (validated city)
  onValidityChange,
  // Called when the user selects a suggestion — passes the display text and
  // place ID so the parent can geocode the selection to lat/lng coordinates
  onPlaceSelect,
}: {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onActivate?: () => void;
  onValidityChange?: (valid: boolean) => void;
  onPlaceSelect?: (description: string, placeId: string) => void;
}) {
  // Lazily load the Places library — only fetched when this component mounts
  const placesLib = useMapsLibrary("places");
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  // Tracks the keyboard-highlighted suggestion index (-1 = none)
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (placesLib) {
      setAutocompleteService(new placesLib.AutocompleteService());
    }
  }, [placesLib]);

  // Close the dropdown when the user clicks outside the input container
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetches region suggestions (countries, states, cities, neighborhoods) from
  // the Places Autocomplete API. Uses the "geocode" type to include geographic
  // areas while excluding businesses. Requires at least 2 characters.
  const fetchSuggestions = (input: string) => {
    if (!autocompleteService || input.trim().length < 2) {
      setSuggestions([]);
      setOpen(false);
      return;
    }
    autocompleteService.getPlacePredictions(
      { input, types: ["geocode"] },
      (predictions, status) => {
        if (
          status === google.maps.places.PlacesServiceStatus.OK &&
          predictions
        ) {
          setSuggestions(
            predictions.slice(0, 5).map((p) => ({
              placeId: p.place_id,
              description: p.description,
            }))
          );
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      }
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const val = e.target.value;
    onChange(val);
    // Mark as unvalidated while the user is typing freely
    onValidityChange?.(false);
    setActiveIndex(-1);
    fetchSuggestions(val);
  };

  // Selecting a suggestion confirms it as a valid city
  const handleSelect = (description: string, placeId: string) => {
    onChange(description);
    onValidityChange?.(true);
    onPlaceSelect?.(description, placeId);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  // Keyboard navigation for the suggestions dropdown
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex].description, suggestions[activeIndex].placeId);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4 z-10 pointer-events-none" />
      <Input
        placeholder="City, neighborhood, state, or country"
        className={cn("pr-10", readOnly && "cursor-pointer text-muted-foreground")}
        value={value}
        onChange={handleInputChange}
        onKeyDown={readOnly ? undefined : handleKeyDown}
        onFocus={() => {
          // While locked by geolocation, focusing re-enables manual editing
          if (readOnly) { onActivate?.(); return; }
          suggestions.length > 0 && setOpen(true);
        }}
        readOnly={readOnly}
        autoComplete="off"
      />

      {/* Suggestions dropdown */}
      {open && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 z-50 mt-1 bg-background border rounded-md shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={s.placeId}
              className={cn(
                "flex items-center gap-2 px-3 py-2 text-sm cursor-pointer select-none",
                i === activeIndex
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent hover:text-accent-foreground"
              )}
              onMouseDown={(e) => {
                // Prevent blur from firing before the click registers
                e.preventDefault();
                handleSelect(s.description, s.placeId);
              }}
              onMouseEnter={() => setActiveIndex(i)}
            >
              <MapPin className="size-3 shrink-0 text-muted-foreground" />
              {s.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
