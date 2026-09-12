import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Check,
  ChevronsUpDown,
  Layers,
  Plus,
  Power,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { projectsApi } from '@/api';
import { useProduct } from '@/lib/ProductContext';
import { useAuth } from '@/lib/AuthContext';
import { toast } from '@/hooks/use-toast';
import { toastApiError } from '@/api';
import { cn } from '@/lib/utils';

/**
 * ProductSwitcher — the modern way to move between products.
 *
 * A compact pill in the TopBar showing the active product with its live
 * pipeline status dot; clicking opens a dropdown with every product (name,
 * status, pause/activate toggle) and a "New product" action that routes to
 * onboarding. Not a separate list page — you always stay in context.
 */
export default function ProductSwitcher({ className }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { products, activeProduct, setActiveProduct } = useProduct();

  const pauseMutation = useMutation({
    mutationFn: (id) => projectsApi.deactivate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({ title: 'Pipeline paused' });
    },
    onError: (e) => toastApiError(e),
  });

  const activateMutation = useMutation({
    mutationFn: (id) => projectsApi.activate(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Pipeline activated',
        description: 'The next collection batch runs within 30 minutes.',
      });
    },
    onError: (e) => toastApiError(e),
  });

  if (!user) return null;

  const initials = (activeProduct?.name || 'P')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const isMulti = products.length > 1;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            'group flex h-9 items-center gap-2 rounded-full border border-border bg-card pl-1.5 pr-2.5 text-left shadow-sm outline-none transition hover:border-primary/50 hover:shadow',
            className
          )}
          aria-label="Switch product"
        >
          <span className="flex h-6 w-6 items-center justify-center rounded-full gradient-accent text-[10px] font-bold text-white">
            {initials}
          </span>
          <span className="flex min-w-0 flex-col leading-none">
            <span className="max-w-[130px] truncate text-xs font-semibold text-foreground">
              {activeProduct?.name || 'No product'}
            </span>
            <span className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full',
                  activeProduct?.is_pipeline_active
                    ? 'bg-emerald-500 animate-pulse'
                    : 'bg-zinc-400'
                )}
              />
              {activeProduct?.is_pipeline_active ? 'Pipeline live' : 'Paused'}
            </span>
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground group-hover:text-foreground" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Products
        </DropdownMenuLabel>

        {products.length === 0 && (
          <div className="px-2 py-3 text-xs text-muted-foreground">
            No products yet — create one to start the pipeline.
          </div>
        )}

        {products.map((p) => {
          const isActive = p.id === activeProduct?.id;
          return (
            <DropdownMenuItem
              key={p.id}
              className="group flex cursor-pointer items-start gap-2.5 px-2 py-2"
              onSelect={(e) => {
                e.preventDefault();
                if (!isActive) {
                  setActiveProduct(p);
                  queryClient.invalidateQueries({ queryKey: ['scraper-runs'] });
                }
              }}
            >
              <span className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary/70" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-medium">{p.name}</span>
                  {isActive && <Check className="h-3.5 w-3.5 shrink-0 text-primary" />}
                </span>
                <span className="mt-0.5 flex items-center gap-1.5 text-[10px] text-muted-foreground">
                  <span
                    className={cn(
                      'h-1.5 w-1.5 rounded-full',
                      p.is_pipeline_active ? 'bg-emerald-500 animate-pulse' : 'bg-zinc-400'
                    )}
                  />
                  {p.is_pipeline_active ? 'Pipeline active' : 'Pipeline paused'}
                  <span className="text-muted-foreground/60">·</span>
                  {(p.platforms || ['reddit']).join(', ')}
                </span>
              </span>
              {/* Pause/activate per product without leaving the switcher */}
              <button
                className="mt-0.5 rounded p-1 text-muted-foreground opacity-0 transition hover:bg-muted hover:text-foreground group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation();
                  if (p.is_pipeline_active) {
                    pauseMutation.mutate(p.id);
                  } else {
                    activateMutation.mutate(p.id);
                  }
                }}
                title={p.is_pipeline_active ? 'Pause pipeline' : 'Activate pipeline'}
              >
                <Power
                  className={cn(
                    'h-3.5 w-3.5',
                    p.is_pipeline_active ? 'text-emerald-500' : 'text-muted-foreground'
                  )}
                />
              </button>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="cursor-pointer gap-2 text-xs font-medium"
          onClick={() => navigate('/onboarding')}
        >
          <Plus className="h-3.5 w-3.5 text-primary" />
          New product
        </DropdownMenuItem>

        {isMulti && (
          <div className="px-2 pb-1.5 pt-1 text-[10px] text-muted-foreground">
            <Layers className="mr-1 inline h-3 w-3" />
            Switching updates data on this page instantly
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
