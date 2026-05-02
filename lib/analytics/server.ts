"use server";
import { createClient } from "../supabase/server";
import type {
  AnalyticsRange,
  EngagementStats,
  ReachStats,
  ReviewStats,
} from "../types";

const DAY_MS = 24 * 60 * 60 * 1000;

function rangeStartIso(range: AnalyticsRange): string | null {
  if (range === "all") return null;
  const days = range === "7d" ? 7 : 30;
  return new Date(Date.now() - days * DAY_MS).toISOString();
}

function isoDateKey(iso: string): string {
  return iso.slice(0, 10);
}

function inclusiveDateKeysForRange(range: AnalyticsRange): string[] {
  if (range === "all") return [];
  const days = range === "7d" ? 7 : 30;
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const out: string[] = [];
  for (let i = days - 1; i >= 0; i--) {
    out.push(new Date(today.getTime() - i * DAY_MS).toISOString().slice(0, 10));
  }
  return out;
}

export async function getEngagementStats(
  orgId: number,
  range: AnalyticsRange,
): Promise<EngagementStats> {
  const supabase = await createClient();

  const { data: orgEventsData } = await supabase
    .from("events")
    .select("id, title, rsvp_count")
    .eq("organization_id", orgId);
  const orgEvents = orgEventsData ?? [];
  const eventIds = orgEvents.map((e) => e.id as number);

  if (eventIds.length === 0) {
    return {
      totalConfirmedRsvps: 0,
      rsvpsByDay: inclusiveDateKeysForRange(range).map((date) => ({
        date,
        count: 0,
      })),
      topEventsByRsvp: [],
    };
  }

  const start = rangeStartIso(range);
  let rsvpQuery = supabase
    .from("rsvps")
    .select("created_at")
    .in("event_id", eventIds)
    .eq("status", "CONFIRMED");
  if (start) rsvpQuery = rsvpQuery.gte("created_at", start);

  const { data: rsvps } = await rsvpQuery;
  const confirmed = rsvps ?? [];

  const counts = new Map<string, number>();
  for (const r of confirmed) {
    const key = isoDateKey(r.created_at as string);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const dayKeys = inclusiveDateKeysForRange(range);
  const rsvpsByDay = dayKeys.length
    ? dayKeys.map((date) => ({ date, count: counts.get(date) ?? 0 }))
    : Array.from(counts.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, count]) => ({ date, count }));

  const topEventsByRsvp = orgEvents
    .map((e) => ({
      id: e.id as number,
      title: e.title as string,
      rsvp_count: (e.rsvp_count as number | null) ?? 0,
    }))
    .sort((a, b) => b.rsvp_count - a.rsvp_count)
    .slice(0, 3);

  return {
    totalConfirmedRsvps: confirmed.length,
    rsvpsByDay,
    topEventsByRsvp,
  };
}

