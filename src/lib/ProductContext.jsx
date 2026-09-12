import React, { createContext, useContext, useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api';
import { useAuth } from '@/lib/AuthContext';

/**
 * ProductContext — the single source of truth for "which product am I
 * looking at" across Dashboard / Action Queue / Product Profile / Pipeline
 * Activity / Integrations.
 *
 * - The active product id is persisted in localStorage so a refresh keeps
 *   your selection.
 * - Falls back to the first project when nothing is selected (or the
 *   selected project was deleted).
 * - All product-scoped queries derive from `activeProduct.id`, so switching
 *   products everywhere is just a context change.
 */

const STORAGE_KEY = 'redarky_active_product';

const ProductContext = createContext(null);

export function ProductProvider({ children }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: projects, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectsApi.list(),
    enabled: !!user,
  });

  const savedId = (() => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch {
      return null;
    }
  })();

  // The selected product if it still exists, else the first one
  const activeProduct = useMemo(() => {
    if (!projects?.length) return null;
    return projects.find((p) => p.id === savedId) || projects[0];
  }, [projects, savedId]);

  // Keep localStorage in sync (and clear stale ids)
  useEffect(() => {
    try {
      if (activeProduct) {
        if (localStorage.getItem(STORAGE_KEY) !== activeProduct.id) {
          localStorage.setItem(STORAGE_KEY, activeProduct.id);
        }
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [activeProduct]);

  const setActiveProduct = (productOrId) => {
    const id = typeof productOrId === 'string' ? productOrId : productOrId?.id;
    if (!id) return;
    try {
      localStorage.setItem(STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
    // Invalidate product-scoped queries so every page refetches for the
    // newly-selected product
    queryClient.invalidateQueries({ queryKey: ['keywords'] });
    queryClient.invalidateQueries({ queryKey: ['sources'] });
    queryClient.invalidateQueries({ queryKey: ['project-stats'] });
    queryClient.invalidateQueries({ queryKey: ['lead-stats'] });
    queryClient.invalidateQueries({ queryKey: ['leads'] });
    queryClient.invalidateQueries({ queryKey: ['posts'] });
  };

  const value = useMemo(
    () => ({
      products: projects || [],
      activeProduct,
      activeProductId: activeProduct?.id || null,
      setActiveProduct,
      loadingProjects,
    }),
    [projects, activeProduct, loadingProjects]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) {
    throw new Error('useProduct must be used inside <ProductProvider>');
  }
  return ctx;
}
