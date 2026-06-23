import React from 'react';
import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { systemLogEvents } from '@/data/mockData';

export default function SystemLogPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative h-9 gap-1.5 px-2 text-muted-foreground hover:text-foreground"
          aria-label="Live System Terminal"
          title="Live System Terminal"
        >
          <Bell className="h-4 w-4" />
          <span className="flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            Live
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border px-3 py-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            System Log
          </span>
          <span className="flex items-center gap-1 text-[10px] font-medium text-emerald-600 dark:text-emerald-400">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
            LIVE
          </span>
        </div>
        <div className="max-h-80 overflow-y-auto scrollbar-thin">
          {systemLogEvents.map((event) => (
            <div
              key={event.id}
              className="border-b border-border/50 px-3 py-2 last:border-0"
            >
              <div className="flex items-baseline gap-2">
                <span className="shrink-0 font-mono text-[10px] text-muted-foreground/50">
                  {event.time}
                </span>
                <p className="text-xs leading-relaxed text-foreground/80">
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