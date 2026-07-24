export const WORKER_API_BASE_URL = (
  import.meta.env.VITE_PUBLIC_API_BASE_URL ||
  'https://bryans-detailing-api.bryansmobiledetailing.workers.dev'
).replace(/\/$/, '');

export const workerApiUrl = (path: string) => `${WORKER_API_BASE_URL}${path}`;

export const ADMIN_SESSION_KEY = 'bryans_admin_session';
