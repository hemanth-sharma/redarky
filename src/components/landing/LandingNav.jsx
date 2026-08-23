import React from 'react';
import { Logo } from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingNav() {
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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.href = '/login')}
            >
              Log in
            </Button>
            <Button
              size="sm"
              variant="gradient"
              onClick={() => (window.location.href = '/register')}
            >
              Get started
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
