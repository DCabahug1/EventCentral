import { describe, it, expect } from "vitest";
import { getEventStatus, EVENT_STATUS_CONFIG } from "@/lib/events/status";
import type { Event } from "@/lib/types";

function makeEvent(overrides: Partial<Event> = {}): Event {
  const now = Date.now();
  return {
    id: 1,
    organization_id: null,
    organization_name: null,
    rsvp_count: null,
    user_id: "u1",
    title: "Test Event",
    description: null,
    start_time: new Date(now + 60 * 60 * 1000).toISOString(),
    end_time: new Date(now + 2 * 60 * 60 * 1000).toISOString(),
    address: null,
    lat: null,
    lng: null,
    max_capacity: null,
    image_url: null,
    category: null,
    CANCELLED: false,
    created_at: new Date(now - 60 * 60 * 1000).toISOString(),
    updated_at: new Date(now - 60 * 60 * 1000).toISOString(),
    ...overrides,
  };
}

describe("getEventStatus", () => {
  it("returns CANCELLED when CANCELLED is true", () => {
    expect(getEventStatus(makeEvent({ CANCELLED: true }))).toBe("CANCELLED");
  });

  it("returns UPCOMING when start is in the future", () => {
    expect(getEventStatus(makeEvent())).toBe("UPCOMING");
  });

  it("returns STARTED when start is past but end is future", () => {
    const now = Date.now();
    expect(
      getEventStatus(
        makeEvent({
          start_time: new Date(now - 30 * 60 * 1000).toISOString(),
          end_time: new Date(now + 30 * 60 * 1000).toISOString(),
        }),
      ),
    ).toBe("STARTED");
  });

  it("returns ENDED when both start and end are in the past", () => {
    const now = Date.now();
    expect(
      getEventStatus(
        makeEvent({
          start_time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now - 60 * 60 * 1000).toISOString(),
        }),
      ),
    ).toBe("ENDED");
  });

  it("CANCELLED=true overrides past times", () => {
    const now = Date.now();
    expect(
      getEventStatus(
        makeEvent({
          CANCELLED: true,
          start_time: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
          end_time: new Date(now - 60 * 60 * 1000).toISOString(),
        }),
      ),
    ).toBe("CANCELLED");
  });
});

describe("EVENT_STATUS_CONFIG", () => {
  it("has all four status keys", () => {
    const keys = Object.keys(EVENT_STATUS_CONFIG).sort();
    expect(keys).toEqual(["CANCELLED", "ENDED", "STARTED", "UPCOMING"]);
  });

  it("UPCOMING label is 'Upcoming'", () => {
    expect(EVENT_STATUS_CONFIG.UPCOMING.label).toBe("Upcoming");
  });

  it("STARTED label is 'Live'", () => {
    expect(EVENT_STATUS_CONFIG.STARTED.label).toBe("Live");
  });

  it("every entry has a non-empty className", () => {
    for (const { className } of Object.values(EVENT_STATUS_CONFIG)) {
      expect(className.length).toBeGreaterThan(0);
    }
  });
});
