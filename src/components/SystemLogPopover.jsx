import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { systemLogEvents } from '@/data/mockData';

const FALLBACK_LOGS = [
  { id: 1, time: '13:42:01', text: 'Pipeline synchronized with r/SaaS stream.' },
  { id: 2, time: '13:40:15', text: 'AI model inference finalized for lead #962.' },
  { id: 3, time: '13:35:59', text: 'Ingesting background Twitter webhook signals.' }
];

export default function SystemLogPopover() {
  const logs = systemLogEvents || FALLBACK_LOGS;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 gap-2 px-3 text-[#434655] hover:text-[#131b2e] hover:bg-slate-50 transition"
          aria-label="Live System Terminal"
          title="Live System Terminal"
        >
          <Bell className="h-4 w-4" />
          <span className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-white border border-slate-200 shadow-xl rounded-xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-2.5">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            System Log
          </span>
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto custom-scrollbar division-y division-slate-100">
          {logs.map((event) => (
            <div
              key={event.id}
              className="border-b border-slate-50 px-4 py-3 last:border-0 hover:bg-slate-50/50 transition"
            >
              <div className="flex items-baseline gap-2.5">
                <span className="shrink-0 font-mono text-[10px] font-semibold text-slate-400">
                  {event.time}
                </span>
                <p className="text-xs leading-relaxed text-[#434655]">
                  {event.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}