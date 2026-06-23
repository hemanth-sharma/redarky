import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { intentDistribution } from '@/data/mockData';

const barColors = ['#EF4444', '#F59E0B', '#F59E0B', '#10B981', '#10B981'];

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-md">
        <p className="font-medium text-foreground">
          Intent {label}: {payload[0].value} leads
        </p>
      </div>
    );
  }
  return null;
}

export default function IntentDistributionChart() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Intent Score Distribution
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Leads generated today by score range
        </p>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={intentDistribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            vertical={false}
            stroke="hsl(var(--border))"
          />
          <XAxis
            dataKey="range"
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: 'hsl(var(--muted))', opacity: 0.3 }}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {intentDistribution.map((_, idx) => (
              <Cell key={idx} fill={barColors[idx]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}