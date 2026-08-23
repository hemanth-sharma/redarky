import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ────────────────────────────────────────────────────────────────────────────
// Formatters
// ────────────────────────────────────────────────────────────────────────────

const RELATIVE_TIME = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

export function formatRelativeTime(dateOrIso) {
  if (!dateOrIso) return '';
  const date = typeof dateOrIso === 'number'
    ? new Date(dateOrIso * 1000) // unix seconds
    : new Date(dateOrIso);
  if (Number.isNaN(date.getTime())) return '';
  const diff = (date.getTime() - Date.now()) / 1000;
  const units = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
    ['second', 1],
  ];
  for (const [unit, secs] of units) {
    if (Math.abs(diff) >= secs || unit === 'second') {
      return RELATIVE_TIME.format(-Math.round(diff / secs), unit);
    }
  }
  return '';
}

export function formatDate(dateOrIso, opts = { dateStyle: 'medium', timeStyle: 'short' }) {
  if (!dateOrIso) return '';
  const date = typeof dateOrIso === 'number'
    ? new Date(dateOrIso * 1000)
    : new Date(dateOrIso);
  if (Number.isNaN(date.getTime())) return '';
  return new Intl.DateTimeFormat('en', opts).format(date);
}

export function formatNumber(n, opts = {}) {
  if (n === null || n === undefined || n === '') return '—';
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return new Intl.NumberFormat('en', opts).format(num);
}

export function formatPercent(n, digits = 1) {
  if (n === null || n === undefined) return '—';
  const num = Number(n);
  if (!Number.isFinite(num)) return String(n);
  return `${(num * 100).toFixed(digits)}%`;
}

/**
 * Convert a 0..1 intent score to a 0..100 integer for display.
 * Handles already-integer or already-percent values gracefully.
 */
export function intentToPercent(score) {
  if (score === null || score === undefined) return 0;
  const num = Number(score);
  if (!Number.isFinite(num)) return 0;
  if (num > 1) return Math.round(num); // already in 0..100
  return Math.round(num * 100);
}

export function intentTier(score) {
  const p = intentToPercent(score);
  if (p >= 80) return 'high';
  if (p >= 50) return 'medium';
  return 'low';
}

export function truncate(str, n) {
  if (!str) return '';
  return str.length > n ? `${str.slice(0, n)}…` : str;
}

/**
 * Escape text for safe use inside dangerouslySetInnerHTML — though we don't
 * use dangerouslySetInnerHTML anywhere in this app. Provided as a safety net
 * only.
 */
export function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function isValidEmail(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

export function isValidUrl(s) {
  try {
    new URL(s);
    return true;
  } catch {
    return false;
  }
}

export function uuidOrFallback(s) {
  if (typeof s === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s)) {
    return s;
  }
  return null;
}
