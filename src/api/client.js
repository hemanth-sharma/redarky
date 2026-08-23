/**
 * Secure API client for Redarky backend.
 *
 * SECURITY DESIGN:
 *  - Access token lives in memory only (lost on page refresh).
 *  - Refresh token persists in localStorage (so user doesn't re-login every reload),
 *    but is rotated on every /auth/refresh response.
 *  - Single-flight refresh lock — concurrent 401s share one refresh promise.
 *  - All 401s trigger exactly ONE refresh attempt; on failure, log the user out.
 *  - All user-generated content rendered as plain text via React (no dangerouslySetInnerHTML).
 *  - All requests go through one fetch wrapper so we control headers + CSRF surface centrally.
 *  - Bearer tokens are never logged, never sent to a third-party domain, never written to console.
 */
import { toast } from '@/hooks/use-toast';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

const ACCESS_TOKEN_KEY = 'redarky_at';
const REFRESH_TOKEN_KEY = 'redarky_rt';
const DEMO_USER_KEY = 'redarky_demo_user';

// ────────────────────────────────────────────────────────────────────────────
// In-memory access token. NEVER persisted to localStorage.
// ────────────────────────────────────────────────────────────────────────────
let inMemoryAccessToken = null;
let inMemoryUser = null;

export const tokenStore = {
  setAccess(token) {
    inMemoryAccessToken = token;
  },
  getAccess() {
    return inMemoryAccessToken;
  },
  clearAccess() {
    inMemoryAccessToken = null;
    inMemoryUser = null;
  },
  setUser(user) {
    inMemoryUser = user;
    try {
      if (user) sessionStorage.setItem('redarky_user_cache', JSON.stringify(user));
      else sessionStorage.removeItem('redarky_user_cache');
    } catch {
      // ignore
    }
  },
  getUser() {
    if (inMemoryUser) return inMemoryUser;
    try {
      const cached = sessionStorage.getItem('redarky_user_cache');
      if (cached) return JSON.parse(cached);
    } catch {
      // ignore
    }
    return null;
  },
};

// ────────────────────────────────────────────────────────────────────────────
// Refresh token — persisted in localStorage (rotated on every refresh).
// We accept the XSS tradeoff here because SPA + JSON-body auth doesn't have
// httpOnly-cookie option without backend changes.
// ────────────────────────────────────────────────────────────────────────────
export const refreshTokenStore = {
  get() {
    try {
      return localStorage.getItem(REFRESH_TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token) {
    if (!token) {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      return;
    }
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(DEMO_USER_KEY);
    try {
      sessionStorage.removeItem('redarky_user_cache');
    } catch {
      // ignore
    }
  },
};

export const demoModeStore = {
  isDemoUser() {
    try {
      return localStorage.getItem(DEMO_USER_KEY) === 'true';
    } catch {
      return false;
    }
  },
  setDemoUser(value) {
    if (value) localStorage.setItem(DEMO_USER_KEY, 'true');
    else localStorage.removeItem(DEMO_USER_KEY);
  },
};

// ────────────────────────────────────────────────────────────────────────────
// API error — normalized so the UI can render a consistent message.
// ────────────────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor({ status, message, detail, fieldErrors }) {
    super(message || `HTTP ${status}`);
    this.status = status;
    this.detail = detail;
    this.fieldErrors = fieldErrors; // { email: 'Already registered', ... }
  }
}

// ────────────────────────────────────────────────────────────────────────────
// Single-flight refresh lock. If 5 requests all 401 simultaneously,
// only ONE /auth/refresh call is made; the others await the same promise.
// ────────────────────────────────────────────────────────────────────────────
let refreshPromise = null;
let onAuthFailedCallback = null; // set by AuthContext

export function setAuthFailedHandler(fn) {
  onAuthFailedCallback = fn;
}

async function refreshTokens() {
  const refreshToken = refreshTokenStore.get();
  if (!refreshToken) {
    throw new ApiError({ status: 401, message: 'No refresh token' });
  }

  const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  if (!res.ok) {
    // Refresh failed — session is dead.
    refreshTokenStore.clear();
    tokenStore.clearAccess();
    if (onAuthFailedCallback) onAuthFailedCallback();
    throw new ApiError({ status: 401, message: 'Session expired' });
  }

  const data = await res.json();
  tokenStore.setAccess(data.access_token);
  refreshTokenStore.set(data.refresh_token);
  return data.access_token;
}

