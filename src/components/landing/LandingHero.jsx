import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from './MotionFallback';
import {
  ArrowRight,
  Sparkles,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/hooks/use-toast';

export default function LandingHero() {
  const { loginAsDemoUser } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  // 1-Click Direct Demo Login & Redirect
  const handleDemoLogin = async (e) => {
    e.preventDefault();
    setDemoLoading(true);
    try {
      await loginAsDemoUser();
      navigate('/dashboard', { replace: true });
    } catch (err) {
      toast({
        title: 'Demo login failed',
        description: err?.message || 'Backend may be unreachable',
        variant: 'destructive',
      });
      setDemoLoading(false);
    }
  };

  const handleGetStarted = (e) => {
    e.preventDefault();
    navigate('/login?next=/dashboard');
  };

  return (
    /* Reduced padding-top from pt-20 sm:pt-28 to pt-10 sm:pt-14 to bring content higher up */
    <section className="relative overflow-hidden pt-10 pb-24 sm:pt-14 sm:pb-32">
      {/* Decorative grid */}
      <div className="absolute inset-0 grid-bg opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)] pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto">
          {/* Pill */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-medium text-primary"
          >
            <Sparkles className="h-3.5 w-3.5 animate-pulse" />
            Find buyers before your competitors do
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 sm:mt-6 text-4xl sm:text-6xl font-bold tracking-tight text-balance"
          >
            High-intent leads from{' '}
            <span className="gradient-text">social communities</span>
            <br className="hidden sm:block" /> — on autopilot.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-4 sm:mt-6 text-lg text-muted-foreground text-balance"
          >
            Redarky scans Reddit in real-time, finds people actively looking to
            buy your competitor's product, and ranks them by buying intent —
            so your outbound actually converts.
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            {/* Primary Green Glowing Demo Button */}
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={demoLoading}
              className="group relative inline-flex w-full sm:w-auto items-center justify-center gap-2 overflow-hidden rounded-xl bg-emerald-600 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/30 transition-all duration-300 hover:bg-emerald-500 hover:shadow-emerald-500/50 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-75 cursor-pointer z-10"
            >
              {/* Continuous Shimmer Effect */}
              <span className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

              <span className="relative z-10 flex items-center gap-2">
                {demoLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin text-white" />
                ) : (
                  <Sparkles className="h-4 w-4 text-emerald-200" />
                )}
                {demoLoading ? 'Logging in…' : 'Try Live Demo Instantly'}
              </span>
            </button>

            {/* Secondary Get Started Button */}
            <Button
              size="xl"
              variant="outline"
              onClick={handleDemoLogin} // Put handleGetStarted here later onPROD
              className="group w-full sm:w-auto"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>

          {/* Sub-CTA micro-copy */}
          <p className="mt-3 text-xs font-medium text-muted-foreground">
            ⚡ 1-click instant demo — No registration or credit card needed
          </p>

          {/* Trust signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              No credit card required
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              Set up in 5 minutes
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
              7-day raw data TTL
            </span>
          </motion.div>
        </div>

        {/* Hero card / preview */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-14 sm:mt-16 relative max-w-5xl mx-auto"
        >
          <div className="absolute inset-0 -z-10 blur-3xl opacity-50">
            <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/40" />
            <div className="absolute top-0 right-1/4 h-72 w-72 rounded-full bg-purple-500/40" />
          </div>
          <div className="rounded-2xl border border-border/60 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden">
            {/* Mock window chrome */}
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div className="flex items-center gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-amber-500/70" />
                <div className="h-3 w-3 rounded-full bg-emerald-500/70" />
              </div>
              <div className="text-[10px] font-mono text-muted-foreground">
                app.redarky.com/queue
              </div>
              <div className="w-12" />
            </div>

            {/* Mock content */}
            <div className="p-5 space-y-3 text-left">
              <MockLeadRow
                intent={94}
                author="u/saas_founder"
                subreddit="r/SaaS"
                snippet="…our team is paying $400/month for Notion and we're done. What's a cheaper alternative that still has…"
                highlight="cheaper alternative"
                badge="High intent"
              />
              <MockLeadRow
                intent={88}
                author="u/building_in_public"
                subreddit="r/Entrepreneur"
                snippet="…I've been using Linear for issue tracking but it's overkill for my solo startup. Looking for something simpler…"
                highlight="Looking for something simpler"
                badge="Churn capture"
              />
              <MockLeadRow
                intent={72}
                author="u/devtools_user"
                subreddit="r/webdev"
                snippet="…anyone tried web scraping services recently? Need something that handles JS-heavy sites…"
                highlight="anyone tried"
                badge="In-market"
                dim
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function MockLeadRow({ intent, author, subreddit, snippet, highlight, badge, dim }) {
  return (
    <div
      className={`rounded-lg border border-border/60 bg-card p-3 transition-colors hover:border-primary/40 ${
        dim ? 'opacity-70' : 'shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-1.5">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-foreground">{author}</span>
          <span className="text-muted-foreground">in {subreddit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-medium">
            {badge}
          </span>
          <span
            className={`text-sm font-bold tabular-nums ${
              intent >= 90
                ? 'text-emerald-600'
                : intent >= 80
                ? 'text-amber-500'
                : 'text-muted-foreground'
            }`}
          >
            {intent}
          </span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground line-clamp-2">
        {snippet.split(highlight).map((part, i, arr) => (
          <React.Fragment key={i}>
            {part}
            {i < arr.length - 1 && (
              <mark className="rounded bg-indigo-100 dark:bg-indigo-950/60 text-foreground px-0.5">
                {highlight}
              </mark>
            )}
          </React.Fragment>
        ))}
      </p>
    </div>
  );
}