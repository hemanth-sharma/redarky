import React from 'react';
import {
  Target,
  Gauge,
  CheckCircle,
  Filter,
  TrendingUp } from
'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import PipelineFunnel from '@/components/dashboard/PipelineFunnel';
import IntentDistributionChart from '@/components/dashboard/IntentDistributionChart';
import AIVisibilityTracker from '@/components/dashboard/AIVisibilityTracker';
import RecentActivity from '@/components/dashboard/RecentActivity';
import { dashboardStats, recentActivity, topKeywords } from '@/data/mockData';

const iconMap = { Target, Gauge, CheckCircle, Filter };

export default function Dashboard() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6 md:py-8">
      <p className="mb-6 text-[hsl(var(--foreground))] text-xl">Pipeline performance and lead intelligence overview for today.

      </p>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dashboardStats.map((stat) =>
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
          change={stat.change}
          changeType={stat.changeType}
          icon={iconMap[stat.icon]}
          progress={stat.progress}
          footer={stat.footer} />

        )}
      </div>

      {/* Charts row */}
      <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PipelineFunnel />
        <IntentDistributionChart />
      </div>

      {/* AI Visibility */}
      <div className="mb-6">
        <AIVisibilityTracker />
      </div>

      {/* Bottom row: Recent activity + Top keywords */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <RecentActivity activities={recentActivity} />
        </div>
        <div className="lg:col-span-2">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-semibold text-foreground">
                Top Keywords
              </h3>
            </div>
            <div className="space-y-3">
              {topKeywords.map((kw, idx) =>
              <div key={idx}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-foreground">
                      {kw.keyword}
                    </span>
                    <span className="text-muted-foreground">
                      {kw.leads} leads · avg {kw.avg_intent}
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                    className="h-full rounded-full gradient-accent"
                    style={{ width: `${kw.avg_intent / 100 * 100}%` }} />
                  
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>);

}