import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Zap, Plug, Plus, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { trackedKeywords } from '@/data/mockData';

const navItems = [
  { to: '/queue', label: 'Action Queue', icon: ListChecks, badge: '12' },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/product-profile', label: 'Product Profile', icon: Zap },
  { to: '/integrations', label: 'Integrations', icon: Plug },
];

export default function Sidebar({ onNavigate }) {
  const [keywords, setKeywords] = useState(trackedKeywords || [
    { id: 1, keyword: 'competitor monitoring', color: 'bg-orange-500' },
    { id: 2, keyword: 'lead signal scraper', color: 'bg-purple-500' },
    { id: 3, keyword: 'SaaS automation', color: 'bg-cyan-500' },
    { id: 4, keyword: 'customer outreach', color: 'bg-emerald-500' }
  ]);
  const [adding, setAdding] = useState(false);
  const [newKeyword, setNewKeyword] = useState('');

  const handleAdd = () => {
    if (newKeyword.trim()) {
      const colors = ['bg-orange-500', 'bg-purple-500', 'bg-cyan-500', 'bg-emerald-500', 'bg-blue-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setKeywords([
        ...keywords,
        { id: Date.now(), keyword: newKeyword.trim(), color: randomColor },
      ]);
      setNewKeyword('');
    }
    setAdding(false);
  };

  const handleRemove = (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setKeywords(keywords.filter((k) => k.id !== id));
  };

  return (
    <div className="flex h-full flex-col bg-white border-r border-slate-200">
      {/* Brand Identity */}
      <div className="flex h-16 items-center gap-3 px-5 border-b border-slate-100">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#004ac6] shadow-sm text-white">
          <Zap className="h-4 w-4 fill-white" />
        </div>
        <div className="flex flex-col">
          <span className="text-base font-bold tracking-tight text-[#004ac6]">
            RedArky
          </span>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#434655] opacity-60 leading-none mt-0.5">
            Lead Intelligence
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'group flex items-center gap-3 rounded px-4 py-2.5 text-sm font-medium transition-all duration-150',
                  isActive
                    ? 'bg-[#f2f3ff] text-[#004ac6] font-bold border-r-4 border-[#004ac6]'
                    : 'text-[#434655] hover:bg-slate-50 hover:text-[#131b2e]'
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1 truncate">{item.label}</span>
              {item.badge && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#2563eb] px-1.5 text-[10px] font-bold text-white ml-auto">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}

        {/* Divider */}
        <div className="my-4 border-t border-slate-100" />

        {/* Tracked Keywords Pane */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between px-3 pb-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Keywords
            </p>
            {!adding && (
              <button
                className="text-slate-400 hover:text-[#004ac6] p-0.5 rounded transition"
                onClick={() => setAdding(true)}
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {adding && (
            <div className="px-2 pb-2">
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
                placeholder="Press Enter to save..."
                className="w-full h-8 px-2 border border-slate-200 rounded text-xs outline-none focus:border-[#004ac6] bg-slate-50"
              />
            </div>
          )}

          <div className="space-y-0.5 max-h-48 overflow-y-auto custom-scrollbar">
            {keywords.map((kw) => (
              <div
                key={kw.id}
                className="group flex items-center gap-3 rounded px-3 py-1.5 hover:bg-slate-50 cursor-pointer transition"
              >
                <div className={cn('h-2 w-2 rounded-full shrink-0', kw.color || 'bg-blue-500')} />
                <span className="flex-1 truncate text-xs font-medium text-[#434655] group-hover:text-[#131b2e]">
                  {kw.keyword}
                </span>
                <button
                  onClick={(e) => handleRemove(kw.id, e)}
                  className="text-slate-300 opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-0.5"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {/* Usage Analytics Footer Panel */}
      <div className="mt-auto border-t border-slate-100 p-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Searches</span>
            <span className="text-[#131b2e]">200 / 5,000</span>
          </div>
          <div className="h-1.5 w-full bg-[#e2e7ff] rounded-full overflow-hidden">
            <div className="h-full bg-[#004ac6] w-[4%] rounded-full" />
          </div>
          <p className="text-[10px] text-slate-400 text-center mt-1">
            Next reset in 14 days
          </p>
        </div>
      </div>
    </div>
  );
}