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
  value: string;
  sub?: string;
  accent?: boolean;
};

function StatCard({ stat }: { stat: Stat }) {
  return (
    <div className="flex flex-col gap-1.5 border bg-card p-5 transition-colors hover:border-primary">
      <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
        {stat.label}
      </span>
      <span
        className={cn(
          "text-3xl font-bold leading-none tracking-tight",
          stat.accent ? "text-primary" : "text-foreground",
        )}
      >
        {stat.value}
      </span>
      {stat.sub && (
        <span className="text-xs text-muted-foreground">{stat.sub}</span>
      )}
    </div>
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
      value: totalRsvps.toLocaleString(),
      sub: "across all events",
    },
    {
      label: "Avg Rating",
      value: avgRating.toFixed(1),
      sub: `${totalReviews.toLocaleString()} reviews`,
      accent: true,
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      sub: "profile + event pages",
    },
    {
      label: "Events",
      value: totalEvents.toString(),
      sub: "total published",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} stat={stat} />
      ))}
    </div>
  );
}