export async function getReviewStats(
  orgId: number,
  range: AnalyticsRange,
): Promise<ReviewStats> {
  const supabase = await createClient();

  const { data: orgEventsData } = await supabase
    .from("events")
    .select("id, title")
    .eq("organization_id", orgId);
  const orgEvents = orgEventsData ?? [];
  const eventIds = orgEvents.map((e) => e.id as number);
  const titleByEventId = new Map<number, string>(
    orgEvents.map((e) => [e.id as number, e.title as string]),
  );

  const emptyDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: 0,
  }));

  if (eventIds.length === 0) {
    return {
      averageRating: 0,
      totalReviews: 0,
      ratingDistribution: emptyDistribution,
      recentReviews: [],
    };
  }

  const start = rangeStartIso(range);
  let reviewQuery = supabase
    .from("reviews")
    .select("id, event_id, rating, content, created_at, user_id")
    .in("event_id", eventIds)
    .order("created_at", { ascending: false });
  if (start) reviewQuery = reviewQuery.gte("created_at", start);

  const { data: rawReviews } = await reviewQuery;
  const reviews = rawReviews ?? [];
  const totalReviews = reviews.length;

  const averageRating =
    totalReviews === 0
      ? 0
      : Math.round(
          (reviews.reduce((sum, r) => sum + (r.rating as number), 0) /
            totalReviews) *
            10,
        ) / 10;

  const distMap = new Map<number, number>([
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
  ]);
  for (const r of reviews) {
    const rating = r.rating as number;
    if (distMap.has(rating)) {
      distMap.set(rating, (distMap.get(rating) ?? 0) + 1);
    }
  }
  const ratingDistribution = [1, 2, 3, 4, 5].map((rating) => ({
    rating,
    count: distMap.get(rating) ?? 0,
  }));

  const top3 = reviews.slice(0, 3);
  const userIds = [...new Set(top3.map((r) => r.user_id as string))];

  let profileMap = new Map<
    string,
    { username: string | null; avatar_url: string | null }
  >();
  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("user_id, username, avatar_url")
      .in("user_id", userIds);
    profileMap = new Map(
      (profiles ?? []).map((p) => [
        p.user_id as string,
        {
          username: p.username as string | null,
          avatar_url: p.avatar_url as string | null,
        },
      ]),
    );
  }

  const recentReviews = top3.map((r) => ({
    id: r.id as number,
    event_id: r.event_id as number,
    event_title: titleByEventId.get(r.event_id as number) ?? "",
    rating: r.rating as number,
    content: r.content as string | null,
    created_at: r.created_at as string,
    username: profileMap.get(r.user_id as string)?.username ?? null,
    avatar_url: profileMap.get(r.user_id as string)?.avatar_url ?? null,
  }));

  return {
    averageRating,
    totalReviews,
    ratingDistribution,
    recentReviews,
  };
}

export async function getReachStats(
  orgId: number,
  range: AnalyticsRange,
): Promise<ReachStats> {
  const supabase = await createClient();
  const start = rangeStartIso(range);

  const { data: orgEventsData } = await supabase
    .from("events")
    .select("id, title")
    .eq("organization_id", orgId);
  const orgEvents = orgEventsData ?? [];
  const eventIds = orgEvents.map((e) => e.id as number);
  const titleByEventId = new Map<number, string>(
    orgEvents.map((e) => [e.id as number, e.title as string]),
  );

  let orgViewsQuery = supabase
    .from("page_views")
    .select("id", { count: "exact", head: true })
    .eq("entity_type", "organization")
    .eq("entity_id", orgId);
  if (start) orgViewsQuery = orgViewsQuery.gte("viewed_at", start);
  const { count: orgViewsCount } = await orgViewsQuery;
  const orgProfileViews = orgViewsCount ?? 0;

  if (eventIds.length === 0) {
    return {
      orgProfileViews,
      totalEventViews: 0,
      viewsPerEvent: [],
    };
  }

  let eventViewsQuery = supabase
    .from("page_views")
    .select("entity_id")
    .eq("entity_type", "event")
    .in("entity_id", eventIds);
  if (start) eventViewsQuery = eventViewsQuery.gte("viewed_at", start);
  const { data: eventViewRows } = await eventViewsQuery;
  const eventViews = eventViewRows ?? [];

  const totalEventViews = eventViews.length;
  const viewCounts = new Map<number, number>();
  for (const row of eventViews) {
    const id = row.entity_id as number;
    viewCounts.set(id, (viewCounts.get(id) ?? 0) + 1);
  }

  const viewsPerEvent = [...viewCounts.entries()]
    .map(([eventId, views]) => ({
      eventId,
      title: titleByEventId.get(eventId) ?? "",
      views,
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  return {
    orgProfileViews,
    totalEventViews,
    viewsPerEvent,
  };
}

export async function logPageView(
  entityType: "event" | "organization",
  entityId: number,
): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("page_views").upsert(
    {
      entity_type: entityType,
      entity_id: entityId,
      user_id: user.id,
      viewed_at: new Date().toISOString(),
    },
    { onConflict: "entity_type,entity_id,user_id" },
  );
}
