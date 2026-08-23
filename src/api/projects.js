import { api } from './client';

export const projectsApi = {
  list: () => api.get('/projects'),
  get: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  remove: (id) => api.del(`/projects/${id}`),
  activate: (id) => api.post(`/projects/${id}/activate`),
  deactivate: (id) => api.post(`/projects/${id}/deactivate`),
  stats: (id) => api.get(`/projects/${id}/stats`),
  leadStats: (projectId) => api.get(`/projects/${projectId}/leads/stats`),
};
