import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { getAnalyticsSummary } from "@/lib/analytics/track";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, TrendingUp, FileText } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await auth();
  const [leadsCount, postsCount, analytics] = await Promise.all([
    prisma.lead.count(),
    prisma.blogPost.count({ where: { status: "PUBLISHED" } }),
    getAnalyticsSummary(30),
  ]);

  const stats = [
    { label: "Total Leads", value: leadsCount, icon: Users },
    { label: "Page Views (30d)", value: analytics.pageViews, icon: Eye },
    { label: "Sessions (30d)", value: analytics.sessions, icon: TrendingUp },
    { label: "Blog Posts", value: postsCount, icon: FileText },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="text-muted-foreground">Welcome back, {session?.user?.email}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stat.value}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-bold gradient-text">{analytics.conversionRate}%</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {analytics.conversions} conversions from {analytics.pageViews} page views
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
