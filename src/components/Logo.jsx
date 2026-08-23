import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 'default', withText = true }) {
  const iconSize = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-12 w-12' : 'h-9 w-9';
  const textSize = size === 'sm' ? 'text-base' : size === 'lg' ? 'text-2xl' : 'text-lg';
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div
        className={cn(
          'inline-flex items-center justify-center rounded-xl gradient-accent text-white shadow-md',
          iconSize
        )}
      >
        <Zap className="h-1/2 w-1/2" fill="currentColor" />
      </div>
      {withText && (
        <span className={cn('font-bold tracking-tight gradient-text', textSize)}>
          Redarky
        </span>
      )}
    </div>
  );
}

export function LogoLink({ to = '/', ...props }) {
  return (
    <Link to={to} aria-label="Redarky home">
      <Logo {...props} />
    </Link>
  );
}
