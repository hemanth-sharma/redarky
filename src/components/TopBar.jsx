import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Menu, Bell, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/ThemeToggle';
import { useAuth } from '@/lib/AuthContext';
import { Badge } from '@/components/ui/badge';
import { scraperApi } from '@/api';

const titles = {
  '/dashboard': 'Dashboard',
  '/queue': 'Action Queue',
  '/product-profile': 'Product Profile',
  '/scraper-activity': 'Scraper Activity',
  '/integrations': 'Integrations',
};

export default function TopBar({ onMenuClick, title }) {
  const { user, logout, isDemoUser } = useAuth();

  const initials = (user?.full_name || user?.email || 'US')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 right-0 z-40 flex h-16 w-full items-center justify-between border-b border-border glass px-6">
      {/* Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden mr-1"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">
            {title}
          </h1>
          <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
          <span className="text-xs font-semibold text-muted-foreground hidden sm:block">
            Lead Intelligence
          </span>
          {isDemoUser && (
            <Badge variant="info" className="ml-2">Demo Mode</Badge>
          )}
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">
        <RecentActivityBell />
        <ThemeToggle />
        <div className="h-4 w-px bg-border mx-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center rounded-full outline-none p-0.5 hover:ring-2 hover:ring-ring transition"
              aria-label="User menu"
            >
              <Avatar className="h-8 w-8 border border-border shadow-sm select-none">
                <AvatarFallback className="gradient-accent text-xs font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="font-normal px-2 py-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">
                  {user?.full_name || 'Redarky User'}
                </p>
                <p className="text-xs text-muted-foreground leading-none mt-1">
                  {user?.email || 'user@redarky.com'}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-xs cursor-pointer">
              Account Settings
            </DropdownMenuItem>
            <DropdownMenuItem className="text-xs cursor-pointer">
              Billing &amp; Payments
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="text-xs font-bold text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer"
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

function RecentActivityBell() {
  const [open, setOpen] = useState(false);
  const { data: runs } = useQuery({
    queryKey: ['scraper-runs-recent'],
    queryFn: () => scraperApi.listRuns(5),
    refetchInterval: 60 * 1000,
  });
  const recent = (runs || []).slice(0, 5);
  const latestStatus = recent[0]?.status;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 gap-2 px-3"
          aria-label="Live system activity"
        >
          <Bell className="h-4 w-4" />
          <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 p-0"
      >
        <div className="flex items-center justify-between border-b border-border bg-muted/30 px-4 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Scraper Activity
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin divide-y divide-border/60">
          {recent.length === 0 && (
            <div className="px-4 py-6 text-xs text-muted-foreground text-center">
              No scraper activity yet.
            </div>
          )}
          {recent.map((run) => (
            <div key={run.id} className="px-4 py-3 hover:bg-muted/30 transition">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-xs font-medium text-foreground">
                  {run.status === 'success' ? '✓' : run.status === 'failed' ? '✗' : '↻'}{' '}
                  Batch
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {run.total_items_pulled || 0} items
                </span>
              </div>
              <p className="mt-1 text-[11px] text-muted-foreground">
                {new Date(run.started_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
