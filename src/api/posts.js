import { api } from './client';

export const postsApi = {
  /**
   * list(params) — paginated matched-posts feed.
   * Supported params (per backend spec):
   *   page, page_size, project_id, source, search, subreddit,
   *   min_intent_score, is_brand_mention, is_lead, lead_status,
   *   sort_by (intent_score | created_at | score), sort_desc (bool)
   */
  list: (params = {}) => api.get('/posts', { query: params }),
  get: (id) => api.get(`/posts/${id}`),
  highlights: (id) => api.get(`/posts/${id}/highlights`),
};
