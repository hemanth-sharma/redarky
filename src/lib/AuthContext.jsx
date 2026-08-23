import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '@/api/auth';
import { tokenStore, refreshTokenStore, demoModeStore, setAuthFailedHandler } from '@/api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  const clearSession = useCallback(() => {
    authApi.logout();
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  // Wire the client's auth-failed handler to our clearSession.
  useEffect(() => {
    setAuthFailedHandler(clearSession);
    return () => setAuthFailedHandler(null);
  }, [clearSession]);

  // Boot: try silent refresh, then /me
  const bootstrapAuth = useCallback(async () => {
    const refreshToken = refreshTokenStore.get();
    if (!refreshToken) {
      setIsLoadingAuth(false);
      setIsAuthenticated(false);
      return;
    }
    try {
      await authApi.refresh();
      const me = await authApi.me();
      setUser(me);
      setIsAuthenticated(true);
    } catch {
      clearSession();
    } finally {
      setIsLoadingAuth(false);
    }
  }, [clearSession]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  // ── Public actions ──────────────────────────────────────────────────────

  const loginWithEmail = useCallback(async (email, password) => {
    const data = await authApi.login({ email, password });
    const me = await authApi.me();
    setUser(me);
    setIsAuthenticated(true);
    return { user: me, ...data };
  }, []);

  const registerWithEmail = useCallback(async ({ email, password, full_name }) => {
    const data = await authApi.register({ email, password, full_name });
    const me = await authApi.me();
    setUser(me);
    setIsAuthenticated(true);
    return { user: me, ...data };
  }, []);

  const loginAsDemoUser = useCallback(async () => {
    const data = await authApi.loginAsDemoUser();
    const me = await authApi.me();
    setUser(me);
    setIsAuthenticated(true);
    return { user: me, ...data };
  }, []);

  const loginWithGoogle = useCallback((nextPath = '/') => {
    // Redirect to backend's Google OAuth start URL.
    window.location.href = authApi.getGoogleLoginUrl(nextPath);
  }, []);

  /**
   * Handle the OAuth callback. The backend redirects to /auth/google/callback
   * (or similar) with tokens in the URL fragment. Call this on app boot if
   * the URL contains access_token in the hash.
   */
  const handleOAuthCallback = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace(/^#/, '');
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const at = params.get('access_token');
    const rt = params.get('refresh_token');
    if (!at || !rt) return;
    tokenStore.setAccess(at);
    refreshTokenStore.set(rt);
    // Clear the hash so it doesn't get logged or bookmarked.
    try {
      window.history.replaceState(null, '', window.location.pathname + window.location.search);
    } catch {
      // ignore
    }
    try {
      const me = await authApi.me();
      setUser(me);
      setIsAuthenticated(true);
    } catch {
      clearSession();
    }
  }, [clearSession]);

  // Run OAuth callback handler once on mount.
  useEffect(() => {
    handleOAuthCallback();
  }, [handleOAuthCallback]);

  const logout = useCallback(() => {
    clearSession();
  }, [clearSession]);

  const value = {
    user,
    isAuthenticated,
    isLoadingAuth,
    isDemoUser: demoModeStore.isDemoUser(),
    loginWithEmail,
    registerWithEmail,
    loginAsDemoUser,
    loginWithGoogle,
    logout,
    bootstrapAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
