import React from 'react';
import { cn } from '@/lib/utils';

export default function IntentScoreBadge({ score, size = 'default' }) {
  const tier =
    score >= 80
      ? 'high'
      : score >= 50
      ? 'medium'
      : 'low';

  const styles = {
    high: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-900',
    medium: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-900',
    low: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/50 dark:text-red-400 dark:border-red-900',
  };

  const dotStyles = {
    high: 'bg-emerald-500',
    medium: 'bg-amber-500',
    low: 'bg-red-500',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold',
        styles[tier],
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotStyles[tier])} />
      {score}
      <span className="font-normal opacity-70">/100</span>
    </div>
  );
}