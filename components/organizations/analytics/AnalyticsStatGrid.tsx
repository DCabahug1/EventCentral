"use client";

import { motion } from "motion/react";
import AnimatedNumber from "@/components/organizations/analytics/AnimatedNumber";
import { cn } from "@/lib/utils";

type Props = {
  totalRsvps: number;
  avgRating: number;
  totalReviews: number;
  totalViews: number;
  totalEvents: number;
};

type Stat = {
  label: string;
  value: number;
  decimals?: number;
  sub?: string;
  accent?: boolean;
};

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  return (
    <motion.div
      className="flex flex-col gap-1.5 border bg-card p-5 transition-colors hover:border-primary"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.2, 0.7, 0.2, 1],
      }}
      whileHover={{ y: -2 }}
    >
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </span>
      <span
        className={cn(
          "text-3xl font-bold leading-none tracking-tight tabular-nums",
          stat.accent ? "text-primary" : "text-foreground",
        )}
      >
        <AnimatedNumber value={stat.value} decimals={stat.decimals ?? 0} />
      </span>
      {stat.sub && (
        <span className="text-xs text-muted-foreground">{stat.sub}</span>
      )}
    </motion.div>
  );
}

export default function AnalyticsStatGrid({
  totalRsvps,
  avgRating,
  totalReviews,
  totalViews,
  totalEvents,
}: Props) {
  const stats: Stat[] = [
    {
      label: "Total RSVPs",
      value: totalRsvps,
      sub: "across all events",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      decimals: 1,
      sub: `${totalReviews.toLocaleString()} reviews`,
      accent: true,
    },
    {
      label: "Total Views",
      value: totalViews,
      sub: "organization + event pages",
    },
    {
      label: "Events",
      value: totalEvents,
      sub: "total published",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <StatCard key={stat.label} stat={stat} index={i} />
      ))}
    </div>
  );
}
