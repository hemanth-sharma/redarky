import React, { useState } from 'react';
import { Logo } from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { Loader2, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function LandingNav() {
  const { loginAsDemoUser } = useAuth();
  const [demoLoading, setDemoLoading] = useState(false);
  const navigate = useNavigate();

  // One-click demo login handler for all CTAs
  // onPROD: Remove this handler if reverting to normal /login and /register flows
  const handleDemoClick = async (e) => {
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

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-border/40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />
          <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#how-it-works" className="hover:text-foreground transition-colors">How it works</a>
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#stats" className="hover:text-foreground transition-colors">Stats</a>
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            
            {/* Ghost Login Button */}
            <Button
              variant="ghost"
              size="sm"
              // onPROD: Change back to onClick={() => navigate('/login')} and remove disabled={demoLoading}
              onClick={handleDemoClick}
              disabled={demoLoading}
            >
              {/* onPROD: Simplify back to just 'Log in' text */}
              {demoLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Log in'
              )}
            </Button>

            {/* Glowing Green Demo / Get Started Button */}
            <Button
              size="sm"
              // onPROD: Change back to onClick={() => navigate('/register')} and remove disabled={demoLoading} + styling overrides if needed
              onClick={handleDemoClick}
              disabled={demoLoading}
              className="relative overflow-hidden bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-md shadow-emerald-600/20"
            >
              {/* onPROD: Remove shimmer effect wrapper */}
              <span className="absolute inset-0 z-0 h-full w-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
              
              <span className="relative z-10 flex items-center gap-1.5">
                {demoLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Sparkles className="h-3.5 w-3.5 text-emerald-200" />
                )}
                {/* onPROD: Change text back to 'Get started' */}
                {demoLoading ? 'Opening…' : 'Try Demo Live'}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}