import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Loader2,
  AlertCircle,
  ExternalLink,
  Sparkles,
  Filter,
  RefreshCw,
  Trophy,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/tabs';
import { leadsApi, postsApi, projectsApi } from '@/api';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/hooks/use-toast';
import {
  cn,
  intentToPercent,
  intentTier,
  formatRelativeTime,
  truncate,
} from '@/lib/utils';

const LEAD_STATUSES = [
  { value: 'new', label: 'New' },
  { value: 'reviewed', label: 'Reviewed' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'ignored', label: 'Ignored' },
];

export default function ActionQueue() {
  const { user } = useAuth();
  const [intentThreshold, setIntentThreshold] = useState(50);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null);

  // Fetch projects → first project is the active one
  const { data: projects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
    enabled: !!user,
  });
  const activeProjectId = projects?.[0]?.id;

  // Leads
  const {
    data: leadsData,
    isLoading: leadsLoading,
    refetch: refetchLeads,
  } = useQuery({
    queryKey: ['leads', activeProjectId, page],
    queryFn: () => leadsApi.list({
      project_id: activeProjectId,
      page,
      page_size: 25,
    }),
    enabled: !!activeProjectId,
  });
  const leads = leadsData?.items || [];

  // Matched posts (potential matches — Stage 1 only)
  const {
    data: postsData,
    isLoading: postsLoading,
    refetch: refetchPosts,
  } = useQuery({
    queryKey: ['posts', activeProjectId, page, intentThreshold],
    queryFn: () => postsApi.list({
      project_id: activeProjectId,
      page,
      page_size: 25,
      sort_by: 'intent_score',
      sort_desc: true,
      min_intent_score: intentThreshold / 100,
    }),
    enabled: !!activeProjectId,
  });
  const posts = postsData?.items || [];

  // Lead status update mutation
  const queryClient = useQueryClient();
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => leadsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
      queryClient.invalidateQueries({ queryKey: ['project-stats'] });
      toast({ title: 'Lead status updated' });
    },
    onError: (err) => toast({
      title: 'Failed to update',
      description: err?.message,
      variant: 'destructive',
    }),
  });

  // Notes update mutation
  const updateNotesMutation = useMutation({
    mutationFn: ({ id, notes }) => leadsApi.updateNotes(id, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      toast({ title: 'Notes saved' });
    },
  });

  // Combined ranked list: leads first (by intent desc), then matched posts (by intent desc)
  // Filter by intent threshold and unread toggle
  const { rankedLeads, rankedPosts } = useMemo(() => {
    const filteredLeads = leads.filter((l) => {
      const score = intentToPercent(l.intent_score);
      if (score < intentThreshold) return false;
      if (onlyUnread && l.status !== 'new') return false;
      return true;
    });
    const filteredPosts = posts.filter((p) => {
      // Skip posts that are already leads — they're shown in the leads section
      if (p.is_lead) return false;
      const score = intentToPercent(p.intent_score);
      if (score < intentThreshold) return false;
      return true;
    });
    return {
      rankedLeads: filteredLeads.sort((a, b) =>
        intentToPercent(b.intent_score) - intentToPercent(a.intent_score)
      ),
      rankedPosts: filteredPosts.sort((a, b) =>
        intentToPercent(b.intent_score) - intentToPercent(a.intent_score)
      ),
    };
  }, [leads, posts, intentThreshold, onlyUnread]);

  const loading = leadsLoading || postsLoading;

  return (
    <div className="flex flex-col lg:flex-row gap-6 -mx-6 -my-6 lg:mx-0 lg:my-0">
      {/* Main feed */}
      <section className="flex-1 px-6 lg:px-0 lg:py-0 py-6 space-y-4 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold tracking-tight">Action Queue</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {rankedLeads.length} leads · {rankedPosts.length} potential matches
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => { refetchLeads(); refetchPosts(); }}
            disabled={loading}
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
            Refresh
          </Button>
        </div>

        {loading ? (
          <LoadingState />
        ) : rankedLeads.length === 0 && rankedPosts.length === 0 ? (
          <EmptyState threshold={intentThreshold} />
        ) : (
          <>
            {/* Section: LEADS (high intent — fully colored) */}
            {rankedLeads.length > 0 && (
              <div className="space-y-3">
                <SectionHeader
                  icon={<Trophy className="h-3.5 w-3.5 text-emerald-500" />}
                  label="Leads"
                  count={rankedLeads.length}
                  hint="Stage 2 + Stage 3 passed — high buying intent"
                />
                {rankedLeads.map((lead) => (
                  <LeadCard
                    key={lead.id}
                    lead={lead}
                    onSelect={() => setSelected({ type: 'lead', item: lead })}
                    onStatusChange={(status) =>
                      updateStatusMutation.mutate({ id: lead.id, status })
                    }
                    onNotesChange={(notes) =>
                      updateNotesMutation.mutate({ id: lead.id, notes })
                    }
                  />
                ))}
              </div>
            )}

            {/* Section: POTENTIAL MATCHES (medium intent — dimmed) */}
            {rankedPosts.length > 0 && (
              <div className={cn('space-y-3', rankedLeads.length > 0 && 'mt-6')}>
                <SectionHeader
                  icon={<FileText className="h-3.5 w-3.5 text-muted-foreground" />}
                  label="Potential matches"
                  count={rankedPosts.length}
                  hint="Stage 1 keyword match — lower-intent posts worth scanning"
                  dim
                />
                {rankedPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelect={() => setSelected({ type: 'post', item: post })}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Right rail — contextual filters */}
      <aside className="hidden xl:block w-80 shrink-0 px-6 lg:px-0 py-6 lg:py-0">
        <div className="sticky top-4 space-y-5">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Filter className="h-4 w-4 text-primary" />
                Contextual Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Intent threshold */}
              <div>
                <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-3">
                  Intent Threshold
                </Label>
                <div className="px-1">
                  <Slider
                    value={[intentThreshold]}
                    onValueChange={([v]) => setIntentThreshold(v)}
                    max={100}
                    min={0}
                    step={5}
                    className="mb-2"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>0</span>
                    <span className="text-primary font-bold">{intentThreshold}</span>
                    <span>100</span>
                  </div>
                </div>
              </div>

              {/* Only unread */}
              <div className="flex items-center justify-between">
                <Label htmlFor="unread-toggle" className="text-xs font-medium cursor-pointer">
                  Only unread leads
                </Label>
                <Switch
                  id="unread-toggle"
                  checked={onlyUnread}
                  onCheckedChange={setOnlyUnread}
                />
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
                Intent Legend
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="font-medium">High</span>
                <span className="text-muted-foreground ml-auto">80–100</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                <span className="font-medium">Medium</span>
                <span className="text-muted-foreground ml-auto">50–79</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-zinc-400" />
                <span className="font-medium">Low</span>
                <span className="text-muted-foreground ml-auto">0–49</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card className="bg-gradient-to-br from-primary/5 to-purple-500/5 border-primary/20">
            <CardContent className="p-4">
              <p className="text-xs font-semibold text-foreground mb-2">
                Quick insights
              </p>
              <div className="space-y-1.5 text-[11px] text-muted-foreground">
                <div className="flex justify-between">
                  <span>Total leads</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {rankedLeads.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Matched posts</span>
                  <span className="font-semibold text-foreground tabular-nums">
                    {rankedPosts.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Avg lead intent</span>
                  <span className="font-semibold text-emerald-600 tabular-nums">
                    {rankedLeads.length > 0
                      ? Math.round(
                          rankedLeads.reduce((a, l) => a + intentToPercent(l.intent_score), 0) /
                            rankedLeads.length
                        )
                      : '—'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </aside>

      {/* Detail dialog */}
      <DetailDialog
        selected={selected}
        onClose={() => setSelected(null)}
        onStatusChange={(status) =>
          selected?.type === 'lead' &&
          updateStatusMutation.mutate({ id: selected.item.id, status })
        }
        onNotesChange={(notes) =>
          selected?.type === 'lead' &&
          updateNotesMutation.mutate({ id: selected.item.id, notes })
        }
      />
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

function SectionHeader({ icon, label, count, hint, dim }) {
  return (
    <div className={cn('flex items-center gap-2', dim && 'opacity-70')}>
      {icon}
      <span className="text-xs font-bold uppercase tracking-wider text-foreground">
        {label}
      </span>
      <Badge variant="secondary" className="text-[10px]">
        {count}
      </Badge>
      {hint && (
        <span className="text-[10px] text-muted-foreground ml-2 hidden sm:inline">
          {hint}
        </span>
      )}
    </div>
  );
}

function IntentBadge({ score, size = 'default' }) {
  const pct = intentToPercent(score);
  const tier = intentTier(pct);
  const colors = {
    high: 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
    medium: 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
    low: 'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-950/50 dark:text-zinc-400 dark:border-zinc-900',
  };
  const dot = {
    high: 'bg-emerald-500',
    medium: 'bg-amber-500',
    low: 'bg-zinc-400',
  };
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        colors[tier],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dot[tier])} />
      {pct}
    </div>
  );
}

function LeadCard({ lead, onSelect, onStatusChange, onNotesChange }) {
  const [expanded, setExpanded] = useState(false);
  const title = lead.post_title || lead.matched_keyword || '(untitled lead)';
  const author = lead.post_author || 'unknown';
  const subreddit = lead.post_subreddit || '';
  const snippet =
    lead.llm_reason ||
    `Matched on "${lead.matched_keyword || '(no keyword)'}"`;

  return (
    <article
      className="rounded-xl border border-border bg-card p-5 hover:border-emerald-400/60 transition-all shadow-sm cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
            <Trophy className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold flex items-center gap-1.5 flex-wrap">
              <span className="truncate">{author}</span>
              {subreddit && (
                <span className="text-muted-foreground font-normal">
                  in r/{subreddit}
                </span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatRelativeTime(lead.created_at)} · matched "{lead.matched_keyword}"
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">
            Intent
          </p>
          <p className="text-2xl font-bold leading-none text-emerald-600 tabular-nums">
            {intentToPercent(lead.intent_score)}
          </p>
        </div>
      </div>

      <h3 className="text-base font-semibold mb-1.5 line-clamp-2">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">
        <p className={cn('inline', expanded ? '' : 'line-clamp-2')}>{snippet}</p>
        {snippet.length > 200 && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
          >
            {expanded ? (
              <>less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>more <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
        <div className="flex items-center gap-2">
          <Badge variant="info" className="text-[10px]">{lead.status}</Badge>
          {lead.contacted_at && (
            <span className="text-[10px] text-muted-foreground">
              contacted {formatRelativeTime(lead.contacted_at)}
            </span>
          )}
        </div>
        <a
          href={lead.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View
        </a>
      </div>
    </article>
  );
}

function PostCard({ post, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const title = post.title || '(untitled post)';
  const snippet = post.matched_snippet || post.content || '';
  const isLong = snippet.length > 200;
  const display = isLong && !expanded ? `${snippet.slice(0, 200)}…` : snippet;
  const intentPct = intentToPercent(post.intent_score);
  const tier = intentTier(post.intent_score);

  return (
    <article
      className="rounded-xl border border-border bg-card p-5 hover:border-primary/40 transition-all opacity-80 hover:opacity-100 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-muted">
            <FileText className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium flex items-center gap-1.5 flex-wrap">
              <span className="truncate">{post.author || 'unknown'}</span>
              {post.subreddit && (
                <span className="text-muted-foreground font-normal">in r/{post.subreddit}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {formatRelativeTime(post.created_at_platform)} · "{post.matched_keyword}"
            </p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">
            Intent
          </p>
          <p
            className={cn(
              'text-2xl font-bold leading-none tabular-nums',
              tier === 'high'
                ? 'text-amber-500'
                : tier === 'medium'
                ? 'text-amber-500/80'
                : 'text-muted-foreground'
            )}
          >
            {intentPct}
          </p>
        </div>
      </div>

      <h3 className="text-base font-medium mb-1.5 line-clamp-2">{title}</h3>
      <div className="text-sm text-muted-foreground leading-relaxed">
        <p className="inline line-clamp-2">{display}</p>
        {isLong && (
          <button
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
            className="ml-1.5 inline-flex items-center gap-0.5 text-xs font-bold text-primary hover:underline"
          >
            {expanded ? (
              <>less <ChevronUp className="h-3 w-3" /></>
            ) : (
              <>more <ChevronDown className="h-3 w-3" /></>
            )}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-3 border-t border-border/60">
        <Badge variant="outline" className="text-[10px]">
          Potential match
        </Badge>
        <a
          href={post.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs font-medium text-muted-foreground hover:text-primary flex items-center gap-1"
        >
          <ExternalLink className="h-3.5 w-3.5" /> View
        </a>
      </div>
    </article>
  );
}

function DetailDialog({ selected, onClose, onStatusChange, onNotesChange }) {
  const [notes, setNotes] = useState(selected?.item?.notes || '');

  React.useEffect(() => {
    setNotes(selected?.item?.notes || '');
  }, [selected]);

  if (!selected) return null;
  const isLead = selected.type === 'lead';
  const item = selected.item;

  return (
    <Dialog open={!!selected} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {isLead ? (
              <>
                <Trophy className="h-5 w-5 text-emerald-500" />
                Lead detail
              </>
            ) : (
              <>
                <FileText className="h-5 w-5 text-muted-foreground" />
                Matched post
              </>
            )}
          </DialogTitle>
          <DialogDescription>
            {isLead
              ? `Lead from "${item.matched_keyword}" in r/${item.post_subreddit || 'unknown'}`
              : `Matched on "${item.matched_keyword}" in r/${item.subreddit || 'unknown'}`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Score + status */}
          <div className="flex items-center gap-4">
            <IntentBadge score={item.intent_score} />
            {isLead && (
              <Select
                value={item.status}
                onValueChange={(v) => onStatusChange(v)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {LEAD_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-primary hover:underline ml-auto flex items-center gap-1"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Open in Reddit
            </a>
          </div>

          {/* Title */}
          <div>
            <p className="text-xs text-muted-foreground mb-1">Title</p>
            <p className="text-base font-medium">
              {isLead ? item.post_title : item.title}
            </p>
          </div>

          {/* Reason / snippet */}
          {isLead && item.llm_reason && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">LLM reason</p>
              <p className="text-sm bg-primary/5 border border-primary/20 rounded-md p-3">
                {item.llm_reason}
              </p>
            </div>
          )}
          {!isLead && item.matched_snippet && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Matched snippet</p>
              <p className="text-sm bg-muted/50 rounded-md p-3">{item.matched_snippet}</p>
            </div>
          )}

          {/* Notes (lead only) */}
          {isLead && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">Notes</p>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add your follow-up notes here…"
                className="min-h-[100px]"
              />
              <div className="flex justify-end mt-2">
                <Button
                  size="sm"
                  onClick={() => onNotesChange(notes)}
                >
                  Save notes
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function LoadingState() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-5">
          <div className="flex gap-3 mb-3">
            <div className="h-9 w-9 rounded-full shimmer" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-1/3 shimmer rounded" />
              <div className="h-3 w-1/2 shimmer rounded" />
            </div>
            <div className="h-8 w-12 shimmer rounded" />
          </div>
          <div className="h-3 w-3/4 shimmer rounded mb-2" />
          <div className="h-3 w-1/2 shimmer rounded" />
        </div>
      ))}
    </div>
  );
}

function EmptyState({ threshold }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card/50 p-10 text-center">
      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-muted mb-3">
        <Sparkles className="h-5 w-5 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1">Nothing to show</h3>
      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
        No leads or matched posts at your current intent threshold ({threshold}).
        Try lowering the threshold, or wait for the next scraper batch — runs
        every 30 minutes.
      </p>
    </div>
  );
}
