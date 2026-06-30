const QUEUE_KEY = 'redarky_pending_sync';

export const syncQueue = {
  /**
   * Enqueues an API operation if the backend is sleeping or unreachable.
   */
  enqueue: (type, data) => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    queue.push({ type, data, timestamp: Date.now() });
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue));
    console.log(`[SyncQueue] Cached pending action [${type}] to local storage.`);
  },

  /**
   * Process and replay cached offline actions when the server wakes up.
   */
  processQueue: async (clientInstance) => {
    const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
    if (queue.length === 0) return;

    console.log(`[SyncQueue] Replaying ${queue.length} cached background actions...`);
    const remainingActions = [];

    for (const action of queue) {
      try {
        if (action.type === 'KEYWORD_CREATE') {
          await clientInstance.keywords.createKeyword(action.data.name);
        } else if (action.type === 'PROJECT_CREATE') {
          await clientInstance.projects.createProject(action.data);
        } else if (action.type === 'LEAD_STATUS_UPDATE') {
          await clientInstance.leads.updateStatus(action.data.id, action.data.status);
        } else if (action.type === 'SOURCE_ADD') {
          await clientInstance.sources.addSubreddit(action.data.projectId, action.data.subreddit);
        }
      } catch (err) {
        console.error(`[SyncQueue] Failed to sync action, retaining in cache:`, action.type);
        remainingActions.push(action);
      }
    }

    localStorage.setItem(QUEUE_KEY, JSON.stringify(remainingActions));
  }
};