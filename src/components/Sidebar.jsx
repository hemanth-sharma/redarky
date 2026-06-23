import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Zap, Plug, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { trackedKeywords } from '@/data/mockData';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/queue', label: 'Action Queue', icon: ListChecks, badge: '12' },
  { to: '/product-profile', label: 'Product Profile', icon: Zap },
  { to: '/integrations', label: 'Integrations', icon: Plug },
];

export default function Sidebar({ onNavigate }) {
  const [keywords, setKeywords] = useState(trackedKeywords);
  const [adding, setAdding] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = () => {
    if (newKeyword.trim()) {
      setKeywords([
        ...keywords,
        { id: Date.now(), keyword: newKeyword.trim(), reddit: true, hackernews: true },
      ]);
      setNewKeyword('');
    }
    setAdding(false);
  };

  const handleRemove = (id) => {
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  return (
    <div className="flex h-full flex-col bg-sidebar">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg gradient-accent shadow-sm">
          <Zap className="h-5 w-5 text-white" fill="white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-sidebar-foreground">
            RedArky
          </span>
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Lead Intelligence
          </span>
        </div>
      </div>

      {/* Top half: Nav */}
      <nav className="space-y-1 px-3 py-4">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Menu
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
                  isActive
                    ? 'bg-sidebar-accent text-sidebar-primary'
                    : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[11px] font-semibold text-primary-foreground">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Divider */}
      <div className="border-t border-sidebar-border" />

      {/* Bottom half: Keyword streaming pane */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Tracked Keywords
          </p>
          {!adding && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 gap-1 px-2 text-[11px] text-muted-foreground hover:text-sidebar-foreground"
              onClick={() => setAdding(true)}
            >
              <Plus className="h-3 w-3" />
              Add Keyword
            </Button>
          )}
        </div>

        {adding && (
          <div className="flex items-center gap-1.5 px-3 pb-2">
            <input
              autoFocus
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleAdd();
                if (e.key === 'Escape') {
                  setAdding(false);
                  setNewKeyword('');
                }
              }}
              onBlur={handleAdd}
              placeholder="Enter keyword..."
              className="h-7 flex-1 rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-3">
          {keywords.map((kw) => (
            <div
              key={kw.id}
              className="group flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-sidebar-accent/50"
            >
              <span className="flex-1 truncate text-xs font-medium text-sidebar-foreground/80">
                {kw.keyword}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    kw.reddit ? 'bg-orange-500' : 'bg-muted-foreground/20'
                  )}
                  title="Reddit"
                />
                <span
                  className={cn(
                    'h-1.5 w-1.5 rounded-full',
                    kw.hackernews ? 'bg-sky-500' : 'bg-muted-foreground/20'
                  )}
                  title="Hacker News"
                />
              </div>
              <button
                onClick={() => handleRemove(kw.id)}
                className="text-muted-foreground/40 opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage bar */}
      <div className="border-t border-sidebar-border p-3">
        <div className="rounded-lg bg-sidebar-accent/50 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sidebar-foreground">
              Searches
            </span>
            <span className="text-xs font-medium text-muted-foreground">
              200 / 5,000
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full gradient-accent"
              style={{ width: '4%' }}
            />
          </div>
          <p className="mt-2 text-[11px] text-muted-foreground">
            Next reset in 14 days
          </p>
        </div>
      </div>
    </div>
  );
}