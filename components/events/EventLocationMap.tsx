"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Map, AdvancedMarker } from "@vis.gl/react-google-maps";
import { useTheme } from "next-themes";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Event } from "@/lib/types";

type Props = {
  event: Event & { lat: number; lng: number };
};

export default function EventLocationMap({ event }: Props) {
  const { resolvedTheme } = useTheme();
  const colorScheme = resolvedTheme === "dark" ? "DARK" : "LIGHT";
  const eventImageUrl = event.image_url ?? "/discover-page/Hero.jpg";
  const center = { lat: event.lat, lng: event.lng };
  const [popupOpen, setPopupOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border">
        <Map
          defaultCenter={center}
          defaultZoom={15}
          gestureHandling="greedy"
          disableDefaultUI
          clickableIcons={false}
          mapId="e55b8d0fe565e63b511edcf7"
          colorScheme={colorScheme}
          className="h-full w-full"
        >
          <AdvancedMarker
            position={center}
            onClick={() => setPopupOpen((o) => !o)}
          >
            <div className="relative flex flex-col items-center">
              {popupOpen && (
                <div
                  className="absolute bottom-full mb-3 w-56 bg-background border rounded-xl shadow-2xl overflow-hidden z-50 cursor-default!"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-3 flex flex-col gap-2">
                    <Button size="sm" className="w-full" asChild>
                      <Link href={`/map-view?event=${event.id}`}>
                        View on Map View <ArrowRight className="size-3" />
                      </Link>
                    </Button>
                  </div>
                </div>
              )}
              <div
                className={`group flex flex-col items-center cursor-pointer drop-shadow-lg transition-all duration-200 ${popupOpen ? "scale-125" : "hover:scale-110"}`}
              >
                <div
                  className={`size-11 rounded-full border-[3px] overflow-hidden transition-colors duration-200 ${
                    popupOpen
                      ? "border-primary"
                      : "border-white group-hover:border-primary"
                  }`}
                >
                  <Image
                    src={eventImageUrl}
                    alt={event.title}
                    width={88}
                    height={88}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div
                  className={`w-0 h-0 border-x-10 border-x-transparent border-t-12 -mt-[2px] transition-colors duration-200 ${
                    popupOpen
                      ? "border-t-primary"
                      : "border-t-white group-hover:border-t-primary"
                  }`}
                />
              </div>
            </div>
          </AdvancedMarker>
        </Map>
      </div>
      <Link
        href={`/map-view?event=${event.id}`}
        className="inline-flex items-center gap-1 self-start text-xs text-muted-foreground hover:text-foreground"
      >
        <MapPin className="size-3" />
        Open in Map View
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
}
