import React from 'react';

const stats = [
  { label: 'Subreddits monitored', value: '24+' },
  { label: 'Avg. lead intent score', value: '87' },
  { label: 'Pipeline latency', value: '<2min' },
  { label: 'False-positive rate', value: '<3%' },
];

export default function LandingStats() {
  return (
    <section className="py-12 sm:py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl border border-border bg-card/60 backdrop-blur-sm p-8 sm:p-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold gradient-text tabular-nums">
                  {s.value}
                </p>
                <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
