import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFeaturedEvents } from "@/lib/eventsServer";
import FeaturedEventsRail from "./FeaturedEventsRail";

export default async function FeaturedEventsSection() {
  const events = await getFeaturedEvents(5);

  return (
    <section className="py-26 md:py-32 border-b border-border/50">
      <div className="max-w-330 mx-auto px-6 md:px-10">
        <div className="flex justify-between items-end gap-6 flex-wrap">
          <h2 className="text-[clamp(32px,5.2vw,64px)] leading-[1.02] tracking-[-0.02em] font-semibold max-w-[18ch]">
            A live feed of{" "}
            <em className="not-italic text-primary">what&apos;s going on.</em>
          </h2>
          <div style={{ marginBottom: "6px" }}>
            <Button variant="outline" asChild>
              <Link href="/discover">
                See All Events
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>

        <FeaturedEventsRail events={events} />
      </div>
    </section>
  );
}
