import React from 'react';
import { Sparkles, Check, X, ExternalLink } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { aiVisibilityPrompts, aiVisibilitySummary } from '@/data/mockData';

const aiModels = [
  { key: 'chatgpt', label: 'ChatGPT', color: 'text-emerald-600 dark:text-emerald-400' },
  { key: 'claude', label: 'Claude', color: 'text-amber-600 dark:text-amber-400' },
  { key: 'perplexity', label: 'Perplexity', color: 'text-blue-600 dark:text-blue-400' },
];

export default function AIVisibilityTracker() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">
              AI Visibility Tracker
            </h3>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary/60">
              Beta / Mock Data Mode
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Brand appearance across AI model responses
          </p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold gradient-text">
            {aiVisibilitySummary.win_rate}
          </p>
          <p className="text-[11px] text-muted-foreground">win rate</p>
        </div>
      </div>

      {/* Summary bar */}
      <div className="mb-4 flex items-center gap-4 rounded-lg bg-muted/50 p-3 text-xs">
        <div>
          <span className="font-semibold text-foreground">
            {aiVisibilitySummary.brand_appearances}
          </span>
          <span className="text-muted-foreground"> / {aiVisibilitySummary.total_checks} appearances</span>
        </div>
        <div className="h-3 w-px bg-border" />
        <div>
          <span className="text-muted-foreground">Tracking </span>
          <span className="font-semibold text-foreground">
            {aiVisibilitySummary.total_prompts}
          </span>
          <span className="text-muted-foreground"> prompts</span>
        </div>
      </div>

      {/* Prompt list */}
      <div className="space-y-2.5">
        {aiVisibilityPrompts.map((prompt) => (
          <div
            key={prompt.id}
            className="rounded-lg border border-border p-3 transition-colors hover:bg-muted/30"
          >
            <p className="mb-2.5 text-sm font-medium text-foreground">
              "{prompt.prompt}"
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {aiModels.map((model) => {
                const result = prompt.results[model.key];
                return (
                  <div key={model.key} className="flex items-center gap-1.5">
                    {result.appeared ? (
                      <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/60">
                          <Check className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                        </span>
                        <span className="text-xs font-medium text-foreground">
                          {model.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground">
                          #{result.rank}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/60">
                          <X className="h-3 w-3 text-red-600 dark:text-red-400" />
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {model.label}
                        </span>
                        <span className="text-[11px] text-muted-foreground/70">
                          → {result.winner}
                        </span>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <button className="mt-4 flex items-center gap-1 text-xs font-medium text-primary hover:underline">
        Configure tracked prompts
        <ExternalLink className="h-3 w-3" />
      </button>
    </div>
  );
}