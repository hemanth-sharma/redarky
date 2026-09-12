import { api } from './client';

export const scraperApi = {
  /** Trigger a manual pipeline batch. Returns 202 Accepted. */
  run: (data = {}) => api.post('/scraper/run', data),
  /**
   * Recent pipeline runs (with per-run matched-post + lead counts).
   * Default 5 — consistent everywhere so react-query cache keys line up.
   * The backend clamps the limit to 1..50 regardless.
   */
  listRuns: (limit = 5) => api.get('/scraper/runs', { query: { limit } }),
  getRun: (runId) => api.get(`/scraper/runs/${runId}`),
};
