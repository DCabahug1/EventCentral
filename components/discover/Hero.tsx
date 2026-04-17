"use client";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { X, LoaderCircle, Locate, MapPin, SearchIcon } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { CATEGORY_CONFIG } from "@/lib/categoryConfig";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import LocationInput from "@/components/map-view/LocationInput";
import type { DiscoverRegionBounds } from "@/lib/discoverConstants";
import { Input } from "../ui/input";

function Hero({
  onFindIt,
  onCategorySelect,
  activeCategory,
  input,
  onInputChange,
  onClearSearch,
  locationInput,
  onLocationInputChange,
  useUserLocation,
  onRegionBounds,
  onGeolocationSuccess,
  onToggleGeolocationOff,
  onActivateManualLocation,
  hasActiveFilters,
  canSearch,
}: {
  onFindIt: (keyword: string) => void;
  onCategorySelect: (category: string) => void;
  activeCategory: string;
  input: string;
  onInputChange: (value: string) => void;
  onClearSearch: () => void;
  locationInput: string;
  onLocationInputChange: (value: string) => void;
  useUserLocation: boolean;
  onRegionBounds: (bounds: DiscoverRegionBounds) => void;
  onGeolocationSuccess: (
    coords: { lat: number; lng: number },
    label: string,
  ) => void;
  onToggleGeolocationOff: () => void;
  onActivateManualLocation: () => void;
  /** Keyword, category, or location filter applied — show clear control. */
  hasActiveFilters: boolean;
  /** Enables submitting only when draft filters changed. */
  canSearch: boolean;
}) {
  const [locatingGps, setLocatingGps] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const parallaxY = useTransform(scrollY, [0, 600], ["0%", "50%"]);

  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) setGeocoder(new geocodingLib.Geocoder());
  }, [geocodingLib]);

  const handlePlaceSelect = (_description: string, placeId: string) => {
    if (!geocoder) return;
    geocoder.geocode({ placeId }, (results, status) => {
      if (status === "OK" && results?.[0]) {
        const geo = results[0].geometry;
        const src = geo.viewport ?? geo.bounds;
        if (src) {
          onRegionBounds({
            north: src.getNorthEast().lat(),
            south: src.getSouthWest().lat(),
            east: src.getNorthEast().lng(),
            west: src.getSouthWest().lng(),
          });
        }
      }
    });
  };

  const handleUseMyLocation = () => {
    if (useUserLocation) {
      onToggleGeolocationOff();
      return;
    }
    if (!navigator.geolocation) return;

    setLocatingGps(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;

        if (!geocoder) {
          setLocatingGps(false);
          onGeolocationSuccess({ lat, lng }, "Near you");
          return;
        }

        geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          setLocatingGps(false);
          if (status === "OK" && results?.[0]) {
            const comps = results[0].address_components;
            const city = comps.find((c) =>
              c.types.includes("locality"),
            )?.long_name;
            const state = comps.find((c) =>
              c.types.includes("administrative_area_level_1"),
            )?.short_name;
            const locationStr =
              city && state
                ? `${city}, ${state}`
                : results[0].formatted_address;
            onGeolocationSuccess({ lat, lng }, locationStr);
          } else {
            onGeolocationSuccess({ lat, lng }, "Near you");
          }
        });
      },
      () => {
        setLocatingGps(false);
      },
    );
  };

  const submit = () => {
    if (!canSearch) return;
    onFindIt(input.trim());
  };

  const heroInputClass = "pl-8 h-10 bg-card!";

  return (
    <div
      ref={heroRef}
      className="flex min-h-0 flex-col items-center justify-center gap-3 px-3 py-6 sm:p-4 md:h-[60svh] h-[min(78svh,720px)] relative w-full overflow-hidden"
    >
      <motion.div
        className="absolute inset-x-0 -top-[25%] -z-10 h-[150%]"
        style={{ y: parallaxY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <Image
          src="/discover-page/Hero.jpg"
          alt="EventCentral"
          fill
          className="object-cover object-[center_40%]"
        />
      </motion.div>

      <div className="absolute inset-0 -z-10 bg-linear-to-t from-black/70 to-transparent" />

      <motion.div
        className="flex flex-col items-center gap-3 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight text-white">
          Discover <span className="text-primary">Events</span>
        </h1>
      </motion.div>
      <motion.div
        className="flex w-full max-w-4xl flex-col gap-2 sm:flex-row sm:items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
      >
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
          >
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={onClearSearch}
              className="h-10 w-10 shrink-0"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </Button>
          </motion.div>
        )}
        <div className="flex w-full flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative w-full min-w-0 sm:max-w-md sm:flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search events…"
              value={input}
              onChange={(e) => onInputChange(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              className={heroInputClass}
            />
          </div>
          <div className="flex w-full min-w-0 items-center gap-2 sm:flex-1">
            <div className="relative min-w-0 flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-muted-foreground" />
              <LocationInput
                value={locationInput}
                onChange={onLocationInputChange}
                readOnly={useUserLocation}
                onActivate={onActivateManualLocation}
                onPlaceSelect={handlePlaceSelect}
                onInputKeyDown={(e) => {
                  if (e.key === "Enter") submit();
                }}
                placeholder="City or neighborhood"
                hideMapPin
                anchorClassName="w-full"
                inputClassName={cn(
                  heroInputClass,
                  useUserLocation && "cursor-pointer",
                )}
              />
            </div>
            <Button
              type="button"
              variant="default"
              disabled={locatingGps}
              className={`
                h-10 shrink-0
                ${useUserLocation ? "" : "opacity-50"}
              `}
              onClick={handleUseMyLocation}
            >
              {locatingGps ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Locate className="size-4" />
              )}
              {/* <span className="hidden md:inline">{useUserLocation ? "Stop using your location" : "Use my location"}</span> */}
            </Button>
          </div>
        </div>
        <Button
          type="button"
          variant="default"
          className="h-10 flex-1 sm:flex-initial"
          disabled={!canSearch}
          onClick={submit}
        >
          <SearchIcon className="size-4" />
          Search
        </Button>
      </motion.div>

      <motion.div
        className="flex max-w-full flex-wrap justify-center gap-1.5 px-1 sm:gap-2 sm:px-0"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
      >
        {CATEGORY_CONFIG.map(({ label, icon: Icon, colorClass }) => (
          <Badge
            key={label}
            variant="outline"
            asChild
            className={cn(
              "cursor-pointer rounded-full border border-input bg-card px-3 py-1 text-xs shadow-xs backdrop-blur-lg transition-[color,box-shadow,background-color,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
              activeCategory === label
                ? "border-primary text-primary "
                : "text-foreground/90 hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <button type="button" onClick={() => onCategorySelect(label)}>
              <Icon
                className={
                  activeCategory === label ? "text-primary" : colorClass
                }
              />
              {label}
            </button>
          </Badge>
        ))}
      </motion.div>
    </div>
  );
}

export default Hero;
