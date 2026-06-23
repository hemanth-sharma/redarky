import React from 'react';
import { pipelineStages } from '@/data/mockData';

export default function PipelineFunnel() {
  const maxValue = pipelineStages[0].value;

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">
          Pipeline Funnel
        </h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          2-stage filtering before AI processing
        </p>
      </div>
      <div className="space-y-3">
        {pipelineStages.map((stage, idx) => {
          const width = (stage.value / maxValue) * 100;
          const conversion =
            idx > 0
              ? ((stage.value / pipelineStages[idx - 1].value) * 100).toFixed(0)
              : null;

          return (
            <div key={idx}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="font-medium text-foreground/80">
                  {stage.label}
                </span>
                <div className="flex items-center gap-2">
                  {conversion && (
                    <span className="text-muted-foreground">
                      {conversion}% pass
                    </span>
                  )}
                  <span className="font-semibold text-foreground">
                    {stage.value}
                  </span>
                </div>
              </div>
              <div className="h-7 w-full overflow-hidden rounded-md bg-muted">
                <div
                  className="flex h-full items-center justify-end rounded-md px-2 transition-all duration-500"
                  style={{
                    width: `${Math.max(width, 8)}%`,
                    backgroundColor: stage.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}