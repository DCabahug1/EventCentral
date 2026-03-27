"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { Badge } from "../ui/badge";

export default function MapView({ eventCount }: { eventCount?: number }) {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <div className="relative">
        <Map
          defaultCenter={{ lat: 39.5, lng: -98.35 }}
          defaultZoom={4}
          gestureHandling="greedy"
          disableDefaultUI
          className="w-full h-[60svh]"
        />
        {eventCount !== undefined && (
          <div className="absolute top-4 right-4 z-10">
            <Badge>{eventCount} events</Badge>
          </div>
        )}
      </div>
    </APIProvider>
  );
}
