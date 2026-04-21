"use client";
import React, { useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { Popover, PopoverAnchor, PopoverContent } from "../ui/popover";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";

type Suggestion = {
  placeId: string;
  description: string;
};

const suggestionItemClass =
  "relative flex w-full cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none select-none focus:bg-accent focus:text-accent-foreground";

// Text input with Google Places region autocomplete.
// Supports countries, states, cities, and neighborhoods.
// Supports read only mode when geolocation is active. Clicking the input
// in that state calls onActivate (which re-enables manual editing) instead of
// opening the suggestions panel.
export default function LocationInput({
  id,
  value,
  onChange,
  readOnly,
  onActivate,
  onValidityChange,
  onPlaceSelect,
  /** Fires for key events when the suggestions list is not handling navigation (e.g. Enter to submit). */
  onInputKeyDown,
  inputClassName,
  placeholder = "City, neighborhood, state, or country",
  /** When true, the trailing map pin is omitted (e.g. parent supplies layout / icons). */
  hideMapPin = false,
  /** Merged onto the popover anchor wrapper (width, flex, rounded, etc.). */
  anchorClassName,
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  onActivate?: () => void;
  onValidityChange?: (valid: boolean) => void;
  onPlaceSelect?: (description: string, placeId: string) => void;
  onInputKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  inputClassName?: string;
  placeholder?: string;
  hideMapPin?: boolean;
  anchorClassName?: string;
}) {
  const placesLib = useMapsLibrary("places");
  const [autocompleteService, setAutocompleteService] =
    useState<google.maps.places.AutocompleteService | null>(null);

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (placesLib) {
      setAutocompleteService(new placesLib.AutocompleteService());
    }
  }, [placesLib]);

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
            })),
          );
          setOpen(true);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      },
    );
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (readOnly) return;
    const val = e.target.value;
    onChange(val);
    onValidityChange?.(val.trim() === "" ? true : false);
    setActiveIndex(-1);
    fetchSuggestions(val);
  };

  const handleSelect = (description: string, placeId: string) => {
    onChange(description);
    onValidityChange?.(true);
    onPlaceSelect?.(description, placeId);
    setSuggestions([]);
    setOpen(false);
    setActiveIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) {
      onInputKeyDown?.(e);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(
        suggestions[activeIndex].description,
        suggestions[activeIndex].placeId,
      );
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const popoverOpen =
    !readOnly && open && suggestions.length > 0;

  return (
    <Popover
      open={popoverOpen}
      onOpenChange={(next) => {
        if (!next) setOpen(false);
      }}
      modal={false}
    >
      <PopoverAnchor asChild>
        <div
          ref={containerRef}
          className={cn("relative w-full", anchorClassName)}
        >
          {!hideMapPin && (
            <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-4 z-10 pointer-events-none" />
          )}
          <Input
            id={id}
            type="text"
            placeholder={placeholder}
            className={inputClassName}
            value={value}
            onChange={handleInputChange}
            onKeyDown={readOnly ? undefined : handleKeyDown}
            onFocus={() => {
              if (readOnly) {
                onActivate?.();
                return;
              }
              suggestions.length > 0 && setOpen(true);
            }}
            readOnly={readOnly}
            autoComplete="off"
          />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        side="bottom"
        sideOffset={4}
        className="w-(--radix-popover-anchor-width) p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
        onCloseAutoFocus={(e) => e.preventDefault()}
      >
        <ul className="max-h-[min(280px,var(--radix-popover-content-available-height))] overflow-y-auto" role="listbox">
          {suggestions.map((s, i) => (
            <li key={s.placeId} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={i === activeIndex}
                className={cn(
                  suggestionItemClass,
                  i === activeIndex
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-accent hover:text-accent-foreground",
                )}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(s.description, s.placeId);
                }}
                onMouseEnter={() => setActiveIndex(i)}
              >
                <MapPin className="size-3 shrink-0 text-muted-foreground" />
                {s.description}
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
