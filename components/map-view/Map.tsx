"use client";
import { useEffect, useState } from "react";
import { Map, useMap, useMapsLibrary, AdvancedMarker } from "@vis.gl/react-google-maps";
import { Badge } from "../ui/badge";
import { useTheme } from "next-themes";

// Converts a search radius in miles to an appropriate Google Maps zoom level.
// Clamped to [8, 12] to match the supported radius range of 5–50 miles.
// Formula: 14 - log2(miles) approximates the zoom needed to fit the radius in view.
function radiusToZoom(radiusMiles: number): number {
  return Math.max(8, Math.min(12, Math.round(14 - Math.log2(radiusMiles))));
}

// Default map view — centered on the continental US at a country-wide zoom.
// Used as the fallback when no valid location is set or geocoding fails.
const DEFAULT_CENTER = { lat: 39.5, lng: -98.35 };
const DEFAULT_ZOOM = 4;

// MapViewInner must be rendered as a child of <Map> so it can access the map
// instance via useMap() and lazily load the Geocoding API via useMapsLibrary().
// It has no visual output — it only drives imperative pan/zoom side effects.
function MapViewInner({
  location,
  radius,
  coordinates,
  locationValid,
}: {
  location?: string;
  radius?: number;
  // Raw lat/lng from geolocation — skips geocoding when present
  coordinates?: { lat: number; lng: number };
  // Whether the current location string came from a validated source
  // (autocomplete selection or geolocation). False while the user is typing freely.
  locationValid?: boolean;
}) {
  const map = useMap();

  // Lazily load the Geocoding library only when needed (no upfront bundle cost)
  const geocodingLib = useMapsLibrary("geocoding");
  const [geocoder, setGeocoder] = useState<google.maps.Geocoder | null>(null);

  useEffect(() => {
    if (geocodingLib) setGeocoder(new geocodingLib.Geocoder());
  }, [geocodingLib]);

  // Fast path: when exact coordinates are available (geolocation is active),
  // pan directly without making a geocoding API call.
  useEffect(() => {
    if (!map || !coordinates) return;
    map.panTo(coordinates);
    map.setZoom(radiusToZoom(radius ?? 10));
  }, [map, coordinates, radius]);

  // Geocode fallback: used when a typed/autocompleted location string is set
  // but no raw coordinates are available.
  // - Debounced 400ms to avoid firing a geocode request on every keystroke.
  // - Resets to the default US view if locationValid is false (user is still
  //   typing) or if the geocode returns no results (unrecognized location).
  useEffect(() => {
    if (!map || !geocoder || coordinates) return;
    if (!locationValid || !location) {
      map.panTo(DEFAULT_CENTER);
      map.setZoom(DEFAULT_ZOOM);
      return;
    }
    const timer = setTimeout(() => {
      geocoder.geocode({ address: location }, (results, status) => {
        if (status === "OK" && results?.[0]) {
          const pos = results[0].geometry.location;
          map.panTo({ lat: pos.lat(), lng: pos.lng() });
          map.setZoom(radiusToZoom(radius ?? 10));
        } else {
          // Unrecognized location — reset to default view
          map.panTo(DEFAULT_CENTER);
          map.setZoom(DEFAULT_ZOOM);
        }
      });
    }, 400);
    return () => clearTimeout(timer);
  }, [map, geocoder, location, radius, coordinates, locationValid]);

  return null;
}

export default function MapView({
  eventCount,
  location,
  radius,
  coordinates,
  locationValid,
}: {
  eventCount?: number;
  location?: string;
  radius?: number;
  coordinates?: { lat: number; lng: number };
  locationValid?: boolean;
}) {
  // Mirror the app's light/dark theme on the map surface
  const { resolvedTheme } = useTheme();
  const colorScheme = resolvedTheme === "dark" ? "DARK" : "LIGHT";

  return (
    <div className="relative">
      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false}  // Prevents the default POI popup on city/place taps
        mapId="e55b8d0fe565e63b511edcf7"
        colorScheme={colorScheme}
        className="w-full h-[60svh]"
      >
        {/* Handles all imperative pan/zoom logic — renders no DOM output */}
        <MapViewInner location={location} radius={radius} coordinates={coordinates} locationValid={locationValid} />

        {/* User location marker — shown only when geolocation is active.
            Uses a pulsing blue dot to match the Google Maps "your location" convention. */}
        {coordinates && (
          <AdvancedMarker position={coordinates}>
            <div className="relative flex items-center justify-center size-5">
              <div className="absolute size-5 rounded-full bg-blue-400/40 animate-ping" />
              <div className="relative size-4 rounded-full bg-blue-500 border-2 border-white shadow-md" />
            </div>
          </AdvancedMarker>
        )}
      </Map>

      {/* Event count badge — overlaid on the top-right corner of the map */}
      {eventCount !== undefined && (
        <div className="absolute top-4 right-4 z-10">
          <Badge>{eventCount} events</Badge>
        </div>
      )}
    </div>
  );
}
