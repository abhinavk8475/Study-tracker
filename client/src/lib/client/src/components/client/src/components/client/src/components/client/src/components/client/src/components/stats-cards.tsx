import { Clock, Calendar, TrendingUp, BookOpen, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { formatDurationReadable } from "@/lib/utils";
import type { OverallStats } from "@shared/schema";

interface StatsCardsProps {
  stats: OverallStats;
  isLoading?: boolean;
}

export function StatsCards({ stats, isLoading }: StatsCardsProps) {
  const statItems = [
    {
      label: "Today",
      value: formatDurationReadable(stats.todayDuration),
      icon: Clock,
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      label: "This Week",
      value: formatDurationReadable(stats.weekDuration),
      icon: Calendar,
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      label: "This Month",
      value: formatDurationReadable(stats.monthDuration),
      icon: TrendingUp,
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      label: "Total Sessions",
      value: stats.totalSessions.toString(),
      icon: BookOpen,
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
    {
      label: "Day Streak",
      value: `${stats.currentStreak} days`,
      icon: Flame,
      color: "text-chart-5",
      bgColor: "bg-chart-5/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <Card key={i} className="overflow-visible">
            <CardContent className="p-6">
              <div className="animate-pulse">
                <div className="h-10 w-10 rounded-lg bg-muted mb-3" />
                <div className="h-7 w-16 bg-muted rounded mb-1" />
                <div className="h-4 w-12 bg-muted rounded" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {statItems.map((item, index) => (
        <Card key={item.label} className="overflow-visible hover-elevate">
          <CardContent className="p-6">
            <div className={`h-10 w-10 rounded-lg ${item.bgColor} flex items-center justify-center mb-3`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <div className="text-2xl font-bold mb-1" data-testid={`text-stat-value-${index}`}>
              {item.value}
            </div>
            <div className="text-sm text-muted-foreground">{item.label}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
