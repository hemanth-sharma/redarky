import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import IntentScoreBadge from '@/components/leads/IntentScoreBadge';

export default function RecentActivity({ activities }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your latest approvals and rejections
        </p>
      </div>
      <div className="space-y-1">
        {activities.map((activity, idx) => (
          <div key={activity.id}>
            <div className="flex items-start gap-3 py-2.5">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  activity.type === 'approved'
                    ? 'bg-emerald-100 dark:bg-emerald-950/60'
                    : 'bg-red-100 dark:bg-red-950/60'
                }`}
              >
                {activity.type === 'approved' ? (
                  <Check className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <X className="h-3.5 w-3.5 text-red-600 dark:text-red-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {activity.lead_title}
                </p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {activity.source}
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="flex items-center gap-0.5 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {activity.time}
                  </span>
                </div>
              </div>
              <IntentScoreBadge score={activity.intent_score} size="sm" />
            </div>
            {idx < activities.length - 1 && (
              <div className="h-px bg-border" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}