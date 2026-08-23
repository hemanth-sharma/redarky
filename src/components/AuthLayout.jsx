import React from 'react';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AuthLayout({ icon: Icon = Zap, title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl gradient-accent text-white mb-4 shadow-lg">
            <Icon className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-md">
          {children}
        </div>

        {footer && (
          <div className="text-center text-xs text-muted-foreground font-medium mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
