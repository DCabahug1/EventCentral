"use client";

import Link from "next/link";
import { motion } from "motion/react";
import AnalyticsLineChart from "@/components/organizations/analytics/AnalyticsLineChart";
import AnalyticsSectionCard from "@/components/organizations/analytics/AnalyticsSectionCard";
import { formatCount } from "@/lib/utils";
import type { AnalyticsRange, EngagementStats } from "@/lib/types";

type Props = {
  data: EngagementStats;
  range: AnalyticsRange;
};

const monthDayFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

function formatDayLabel(isoDate: string): string {
  const date = new Date(`${isoDate}T00:00:00Z`);
  return monthDayFormatter.format(date);
}

export default function AnalyticsEngagement({ data, range }: Props) {
  const rangeLabel =
    range === "7d"
      ? "last 7 days"
      : range === "all"
        ? "all time"
        : "last 30 days";

  const chartPoints = data.rsvpsByDay.map((p) => ({
    label: formatDayLabel(p.date),
    value: p.count,
  }));

  const maxRsvp = Math.max(
    ...data.topEventsByRsvp.map((e) => e.rsvp_count),
    1,
  );

  return (
    <AnalyticsSectionCard title="Engagement" delay={0.05}>
      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">
          RSVP trend · {rangeLabel}
        </span>
        <AnalyticsLineChart data={chartPoints} unit="RSVPs" />
      </div>

      <div className="border-t" />

      <div className="flex flex-col gap-1">
        <span className="text-xs text-muted-foreground">
          Top RSVPed events
        </span>
        <ul className="flex flex-col">
          {data.topEventsByRsvp.map((event, index) => (
            <motion.li
              key={event.id}
              className="flex items-center gap-3 border-b py-2.5 last:border-b-0"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.2 + index * 0.06,
                ease: [0.2, 0.7, 0.2, 1],
              }}
            >
              <span className="w-4 shrink-0 text-right text-xs text-muted-foreground">
                {index + 1}
              </span>
              <Link
                href={`/events/${event.id}`}
                className="min-w-0 flex-1 truncate text-sm transition-colors hover:text-primary"
              >
                {event.title}
              </Link>
              <div className="h-1 w-24 max-w-[120px] flex-1 bg-muted">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(event.rsvp_count / maxRsvp) * 100}%`,
                  }}
                  transition={{
                    duration: 0.8,
                    delay: 0.3 + index * 0.06,
                    ease: [0.2, 0.7, 0.2, 1],
                  }}
                />
              </div>
              <span className="w-9 shrink-0 text-right text-sm font-semibold tabular-nums">
                {formatCount(event.rsvp_count)}
              </span>
            </motion.li>
          ))}
        </ul>
      </div>
    </AnalyticsSectionCard>
  );
}
