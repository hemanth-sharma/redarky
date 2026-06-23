import React from 'react';
import { cn } from '@/lib/utils';

export default function StatCard({
  label,
  value,
  change,
  changeType,
  icon: Icon,
  progress,
  footer,
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">
          {label}
        </span>
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          {Icon && <Icon className="h-4 w-4 text-primary" />}
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-foreground">
          {value}
        </span>
        {change && (
          <span
            className={cn(
              'text-xs font-semibold',
              changeType === 'positive'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-red-600 dark:text-red-400'
            )}
          >
            {change}
          </span>
        )}
      </div>
      {progress !== undefined && (
        <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full gradient-accent transition-all duration-700"
            style={{ width: `${Math.max(progress, 3)}%` }}
          />
        </div>
      )}
      {footer && (
        <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
          {footer}
        </p>
      )}
    </div>
  );
}