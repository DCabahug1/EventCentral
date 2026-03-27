"use client";
import { useEffect, useState } from "react";
import {
  Map,
  useMap,
  useMapsLibrary,
  AdvancedMarker,
} from "@vis.gl/react-google-maps";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { Event } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";
import { X, ArrowRight } from "lucide-react";

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
  selectedEvent,
}: {
  location?: string;
  radius?: number;
  // Raw lat/lng from geolocation — skips geocoding when present
  coordinates?: { lat: number; lng: number };
  // Whether the current location string came from a validated source
  locationValid?: boolean;
  // When set, the map pans to this event's coordinates
  selectedEvent?: Event | null;
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

  // When an event is selected from the list, pan to its coordinates and zoom in
  useEffect(() => {
    if (!map || !selectedEvent) return;
    map.panTo({ lat: selectedEvent.lat, lng: selectedEvent.lng });
    map.setZoom(14);
  }, [map, selectedEvent]);

  return null;
}

export default function MapView({
  eventCount,
  location,
  radius,
  coordinates,
  locationValid,
  events = [],
  selectedEventId,
  onEventSelect,
  onScrollToEvent,
}: {
  eventCount?: number;
  location?: string;
  radius?: number;
  coordinates?: { lat: number; lng: number };
  locationValid?: boolean;
  events?: Event[];
  // ID of the event selected from the list — triggers map pan
  selectedEventId?: number | null;
  // Callback when a marker is clicked — syncs selection back to the list
  onEventSelect?: (id: number) => void;
  // Callback for the "View in list" button inside the popup — scrolls to the event card
  onScrollToEvent?: (id: number) => void;
}) {
  const { resolvedTheme } = useTheme();
  const colorScheme = resolvedTheme === "dark" ? "DARK" : "LIGHT";

  // Tracks which marker has its popup open (null = no popup)
  const [activeMarkerId, setActiveMarkerId] = useState<number | null>(null);

  const selectedEvent = events.find((e) => e.id === selectedEventId) ?? null;

  // When a new event is selected from the list, open its popup automatically
  useEffect(() => {
    if (selectedEventId != null) setActiveMarkerId(selectedEventId);
  }, [selectedEventId]);

  const handleMarkerClick = (eventId: number) => {
    setActiveMarkerId((prev) => (prev === eventId ? null : eventId));
    onEventSelect?.(eventId);
  };

  return (
    <div className="relative">
      <Map
        defaultCenter={DEFAULT_CENTER}
        defaultZoom={DEFAULT_ZOOM}
        gestureHandling="greedy"
        disableDefaultUI
        clickableIcons={false} // Prevents the default POI popup on city/place taps
        mapId="e55b8d0fe565e63b511edcf7"
        colorScheme={colorScheme}
        className="w-full h-[60svh]"
      >
        {/* Handles all imperative pan/zoom logic — renders no DOM output */}
        <MapViewInner
          location={location}
          radius={radius}
          coordinates={coordinates}
          locationValid={locationValid}
          selectedEvent={selectedEvent}
        />

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

        {/* Event markers — one per event, with an inline custom popup when active */}
        {events.map((event) => {
          const isActive = activeMarkerId === event.id;
          return (
            <AdvancedMarker
              key={event.id}
              position={{ lat: event.lat, lng: event.lng }}
              onClick={() => handleMarkerClick(event.id)}
              zIndex={isActive ? 999 : 1}
            >
              {/* Wrapper keeps the popup and marker aligned on a shared center axis.
                  The popup is absolute so it doesn't shift the AdvancedMarker anchor point. */}
              <div className="relative flex flex-col items-center">
                {/* Custom popup — rendered above the marker when active.
                    Uses bottom-full + mb-3 to float just above the circle. */}
                {isActive && (
                  <div
                    className="absolute bottom-full mb-3 w-56 bg-background border rounded-xl shadow-2xl overflow-hidden z-50 cursor-default!"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Event image header */}
                    <div className="relative h-24 w-full">
                      <img
                        src={event.image_url}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Close button */}
                      <button
                        className="absolute top-2 right-2 size-6 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center hover:bg-background transition-colors cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMarkerId(null);
                        }}
                      >
                        <X className="size-3" />
                      </button>
                    </div>

                    {/* Event details */}
                    <div className="p-3 flex flex-col gap-2">
                      <p className="font-semibold text-sm leading-tight">
                        {event.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDateTime(event.start_time)}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">
                        {event.address}
                      </p>

                      {/* Scroll-to-card button */}
                      <Button
                        size="sm"
                        className="w-full mt-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          onScrollToEvent?.(event.id);
                        }}
                      >
                        View event <ArrowRight className="size-3" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Map pin — circle with image + triangular point at the bottom.
                    Uses Tailwind group so hover on the container drives both
                    the circle border and triangle color simultaneously. */}
                <div className={`group flex flex-col items-center transition-all duration-200 cursor-pointer drop-shadow-lg ${isActive ? "scale-125" : "hover:scale-110"}`}>
                  <div
                    className={`size-11 rounded-full border-[3px] overflow-hidden transition-colors duration-200 ${
                      isActive ? "border-primary" : "border-white group-hover:border-primary"
                    }`}
                  >
                    <img
                      src={event.image_url}
                      alt={event.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Triangle point — color matches the circle border */}
                  <div
                    className={`w-0 h-0 border-x-10 border-x-transparent border-t-12 -mt-[2px] transition-colors duration-200 ${
                      isActive ? "border-t-primary" : "border-t-white group-hover:border-t-primary"
                    }`}
                  />
                </div>
              </div>
            </AdvancedMarker>
          );
        })}
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
