import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Target,
  Gauge,
  CheckCircle,
  Filter,
  Loader2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsApi, leadsApi } from '@/api';
import { formatRelativeTime, formatNumber } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';

const iconMap = { Target, Gauge, CheckCircle, Filter };

export default function Dashboard() {
  const { user } = useAuth();
  const { data: projects, isLoading: loadingProjects, error: projectsError } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
    enabled: !!user,
  });
  const activeProject = projects?.[0];

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['project-stats', activeProject?.id],
    queryFn: () => projectsApi.stats(activeProject.id),
    enabled: !!activeProject,
  });

  const { data: leadStats } = useQuery({
    queryKey: ['lead-stats', activeProject?.id],
    queryFn: () => leadsApi.stats(activeProject.id),
    enabled: !!activeProject,
  });

  if (loadingProjects) {
    return <div className="flex justify-center py-20"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>;
  }

  if (projectsError) {
    return (
      <div className="p-6 rounded-lg bg-destructive/10 text-destructive text-sm flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        Failed to load projects. {projectsError.message}
      </div>
    );
  }

  if (!activeProject) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No projects yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first monitoring project to start finding high-intent leads.
        </p>
        <Button variant="gradient" onClick={() => (window.location.href = '/onboarding')}>
          Set up your first project
        </Button>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Matched Posts',
      value: formatNumber(stats?.matched_posts_count ?? 0),
      icon: 'Filter',
      footer: stats?.last_scraper_run_at
        ? `Last scrape ${formatRelativeTime(stats.last_scraper_run_at)}`
        : 'No scraper run yet',
    },
    {
      label: 'Leads',
      value: formatNumber(stats?.leads_count ?? 0),
      icon: 'Target',
      footer: `${formatNumber(leadStats?.new ?? 0)} new · ${formatNumber(leadStats?.contacted ?? 0)} contacted`,
    },
    {
      label: 'Unactioned',
      value: formatNumber(stats?.unactioned_leads_count ?? 0),
      icon: 'Gauge',
      footer: 'Leads awaiting your review',
    },
    {
      label: 'Active Keywords',
      value: formatNumber(stats?.active_keywords_count ?? 0),
      icon: 'CheckCircle',
      footer: `${formatNumber(stats?.active_sources_count ?? 0)} sources monitored`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{activeProject.name}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            {activeProject.goal_description || 'Pipeline performance and lead intelligence overview.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeProject.is_pipeline_active ? (
            <Badge variant="success" className="gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Pipeline Active
            </Badge>
          ) : (
            <Badge variant="warning">Pipeline Inactive</Badge>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => {
          const Icon = iconMap[s.icon];
          return (
            <Card key={s.label} className="hover:border-primary/40 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {s.label}
                  </span>
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </div>
                </div>
                <p className="text-2xl font-bold tabular-nums">{s.value}</p>
                <p className="mt-1.5 text-[11px] text-muted-foreground">{s.footer}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Pipeline funnel */}
      <PipelineFunnel leadStats={leadStats} stats={stats} />

      {/* Lead status distribution */}
      <LeadStatusDistribution leadStats={leadStats} />
    </div>
  );
}

function PipelineFunnel({ leadStats, stats }) {
  const totalLeads = leadStats?.total ?? 0;
  const matched = stats?.matched_posts_count ?? 0;
  const stages = [
    {
      label: 'Raw posts scraped',
      value: matched,
      hint: 'From the Go scraper (Reddit search + subreddit pulls)',
      color: 'bg-indigo-500',
    },
    {
      label: 'Matched posts',
      value: matched,
      hint: 'Passed Stage 1 keyword filter',
      color: 'bg-purple-500',
    },
    {
      label: 'Leads (Stage 2 + 3 passed)',
      value: totalLeads,
      hint: 'Semantic + LLM-scored above threshold',
      color: 'bg-fuchsia-500',
    },
    {
      label: 'Won',
      value: leadStats?.won ?? 0,
      hint: 'Closed-won leads',
      color: 'bg-emerald-500',
    },
  ];
  const max = Math.max(...stages.map((s) => s.value), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <TrendingUp className="h-4 w-4 text-primary" />
          Pipeline Funnel
        </CardTitle>
        <CardDescription className="text-xs">
          3-stage filtering: keyword → semantic → LLM
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {stages.map((s, i) => {
          const width = (s.value / max) * 100;
          const conversion =
            i > 0 && stages[i - 1].value > 0
              ? ((s.value / stages[i - 1].value) * 100).toFixed(0)
              : null;
          return (
            <div key={i}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/80">{s.label}</span>
                <div className="flex items-center gap-2">
                  {conversion && (
                    <span className="text-muted-foreground">{conversion}% pass</span>
                  )}
                  <span className="font-semibold tabular-nums">{formatNumber(s.value)}</span>
                </div>
              </div>
              <div className="h-7 w-full overflow-hidden rounded-md bg-muted">
                <div
                  className={`flex h-full items-center justify-end rounded-md px-2 transition-all duration-500 ${s.color}`}
                  style={{ width: `${Math.max(width, 8)}%` }}
                />
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">{s.hint}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function LeadStatusDistribution({ leadStats }) {
  if (!leadStats) return null;
  const statuses = [
    { key: 'new', label: 'New', color: 'bg-indigo-500' },
    { key: 'reviewed', label: 'Reviewed', color: 'bg-blue-500' },
    { key: 'contacted', label: 'Contacted', color: 'bg-purple-500' },
    { key: 'won', label: 'Won', color: 'bg-emerald-500' },
    { key: 'lost', label: 'Lost', color: 'bg-red-500' },
    { key: 'ignored', label: 'Ignored', color: 'bg-zinc-500' },
  ];
  const total = leadStats.total || 1;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Lead Status Distribution</CardTitle>
        <CardDescription className="text-xs">
          Where your leads are in the funnel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted mb-4">
          {statuses.map((s) => {
            const count = leadStats[s.key] ?? 0;
            if (!count) return null;
            return (
              <div
                key={s.key}
                className={`h-full ${s.color}`}
                style={{ width: `${(count / total) * 100}%` }}
                title={`${s.label}: ${count}`}
              />
            );
          })}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {statuses.map((s) => {
            const count = leadStats[s.key] ?? 0;
            return (
              <div key={s.key} className="flex items-center gap-2">
                <div className={`h-2.5 w-2.5 rounded-full ${s.color}`} />
                <span className="text-xs font-medium text-foreground">{s.label}</span>
                <span className="text-xs text-muted-foreground tabular-nums">{count}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