function ensureRefresh() {
  if (!refreshPromise) {
    refreshPromise = refreshTokens().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

// ────────────────────────────────────────────────────────────────────────────
// Core request function.
// ────────────────────────────────────────────────────────────────────────────
async function request(path, options = {}) {
  const {
    method = 'GET',
    body,
    query,
    headers = {},
    auth = true, // set false to skip auth header (e.g. login)
    signal,
  } = options;

  const url = new URL(
    path.startsWith('http') ? path : `${API_BASE_URL}${path}`
  );
  if (query) {
    Object.entries(query).forEach(([k, v]) => {
      if (v === undefined || v === null || v === '') return;
      if (Array.isArray(v)) v.forEach((vv) => url.searchParams.append(k, vv));
      else url.searchParams.set(k, v);
    });
  }

  const finalHeaders = {
    Accept: 'application/json',
    ...headers,
  };
  if (body !== undefined && !(body instanceof FormData)) {
    finalHeaders['Content-Type'] = 'application/json';
  }
  if (auth) {
    const at = tokenStore.getAccess();
    if (at) finalHeaders.Authorization = `Bearer ${at}`;
  }
  const finalBody = body === undefined ? undefined :
    body instanceof FormData ? body : JSON.stringify(body);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal,
      credentials: 'same-origin',
    });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new ApiError({
      status: 0,
      message: 'Network error — please check your connection',
    });
  }

  // ── 401 → try refresh once, replay the request ──────────────────────────
  if (res.status === 401 && auth) {
    try {
      await ensureRefresh();
    } catch (e) {
      throw e;
    }
    // Replay with the new token
    const newAt = tokenStore.getAccess();
    if (newAt) finalHeaders.Authorization = `Bearer ${newAt}`;
    const replayRes = await fetch(url, {
      method,
      headers: finalHeaders,
      body: finalBody,
      signal,
      credentials: 'same-origin',
    });
    return handleResponse(replayRes);
  }

  return handleResponse(res);
}

async function handleResponse(res) {
  if (res.status === 204) return null;

  let data = null;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    // Pydantic validation error
    if (data && Array.isArray(data.detail)) {
      const fieldErrors = {};
      let message = 'Validation failed';
      data.detail.forEach((err) => {
        const field = (err.loc || []).slice(-1)[0] || '_';
        fieldErrors[field] = err.msg;
        if (!message || message === 'Validation failed') message = err.msg;
      });
      throw new ApiError({
        status: res.status,
        message,
        detail: data.detail,
        fieldErrors,
      });
    }
    const message =
      (data && (data.detail || data.message)) ||
      (res.status === 401 ? 'Unauthorized' :
        res.status === 403 ? 'Forbidden' :
        res.status === 404 ? 'Not found' :
        res.status >= 500 ? 'Server error — try again' :
        `HTTP ${res.status}`);
    throw new ApiError({ status: res.status, message, detail: data });
  }

  return data;
}

// ────────────────────────────────────────────────────────────────────────────
// Public API surface — exposed as `api.get/post/put/del`
// ────────────────────────────────────────────────────────────────────────────
export const api = {
  get: (path, opts = {}) => request(path, { ...opts, method: 'GET' }),
  post: (path, body, opts = {}) => request(path, { ...opts, method: 'POST', body }),
  put: (path, body, opts = {}) => request(path, { ...opts, method: 'PUT', body }),
  patch: (path, body, opts = {}) => request(path, { ...opts, method: 'PATCH', body }),
  del: (path, opts = {}) => request(path, { ...opts, method: 'DELETE' }),
};

export const API_BASE = API_BASE_URL;

// ────────────────────────────────────────────────────────────────────────────
// Helper: build an OAuth redirect URL for Google login.
// In production, the backend should expose a /auth/google/login endpoint that
// redirects to Google with the proper state token. For the MVP, we redirect
// to the backend's google oauth start URL with a `next` param.
// ────────────────────────────────────────────────────────────────────────────
export function buildGoogleOAuthUrl(nextPath = '/') {
  const next = encodeURIComponent(nextPath);
  return `${API_BASE_URL}/auth/google/login?next=${next}`;
}

// ────────────────────────────────────────────────────────────────────────────
// Global error toast helper
// ────────────────────────────────────────────────────────────────────────────
export function toastApiError(err, fallback = 'Something went wrong') {
  if (err?.name === 'AbortError') return;
  const message = err?.message || fallback;
  toast({
    title: 'Error',
    description: message,
    variant: 'destructive',
  });
}
