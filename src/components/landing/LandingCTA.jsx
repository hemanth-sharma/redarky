import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';

export default function LandingCTA() {
  const { loginAsDemoUser } = useAuth();
  return (
    <section className="py-20 sm:py-28 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="relative rounded-3xl border border-border gradient-border bg-card/60 backdrop-blur-md p-10 sm:p-16">
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-balance">
            Stop guessing. Start <span className="gradient-text">listening.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground text-balance">
            Your next customer is on Reddit right now, asking your competitor
            what to do. Be the first reply.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              size="xl"
              variant="gradient"
              onClick={() => (window.location.href = '/login?next=/dashboard')}
              className="group"
            >
              Get Started
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
            <Button
              size="xl"
              variant="outline"
              onClick={() => loginAsDemoUser()}
            >
              <Sparkles className="h-4 w-4" />
              Try the demo
            </Button>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            No credit card. No setup call. Just leads.
          </p>
        </div>
      </div>
    </section>
  );
}
