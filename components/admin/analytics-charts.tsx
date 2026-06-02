"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Summary = Awaited<ReturnType<typeof import("@/lib/analytics/track").getAnalyticsSummary>>;

const COLORS = ["#8b5cf6", "#a78bfa", "#c4b5fd", "#6366f1", "#818cf8"];

export function AnalyticsCharts({
  daily,
  weekly,
  monthly,
}: {
  daily: Summary;
  weekly: Summary;
  monthly: Summary;
}) {
  const deviceData = Object.entries(weekly.deviceCounts).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <div className="mt-8 space-y-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader><CardTitle className="text-sm">7 Days</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{daily.pageViews}</p>
            <p className="text-xs text-muted-foreground">page views</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">30 Days</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{weekly.pageViews}</p>
            <p className="text-xs text-muted-foreground">{weekly.sessions} sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-sm">90 Days</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{monthly.pageViews}</p>
            <p className="text-xs text-muted-foreground">{monthly.conversionRate}% conversion</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Daily Traffic (30d)</CardTitle></CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekly.daily}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {deviceData.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Devices</CardTitle></CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={deviceData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {deviceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Top Pages</CardTitle></CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {weekly.topPages.map((p) => (
              <li key={p.path} className="flex justify-between text-sm">
                <span>{p.path}</span>
                <span className="font-medium">{p.count}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
