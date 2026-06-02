import { getAnalyticsSummary } from "@/lib/analytics/track";
import { AnalyticsCharts } from "@/components/admin/analytics-charts";

export default async function AdminAnalyticsPage() {
  const [daily, weekly, monthly] = await Promise.all([
    getAnalyticsSummary(7),
    getAnalyticsSummary(30),
    getAnalyticsSummary(90),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold">Analytics</h1>
      <p className="text-muted-foreground">Visitors, sessions, conversions, and traffic sources.</p>
      <AnalyticsCharts daily={daily} weekly={weekly} monthly={monthly} />
    </div>
  );
}
