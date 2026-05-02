"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AnalyticsRange } from "@/lib/types";

type Props = {
  value: AnalyticsRange;
  onValueChange: (value: AnalyticsRange) => void;
};

const OPTIONS: { value: AnalyticsRange; label: string }[] = [
  { value: "7d", label: "7 days" },
  { value: "30d", label: "30 days" },
  { value: "all", label: "All time" },
];

export default function AnalyticsTimeRange({ value, onValueChange }: Props) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onValueChange(v as AnalyticsRange)}
    >
      <TabsList>
        {OPTIONS.map((o) => (
          <TabsTrigger key={o.value} value={o.value}>
            {o.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
