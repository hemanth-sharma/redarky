import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ListChecks,
  Zap,
  Plug,
  Plus,
  X,
  Activity,
  MessageSquareHeart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/Logo';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { keywordsApi, scraperApi } from '@/api';
import { useAuth } from '@/lib/AuthContext';
import { useProduct } from '@/lib/ProductContext';

const navItems = [
  { to: '/queue', label: 'Action Queue', icon: ListChecks },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/product-profile', label: 'Product Profile', icon: Zap },
  { to: '/scraper-activity', label: 'Pipeline Activity', icon: Activity },
  { to: '/integrations', label: 'Integrations', icon: Plug },
];

const secondaryNavItems = [
  { to: '/feedback', label: 'Feedback', icon: MessageSquareHeart },
];

export default function Sidebar({ onNavigate }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { activeProduct } = useProduct();
  const [adding, setAdding] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const activeProjectId = activeProduct?.id;

  const { data: keywords = [] } = useQuery({
    queryKey: ['keywords', activeProjectId],
    queryFn: () => keywordsApi.list(activeProjectId),
    enabled: !!activeProjectId,
  });

  const addKeywordMutation = useMutation({
    mutationFn: (keyword) =>
      keywordsApi.create({
        keyword,
        keyword_type: 'include',
        project_id: activeProjectId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords', activeProjectId] });
    },
    onError: (err) => console.error('Failed to add keyword', err),
  });

  const removeKeywordMutation = useMutation({
    mutationFn: (id) => keywordsApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['keywords', activeProjectId] });
    },
    onError: (err) => console.error('Failed to remove keyword', err),
  });

  // Last run pipeline time (consistent limit → consistent cache with the
  // Pipeline Activity page; fixes the refresh mismatch bug)
  const { data: runs = [] } = useQuery({
    queryKey: ['scraper-runs', 5],
    queryFn: () => scraperApi.listRuns(5),
    refetchInterval: 30 * 1000,
  });
  const lastRun = runs[0];

  // Calculates remaining minutes until next run (assuming 30-min interval)
  function getNextRunMinutes(dateString, intervalMinutes = 30) {
    if (!dateString) return intervalMinutes;
    const elapsedMinutes = Math.floor((new Date() - new Date(dateString)) / 60000);
    const remainingMinutes = intervalMinutes - (elapsedMinutes % intervalMinutes);
    return Math.max(1, remainingMinutes);
  }

  // Keyword colors based on type
  const colorFor = (kw) => {
    if (kw.keyword_type === 'brand') return 'bg-purple-500';
    if (kw.keyword_type === 'exclude') return 'bg-red-500';
    return 'bg-indigo-500';
  };

  const handleAddKeyword = async () => {
    if (!newKeyword.trim() || !activeProjectId) return;
    try {
      await addKeywordMutation.mutateAsync(newKeyword.trim());
      setNewKeyword('');
    } catch (err) {
      console.error('Failed to add keyword', err);
    }
    setAdding(false);
  };

  const handleRemoveKeyword = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    removeKeywordMutation.mutate(id);
  };

  const renderNavLink = (item) => {
    const Icon = item.icon;
    return (
      <NavLink
        key={item.to}
        to={item.to}
        onClick={onNavigate}
        className={({ isActive }) =>
          cn(
            'group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-all duration-150',
            isActive
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )
        }
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span className="flex-1 truncate">{item.label}</span>
      </NavLink>
    );
  };

  return (
    <div className="flex h-full flex-col bg-card border-r border-border">
      {/* Brand */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-border/60">
        <Logo size="sm" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {navItems.map(renderNavLink)}

        <div className="my-4 border-t border-border/60" />

        {/* Tracked Keywords — scoped to the active product */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Tracked Keywords
            </p>
            {!!activeProjectId && !adding && (
              <button
                className="text-muted-foreground hover:text-primary p-0.5 rounded transition"
                onClick={() => setAdding(true)}
                aria-label="Add keyword"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {!activeProjectId && (
            <p className="px-3 py-2 text-xs text-muted-foreground/70 italic">
              Create a product to start tracking keywords.
            </p>
          )}

          {adding && (
            <div className="px-2 pb-2">
              <input
                autoFocus
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddKeyword();
                  if (e.key === 'Escape') {
                    setAdding(false);
                    setNewKeyword('');
                  }
                }}
                onBlur={handleAddKeyword}
                placeholder="Press Enter to save…"
                className="w-full h-8 px-2 border border-input rounded text-xs outline-none focus:ring-2 focus:ring-ring bg-background"
              />
            </div>
          )}

          <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin">
            {keywords.length === 0 && !adding && !!activeProjectId && (
              <p className="px-3 py-2 text-xs text-muted-foreground/70 italic">
                No keywords yet — add one above.
              </p>
            )}
            {keywords.map((kw) => (
              <div
                key={kw.id}
                className="group flex items-center gap-3 rounded px-3 py-1.5 hover:bg-muted cursor-pointer transition"
              >
                <div className={cn('h-2 w-2 rounded-full shrink-0', colorFor(kw))} />
                <span className="flex-1 truncate text-xs font-medium text-foreground/80 group-hover:text-foreground">
                  {kw.keyword}
                </span>
                <button
                  onClick={(e) => handleRemoveKeyword(e, kw.id)}
                  className="text-muted-foreground/30 opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-0.5"
                  aria-label="Remove keyword"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Secondary nav (feedback) + footer */}
      <div className="border-t border-border/60">
        <nav className="px-3 py-2 space-y-1">{secondaryNavItems.map(renderNavLink)}</nav>

        <div className="p-4 pt-2">
          <div className="rounded-lg gradient-border p-3 text-xs text-center">
            <p className="font-semibold text-foreground mb-1 flex items-center justify-center gap-1.5">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  activeProduct?.is_pipeline_active
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-zinc-400'
                )}
              />
              {activeProduct?.is_pipeline_active ? 'Pipeline Active' : 'Pipeline Paused'}
            </p>
            <p className="text-muted-foreground text-[11px] leading-snug">
              {activeProduct?.is_pipeline_active
                ? lastRun?.started_at
                  ? `Next run in ${getNextRunMinutes(lastRun.started_at, 30)} minutes`
                  : 'Next batch runs within 30 minutes.'
                : 'Activate the pipeline to resume monitoring.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
