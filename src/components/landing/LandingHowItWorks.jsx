import React from 'react';
import { Search, Bot, TrendingUp, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: Search,
    title: '1. Monitor',
    description:
      'Tell Redarky your product, your keywords, and the communities you care about. We watch them 24/7 — every new post, every comment.',
  },
  {
    icon: Bot,
    title: '2. Score & filter',
    description:
      'Every post goes through a 3-stage pipeline: keyword match → semantic embedding → LLM scoring. The 1% that matter bubble up.',
  },
  {
    icon: TrendingUp,
    title: '3. Reach out',
    description:
      'High-intent leads land in your queue with intent scores, matched snippets, and a deep link back to the original thread. You do the talking.',
  },
];

export default function LandingHowItWorks() {
  return (
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            How Redarky finds your next 10 customers
          </h2>
          <p className="mt-3 text-muted-foreground">
            Three steps. Zero spreadsheets. No more cold-list grind.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="relative rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors group"
              >
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-accent text-white shadow-md mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {s.description}
                </p>
                {i < steps.length - 1 && (
                  <ArrowRight className="hidden md:block absolute top-1/2 -right-3.5 h-5 w-5 text-muted-foreground/40 -translate-y-1/2" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
