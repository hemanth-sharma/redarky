import { api } from './client';

export const leadsApi = {
  /**
   * list(params) — paginated/filterable lead list.
   * Supported params: project_id, status, page, page_size
   */
  list: (params = {}) => api.get('/leads', { query: params }),
  get: (id) => api.get(`/leads/${id}`),
  remove: (id) => api.del(`/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  updateNotes: (id, notes) => api.patch(`/leads/${id}/notes`, { notes }),
  stats: (projectId) => api.get(`/projects/${projectId}/leads/stats`),
};
