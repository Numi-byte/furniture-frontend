// src/api.ts
export const API_BASE =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? 'http://localhost:3000' : '');

if (!API_BASE) {
  console.warn(
    'No API base URL configured—set VITE_API_URL in production or run with VITE_API_URL in .env.local for dev.'
  );
}
