import { api } from './client';

/**
 * Feedback API — strict verified-email flow.
 *   1. requestVerification(email)  → backend emails a 6-digit code
 *      (in non-production with no SMTP the code also comes back as `dev_code`)
 *   2. verify(email, code)         → marks the email verified
 *   3. submit(email, message)      → only accepted for verified emails
 */
export const feedbackApi = {
  requestVerification: (email) => api.post('/feedback/request-verification', { email }),
  verify: (email, code) => api.post('/feedback/verify', { email, code }),
  status: (email) => api.get('/feedback/status', { query: { email } }),
  submit: (data) => api.post('/feedback', data),
};
