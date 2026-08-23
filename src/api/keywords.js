import { api } from './client';

export const keywordsApi = {
  list: (projectId) => api.get('/keywords', projectId ? { query: { project_id: projectId } } : {}),
  get: (id) => api.get(`/keywords/${id}`),
  create: (data) => api.post('/keywords', data),
  update: (id, data) => api.put(`/keywords/${id}`, data),
  remove: (id) => api.del(`/keywords/${id}`),
};
