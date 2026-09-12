/**
 * Dashboard — the actionable lead HQ for the active product.
 *
 * Not a passive analytics page: every number here is a door.
 *   - Stat cards deep-link into the Action Queue
 *   - Top Leads preview (highest intent first) with one-click "Review"
 *   - Matched Posts by keywords — leads pinned on top, sorted by score
 *   - Live 3-stage funnel (keyword → semantic → LLM agent → leads → won)
 * No "scraper" vocabulary anywhere — this is a live monitoring product.
 */
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  Target,
  Gauge,
  CheckCircle,
  Filter,
  Loader2,
  TrendingUp,
  Trophy,
  FileText,
  ArrowRight,
  Sparkles,
  Bot,
  Search,
  Radar,
  MessageSquareText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { projectsApi, leadsApi, postsApi } from '@/api';
import {
  cn,
  formatRelativeTime,
  formatNumber,
  intentToPercent,
  intentTier,
} from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { useProduct } from '@/lib/ProductContext';

const iconMap = { Target, Gauge, CheckCircle, Filter, Bot };

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeProduct, loadingProjects } = useProduct();

  const { data: stats, isLoading: loadingStats } = useQuery({
    queryKey: ['project-stats', activeProduct?.id],
    queryFn: () => projectsApi.stats(activeProduct.id),
    enabled: !!activeProduct,
  });

  const { data: leadStats } = useQuery({
    queryKey: ['lead-stats', activeProduct?.id],
    queryFn: () => leadsApi.stats(activeProduct.id),
    enabled: !!activeProduct,
  });

  // Top leads for the active product (backend sorts by intent score desc)
  const { data: leadsData, isLoading: loadingLeads } = useQuery({
    queryKey: ['leads', activeProduct?.id],
    queryFn: () => leadsApi.list({ project_id: activeProduct.id, page: 1, page_size: 5 }),
    enabled: !!activeProduct,
  });
  const topLeads = leadsData?.items || [];

  // Matched posts by keywords — leads float on top, then by score
  const { data: postsData, isLoading: loadingPosts } = useQuery({
    queryKey: ['posts', activeProduct?.id, 'dashboard'],
    queryFn: () =>
      postsApi.list({
        project_id: activeProduct.id,
        page: 1,
        page_size: 8,
        sort_by: 'intent_score',
        sort_desc: true,
      }),
    enabled: !!activeProduct,
  });
  const matchedPosts = (postsData?.items || []).filter((p) => !p.is_lead);

  if (loadingProjects) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!activeProduct) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold mb-2">No products yet</h2>
        <p className="text-muted-foreground mb-6">
          Create your first product to start finding high-intent leads.
        </p>
        <Button variant="gradient" onClick={() => navigate('/onboarding')}>
          Set up your first product
        </Button>
      </div>
    );
  }

  const statsCards = [
    {
      label: 'Leads',
      value: formatNumber(stats?.leads_count ?? 0),
      icon: 'Target',
      footer: `${formatNumber(leadStats?.new ?? 0)} new · ${formatNumber(leadStats?.contacted ?? 0)} contacted`,
      onClick: () => navigate('/queue'),
    },
    {
      label: 'Needs Review',
      value: formatNumber(stats?.unactioned_leads_count ?? 0),
      icon: 'Gauge',
      footer: 'Leads awaiting your first action',
      onClick: () => navigate('/queue'),
    },
    {
      label: 'Matched Posts',
      value: formatNumber(stats?.matched_posts_count ?? 0),
      icon: 'Filter',
      footer: stats?.last_activity_at
        ? `Latest match ${formatRelativeTime(stats.last_activity_at)}`
        : 'Waiting for the first batch',
      onClick: () => navigate('/queue'),
    },
    {
      label: 'Avg Intent',
      value: stats?.avg_intent_score != null ? intentToPercent(stats.avg_intent_score) : '—',
      icon: 'Bot',
      footer: `${formatNumber(stats?.llm_checked_count ?? 0)} graded by the AI agent`,
      onClick: () => navigate('/scraper-activity'),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className="text-2xl font-bold tracking-tight">{activeProduct.name}</h2>
            {activeProduct.is_pipeline_active ? (
              <Badge variant="success" className="gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Pipeline Active
              </Badge>
            ) : (
              <Badge variant="warning">Pipeline Paused</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            {activeProduct.goal_description || 'Lead intelligence overview for this product.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate('/scraper-activity')}>
            <Radar className="h-4 w-4 mr-1.5" /> Pipeline Activity
          </Button>
          <Button variant="gradient" size="sm" onClick={() => navigate('/queue')}>
            <Target className="h-4 w-4 mr-1.5" /> Open Action Queue
          </Button>
        </div>
      </div>

      {/* Stat cards — every card is a link into the workflow */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((s) => {
          const Icon = iconMap[s.icon];
          return (
            <Card
              key={s.label}
              className="hover:border-primary/40 transition-colors cursor-pointer group"
              onClick={s.onClick}
            >
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
                <p className="mt-1.5 text-[11px] text-muted-foreground flex items-center gap-1">
                  {s.footer}
                  <ArrowRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two-column: Top leads + matched posts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TopLeadsCard
          leads={topLeads}
          isLoading={loadingLeads}
          onReview={() => navigate('/queue')}
        />
        <MatchedPostsCard
          posts={matchedPosts}
          isLoading={loadingPosts}
          onViewAll={() => navigate('/queue')}
        />
      </div>

      {/* Pipeline funnel + lead status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <PipelineFunnel leadStats={leadStats} stats={stats} />
        <LeadStatusDistribution leadStats={leadStats} />
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Top leads preview
// ────────────────────────────────────────────────────────────────────────────
function TopLeadsCard({ leads, isLoading, onReview }) {
  return (
    <Card>
      <CardHeader className="flex-row flex items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Trophy className="h-4 w-4 text-emerald-500" />
            Top Leads
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Passed all 3 filtering stages — highest intent first
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onReview}>
          Review all <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <LoadingRows />
        ) : leads.length === 0 ? (
          <EmptyCard
            icon={<Sparkles className="h-5 w-5 text-muted-foreground" />}
            title="No leads yet"
            body="The AI agent hasn't confirmed a lead for this product yet. Matches appear in the queue the moment they're found."
          />
        ) : (
          <div className="divide-y divide-border">
            {leads.map((lead) => {
              const tier = intentTier(lead.intent_score);
              return (
                <div
                  key={lead.id}
                  className="px-5 py-3.5 hover:bg-muted/30 transition cursor-pointer"
                  onClick={onReview}
                >
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold truncate">
                        {lead.post_title || lead.matched_keyword}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {lead.post_author || 'unknown'}
                        {lead.post_subreddit ? ` · r/${lead.post_subreddit}` : ''} · matched "
                        {lead.matched_keyword}"
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={cn(
                          'text-xl font-bold leading-none tabular-nums',
                          tier === 'high' && 'text-emerald-600',
                          tier === 'medium' && 'text-amber-500',
                          tier === 'low' && 'text-muted-foreground'
                        )}
                      >
                        {intentToPercent(lead.intent_score)}
                      </p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                        intent
                      </p>
                    </div>
                    <Badge variant="info" className="text-[10px] shrink-0">
                      {lead.status}
                    </Badge>
                  </div>
                  {lead.llm_reason && (
                    <p className="mt-2 text-xs text-muted-foreground line-clamp-1 italic">
                      <Bot className="inline h-3 w-3 mr-1 text-primary" />
                      {lead.llm_reason}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Matched posts by keywords
// ────────────────────────────────────────────────────────────────────────────
function MatchedPostsCard({ posts, isLoading, onViewAll }) {
  return (
    <Card>
      <CardHeader className="flex-row flex items-center justify-between space-y-0">
        <div>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Search className="h-4 w-4 text-primary" />
            Matched by Keywords
          </CardTitle>
          <CardDescription className="text-xs mt-1">
            Keyword matches ranked by intent score — awaiting AI grading
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={onViewAll}>
          View all <ArrowRight className="h-3.5 w-3.5 ml-1" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <LoadingRows />
        ) : posts.length === 0 ? (
          <EmptyCard
            icon={<FileText className="h-5 w-5 text-muted-foreground" />}
            title="No matched posts yet"
            body="When the pipeline finds posts matching your keywords, they appear here ranked by score."
          />
        ) : (
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <div
                key={post.id}
                className="px-5 py-3.5 hover:bg-muted/30 transition cursor-pointer"
                onClick={onViewAll}
              >
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{post.title || '(untitled)'}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {post.author || 'unknown'}
                      {post.subreddit ? ` · r/${post.subreddit}` : ''} · "
                      {post.matched_keyword}"
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold leading-none tabular-nums text-amber-500/90">
                      {intentToPercent(post.intent_score)}
                    </p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">
                      score
                    </p>
                  </div>
                </div>
                {post.matched_intent_phrase && (
                  <Badge variant="outline" className="mt-2 text-[10px]">
                    <MessageSquareText className="mr-1 h-3 w-3" />
                    "{post.matched_intent_phrase}"
                  </Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// 3-stage funnel (real counts from the backend)
// ────────────────────────────────────────────────────────────────────────────
function PipelineFunnel({ leadStats, stats }) {
  const totalLeads = leadStats?.total ?? 0;
  const matched = stats?.matched_posts_count ?? 0;
  const stages = [
    {
      label: 'Keyword matched',
      value: matched,
      hint: 'Posts containing your tracked keywords',
      color: 'bg-indigo-500',
    },
    {
      label: 'Semantically scored',
      value: stats?.semantic_scored_count ?? 0,
      hint: 'Similarity vs your product profile (embeddings)',
      color: 'bg-purple-500',
    },
    {
      label: 'Graded by AI agent',
      value: stats?.llm_checked_count ?? 0,
      hint: 'LLM lead agent verified buying intent',
      color: 'bg-fuchsia-500',
    },
    {
      label: 'Confirmed leads',
      value: totalLeads,
      hint: 'Passed all 3 filtering stages',
      color: 'bg-rose-500',
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
          3-Stage Filter Funnel
        </CardTitle>
        <CardDescription className="text-xs">
          keyword matching → semantic analysis → LLM agent
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
              <div className="h-6 w-full overflow-hidden rounded-md bg-muted">
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

// ────────────────────────────────────────────────────────────────────────────
// Lead status distribution
// ────────────────────────────────────────────────────────────────────────────
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

// ────────────────────────────────────────────────────────────────────────────
// Shared bits
// ────────────────────────────────────────────────────────────────────────────
function LoadingRows() {
  return (
    <div className="space-y-3 p-5">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3">
          <div className="flex-1 space-y-2">
            <div className="h-3 w-3/4 shimmer rounded" />
            <div className="h-3 w-1/2 shimmer rounded" />
          </div>
          <div className="h-8 w-12 shimmer rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyCard({ icon, title, body }) {
  return (
    <div className="p-8 text-center">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-muted mb-3">
        {icon}
      </div>
      <h3 className="text-sm font-semibold mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">{body}</p>
    </div>
  );
}
