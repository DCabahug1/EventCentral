import { notFound, redirect } from "next/navigation";
import AnalyticsPageContent from "@/components/organizations/analytics/AnalyticsPageContent";
import { createClient } from "@/lib/supabase/server";
import {
  getEngagementStats,
  getReachStats,
  getReviewStats,
} from "@/lib/analyticsServer";
import type { AnalyticsRange } from "@/lib/types";

type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ range?: string }>;
};

function parseRange(value: string | undefined): AnalyticsRange {
  if (value === "7d" || value === "30d" || value === "all") return value;
  return "30d";
}

export default async function Page({ params, searchParams }: PageProps) {
  const [{ id: idParam }, { range: rangeParam }] = await Promise.all([
    params,
    searchParams,
  ]);
  const orgId = Number(idParam);
  if (!Number.isFinite(orgId)) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: org } = await supabase
    .from("organizations")
    .select("user_id, name")
    .eq("id", orgId)
    .single();

  if (!org || org.user_id !== user.id) redirect("/");

  const range = parseRange(rangeParam);

  const [engagement, reviews, reach, totalEventsResult] = await Promise.all([
    getEngagementStats(orgId, range),
    getReviewStats(orgId, range),
    getReachStats(orgId, range),
    supabase
      .from("events")
      .select("id", { count: "exact", head: true })
      .eq("organization_id", orgId),
  ]);

  return (
    <AnalyticsPageContent
      orgId={orgId}
      orgName={org.name as string}
      range={range}
      totalEvents={totalEventsResult.count ?? 0}
      engagement={engagement}
      reviews={reviews}
      reach={reach}
    />
  );
}
