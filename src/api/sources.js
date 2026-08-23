import { api } from './client';

export const sourcesApi = {
  list: (projectId) => api.get(`/projects/${projectId}/sources`),
  add: (projectId, data) => api.post(`/projects/${projectId}/sources`, data),
  remove: (projectId, sourceId) => api.del(`/projects/${projectId}/sources/${sourceId}`),
};
