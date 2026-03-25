"use client";
import { APIProvider, Map } from "@vis.gl/react-google-maps";

export default function MapView() {
  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        defaultCenter={{ lat: 39.5, lng: -98.35 }}
        defaultZoom={4}
        gestureHandling="greedy"
        disableDefaultUI
        className="w-full h-full"
      />
    </APIProvider>
  );
}
