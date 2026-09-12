/**
 * PipelineActivity — the live view of your product's data pipeline.
 *
 * Shows what the pipeline found and how it filtered it:
 *   - Per-batch: new matched posts (keyword stage) and how many of those
 *     became leads — nothing about raw/duplicate/error internals.
 *   - Latest matched posts by keyword, ranked by score.
 *
 * NOTE: the runs query uses the SAME key + limit as the Sidebar footer
 * (['scraper-runs', 5]) so react-query caches agree everywhere — this fixes
 * the old bug where a refresh pulled 50 runs and the counts jumped.
 */
import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  Loader2,
  Play,
  CheckCircle2,
  Clock,
  RefreshCw,
  Trophy,
  ArrowRight,
  Search,
  Sparkles,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { scraperApi, postsApi } from '@/api';
import { useProduct } from '@/lib/ProductContext';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import {
  cn,
  formatRelativeTime,
  formatNumber,
  intentToPercent,
} from '@/lib/utils';

const RUNS_LIMIT = 5;

export default function PipelineActivity() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { activeProduct } = useProduct();

  const { data: runs = [], isLoading, refetch } = useQuery({
    queryKey: ['scraper-runs', RUNS_LIMIT],
    queryFn: () => scraperApi.listRuns(RUNS_LIMIT),
    refetchInterval: 30 * 1000,
  });

  // Latest matched posts by keywords for the active product (leads pinned top)
  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', activeProduct?.id, 'pipeline'],
    queryFn: () =>
      postsApi.list({
        project_id: activeProduct?.id,
        page: 1,
        page_size: 10,
        sort_by: 'intent_score',
        sort_desc: true,
      }),
    enabled: !!activeProduct,
  });
  const matchedPosts = postsData?.items || [];

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

  const totalMatched = runs.reduce((acc, r) => acc + (r.matched_posts_count || 0), 0);
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
          icon={Search}
          label="Matched by keywords"
          value={formatNumber(totalMatched)}
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Batches — filtered counts only */}
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
              <div className="divide-y divide-border">
                {runs.map((run) => (
                  <div
                    key={run.id}
                    className="px-5 py-3.5 flex items-center gap-4 hover:bg-muted/30 transition"
                  >
                    {/* Status */}
                    <div
                      className={cn(
                        'h-9 w-9 rounded-full flex items-center justify-center shrink-0',
                        run.status === 'success'
                          ? 'bg-emerald-100 dark:bg-emerald-950/50'
                          : run.status === 'running'
                          ? 'bg-blue-100 dark:bg-blue-950/50'
                          : 'bg-muted'
                      )}
                    >
                      {run.status === 'success' ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Loader2
                          className={cn(
                            'h-4 w-4 text-muted-foreground',
                            run.status === 'running' && 'animate-spin'
                          )}
                        />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold capitalize">{run.status}</span>
                        <Badge variant="outline" className="text-[10px]">
                          {formatRelativeTime(run.started_at)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {formatRelativeTime(run.started_at)} · {new Date(run.started_at).toLocaleTimeString()}
                      </p>
                    </div>

                    {/* Pipeline-relevant counts only: matched + leads */}
                    <div className="flex items-center gap-4 text-xs">
                      <Count label="matched" value={run.matched_posts_count} className="text-indigo-600" />
                      <Count label="leads" value={run.leads_created_count} className="text-emerald-600" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Matched posts by keywords */}
        <Card>
          <CardHeader className="flex-row flex items-center justify-between space-y-0">
            <div>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Search className="h-4 w-4 text-primary" />
                Matched by Keywords
              </CardTitle>
              <CardDescription className="text-xs mt-1">
                {activeProduct ? `Newest matches for ${activeProduct.name}` : ''}
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={() => navigate('/queue')}>
              Queue <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {loadingPosts ? (
              <div className="flex justify-center py-10">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : matchedPosts.length === 0 ? (
              <div className="p-10 text-center">
                <Sparkles className="mx-auto h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">No matched posts yet.</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Matches appear here as soon as the pipeline finds posts with your keywords.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border max-h-[420px] overflow-y-auto scrollbar-thin">
                {matchedPosts.map((post) => (
                  <div
                    key={post.id}
                    className="px-5 py-3 hover:bg-muted/30 transition cursor-pointer"
                    onClick={() => navigate('/queue')}
                  >
                    <div className="flex items-center gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{post.title || '(untitled)'}</p>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                          {post.author || 'unknown'}
                          {post.subreddit ? ` · r/${post.subreddit}` : ''} · matched "
                          {post.matched_keyword}"
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p
                          className={cn(
                            'text-lg font-bold leading-none tabular-nums',
                            post.is_lead ? 'text-emerald-600' : 'text-amber-500/90'
                          )}
                        >
                          {intentToPercent(post.intent_score)}
                        </p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                          score
                        </p>
                      </div>
                    </div>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      {post.is_lead ? (
                        <Badge variant="success" className="text-[10px] gap-1">
                          <Trophy className="h-3 w-3" /> Lead
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-[10px]">
                          Potential match
                        </Badge>
                      )}
                      {post.matched_intent_phrase && (
                        <Badge variant="secondary" className="text-[10px]">
                          "{post.matched_intent_phrase}"
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
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
