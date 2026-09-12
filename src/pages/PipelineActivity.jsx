/**
 * PipelineActivity — the live view of your product's data pipeline.
 *
 * Displays full pipeline batch performance metrics:
 *   - Per-batch: pulled, new, dup, matched, and leads created.
 *   - Shows the last 20 batches in a full-width scrollable card layout.
 */
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Activity,
  Loader2,
  Play,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Trophy,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { scraperApi } from '@/api';
import { useProduct } from '@/lib/ProductContext';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import {
  cn,
  formatRelativeTime,
  formatNumber,
} from '@/lib/utils';

const RUNS_LIMIT = 20;

const statusConfig = {
  success: { icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-950/50', label: 'Success' },
  failed: { icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-950/50', label: 'Failed' },
  partial: { icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-950/50', label: 'Partial' },
  running: { icon: Loader2, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-950/50', label: 'Running' },
};

export default function PipelineActivity() {
  const queryClient = useQueryClient();
  const { activeProduct } = useProduct();

  const { data: runs = [], isLoading, refetch } = useQuery({
    queryKey: ['scraper-runs', RUNS_LIMIT],
    queryFn: () => scraperApi.listRuns(RUNS_LIMIT),
    refetchInterval: 30 * 1000,
  });

  const runPipelineMutation = useMutation({
    mutationFn: () => scraperApi.run(),
    onSuccess: () => {
      toast({
        title: 'Pipeline batch started',
        description: 'New matches appear here within 1–2 minutes.',
      });
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['scraper-runs'] }), 3000);
      setTimeout(() => queryClient.invalidateQueries({ queryKey: ['posts'] }), 8000);
    },
    onError: (e) => toastApiError(e, 'Failed to trigger pipeline'),
  });

  const totalItems = runs.reduce((acc, r) => acc + (r.total_items_pulled || 0), 0);
  const totalLeads = runs.reduce((acc, r) => acc + (r.leads_created_count || 0), 0);
  const lastRun = runs[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Pipeline Activity</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            {activeProduct
              ? `Live monitoring for ${activeProduct.name} — what was found and how it was filtered.`
              : 'Create a product to start monitoring.'}
          </p>
        </div>
        <Button
          variant="gradient"
          onClick={() => runPipelineMutation.mutate()}
          disabled={runPipelineMutation.isPending || !activeProduct}
          className="gap-1.5"
        >
          {runPipelineMutation.isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Play className="h-4 w-4" />
          )}
          Run pipeline now
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard icon={Activity} label="Recent batches" value={formatNumber(runs.length)} />
        <SummaryCard
          icon={CheckCircle2}
          label="Total items pulled"
          value={formatNumber(totalItems)}
          color="text-indigo-600"
        />
        <SummaryCard
          icon={Trophy}
          label="Leads created"
          value={formatNumber(totalLeads)}
          color="text-emerald-600"
        />
        <SummaryCard
          icon={Clock}
          label="Last batch"
          value={lastRun ? formatRelativeTime(lastRun.started_at) : '—'}
        />
      </div>

      {/* Batches Table — Full Available Space with Scrollbar */}
      <Card>
        <CardHeader className="flex-row flex items-center justify-between space-y-0">
          <div>
            <CardTitle className="text-sm">Recent batches</CardTitle>
            <CardDescription className="text-xs mt-1">
              Last {RUNS_LIMIT} batches · auto-refreshes every 30s
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refetch()}
            disabled={isLoading}
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin')} />
          </Button>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : runs.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-muted-foreground">No pipeline batches yet.</p>
              <p className="text-xs text-muted-foreground mt-1">
                The next scheduled batch runs within 30 minutes — or hit "Run pipeline now".
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border max-h-[600px] overflow-y-auto scrollbar-thin">
              {runs.map((run) => {
                const cfg = statusConfig[run.status] || statusConfig.running;
                const Icon = cfg.icon;
                return (
                  <div
                    key={run.id}
                    className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition"
                  >
                    {/* Status icon */}
                    <div className={cn('h-9 w-9 rounded-full flex items-center justify-center shrink-0', cfg.bg)}>
                      <Icon className={cn('h-4 w-4', cfg.color, run.status === 'running' && 'animate-spin')} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold capitalize">{run.status}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {formatRelativeTime(run.started_at)}
                        </Badge>
                      </div>
                      {run.error_message ? (
                        <p className="text-xs text-destructive mt-0.5 truncate">
                          {run.error_message}
                        </p>
                      ) : (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Started {new Date(run.started_at).toLocaleString()}
                        </p>
                      )}
                    </div>

                    {/* Full metrics breakdown */}
                    <div className="flex items-center gap-4 sm:gap-6 text-xs">
                      <Count label="pulled" value={run.total_items_pulled} />
                      <Count label="new" value={run.new_items_inserted} className="text-emerald-600" />
                      <Count label="dup" value={run.duplicate_items_skipped} className="text-muted-foreground" />
                      <Count label="matched" value={run.matched_posts_count} className="text-indigo-600" />
                      <Count label="leads" value={run.leads_created_count} className="text-emerald-600" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SummaryCard({ icon: Icon, label, value, color = 'text-foreground' }) {
  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {label}
          </span>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        </div>
        <p className={cn('text-2xl font-bold tabular-nums', color)}>{value}</p>
      </CardContent>
    </Card>
  );
}

function Count({ label, value, className }) {
  return (
    <div className="text-right">
      <p className={cn('text-sm font-bold tabular-nums', className)}>
        {formatNumber(value || 0)}
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
        {label}
      </p>
    </div>
  );
}