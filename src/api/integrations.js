import { api } from './client';

/**
 * Integrations API — slack | email | discord | teams | whatsapp | llm
 *
 * config shapes:
 *   slack/discord/teams/whatsapp → { webhook_url }
 *   email                        → { to_email }
 *   llm (bring your own)         → { api_key, base_url?, model? }
 */
export const integrationsApi = {
  list: () => api.get('/integrations'),
  create: (data) => api.post('/integrations', data),
  update: (id, data) => api.patch(`/integrations/${id}`, data),
  remove: (id) => api.del(`/integrations/${id}`),
  test: (id) => api.post(`/integrations/${id}/test`),
};
