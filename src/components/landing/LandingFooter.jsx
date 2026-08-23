import React from 'react';
import { Logo } from '@/components/Logo';
import ThemeToggle from '@/components/ThemeToggle';

export default function LandingFooter() {
  return (
    <footer className="border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="sm" />
          <span className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Redarky. Built for founders.
          </span>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Docs</a>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
