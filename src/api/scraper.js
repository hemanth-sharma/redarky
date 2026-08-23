import { api } from './client';

export const scraperApi = {
  /** Trigger a manual scraper batch. Returns 202 Accepted. */
  run: (data = {}) => api.post('/scraper/run', data),
  listRuns: (limit = 50) => api.get('/scraper/runs', { query: { limit } }),
  getRun: (runId) => api.get(`/scraper/runs/${runId}`),
};
