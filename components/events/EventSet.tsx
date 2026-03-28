import { useState, useRef, useEffect } from "react";
import { Event } from "@/lib/types";
import EventCard from "./EventCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

function EventSet({ events }: { events: Event[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollButtons = () => {
    const container = scrollContainerRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 8);
    setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth - 8);
  };

  // Update button visibility on mount and whenever the container is resized
  // (e.g. window resize, or when the event count changes).
  useEffect(() => {
    updateScrollButtons();
    const container = scrollContainerRef.current;
    if (!container) return;
    const resizeObserver = new ResizeObserver(updateScrollButtons);
    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [events]);

  const scrollBy = (direction: number) => {
    scrollContainerRef.current?.scrollBy({ left: direction * 500, behavior: "smooth" });
  };

  return (
    <div className="relative w-full">
      {/* Left fade + button */}
      {canScrollLeft && (
        <>
          <div className="absolute left-0 top-0 bottom-0 w-16 bg-linear-to-r from-background to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scrollBy(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Right fade + button */}
      {canScrollRight && (
        <>
          <div className="absolute right-0 top-0 bottom-0 w-16 bg-linear-to-l from-background to-transparent z-10 pointer-events-none" />
          <button
            onClick={() => scrollBy(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-background border border-border shadow-md flex items-center justify-center hover:bg-muted transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </>
      )}

      {/* Scrollable strip */}
      <div
        ref={scrollContainerRef}
        onScroll={updateScrollButtons}
        className="flex gap-4 overflow-x-auto pr-16 pb-2 scrollbar-none"
        style={{ scrollbarWidth: "none" }}
      >
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
}

export default EventSet;
