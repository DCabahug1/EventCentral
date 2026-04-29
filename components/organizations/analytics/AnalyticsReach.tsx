import AnalyticsBarChart from "@/components/organizations/analytics/AnalyticsBarChart";
import AnalyticsSectionCard from "@/components/organizations/analytics/AnalyticsSectionCard";
import type { ReachStats } from "@/lib/types";

type Props = {
  data: ReachStats;
};

type ReachStat = {
  label: string;
  value: string;
  note: string;
};

export default function AnalyticsReach({ data }: Props) {
  const stats: ReachStat[] = [
    {
      label: "Total Organization views",
      value: data.orgProfileViews.toLocaleString(),
      note: "unique visits to this organization's page",
    },
    {
      label: "Total event page views",
      value: data.totalEventViews.toLocaleString(),
      note: "across all events under this organization",
    },
  ];

  const chartData = data.viewsPerEvent.map((e) => ({
    label: e.title,
    value: e.views,
  }));

  return (
    <AnalyticsSectionCard title="Reach">
      <div className="flex flex-col sm:flex-row">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={
              index === 0
                ? "flex flex-1 flex-col gap-1.5 px-5 py-4 sm:pl-0"
                : "flex flex-1 flex-col gap-1.5 border-t px-5 py-4 sm:border-l sm:border-t-0"
            }
          >
            <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {stat.label}
            </div>
            <div className="text-3xl font-bold leading-none tracking-tight">
              {stat.value}
            </div>
            <div className="text-xs text-muted-foreground/60">{stat.note}</div>
          </div>
        ))}
      </div>

      <div className="border-t" />

      <div className="flex flex-col gap-3">
        <span className="text-xs text-muted-foreground">
          Views by event — top 5
        </span>
        <AnalyticsBarChart data={chartData} unit="views" />
      </div>
    </AnalyticsSectionCard>
  );
}
