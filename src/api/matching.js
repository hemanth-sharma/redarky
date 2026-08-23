import { api } from './client';

export const matchingApi = {
  rerunStage2: () => api.post('/matching/rerun-stage2'),
  rerunStage3: () => api.post('/matching/rerun-stage3'),
};
