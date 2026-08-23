import React from 'react';
import {
  Zap,
  ShieldCheck,
  Target,
  Activity,
  Bot,
  RefreshCw,
} from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Intent scoring that works',
    description:
      'A 3-stage pipeline — keyword → semantic → LLM — surfaces the 1% of posts that are actually in-market. Stop chasing mentions.',
  },
  {
    icon: Zap,
    title: 'Set up in 5 minutes',
    description:
      'Drop in your product description, pick your keywords, choose your subreddits. Activate the pipeline and you\'re live.',
  },
  {
    icon: ShieldCheck,
    title: 'Secure by default',
    description:
      'Access tokens in memory, refresh-token rotation, Bearer-only auth. Your Reddit sessions are never shared with third parties.',
  },
  {
    icon: Activity,
    title: 'Pipeline observability',
    description:
      'Every scraper batch is logged. See exactly how many items were pulled, how many were new, and why a run might have failed.',
  },
  {
    icon: Bot,
    title: 'Bring your own LLM',
    description:
      'Plug in any OpenAI-compatible endpoint. Stage 3 LLM scoring works with GPT-4, Claude, local models, or anything in between.',
  },
  {
    icon: RefreshCw,
    title: 'Two-tier TTL',
    description:
      'Raw scraped data expires in 7 days. Matched posts respect your per-project retention setting (5/10/30 days). Storage that scales with you.',
  },
];

export default function LandingFeatures() {
  return (
    <section className="py-20 sm:py-24 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            What you get
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-balance">
            Built for founders who hate cold outbound
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="rounded-2xl border border-border bg-card p-6 hover:border-primary/40 transition-colors"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary mb-4">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
