import { hc } from 'hono/client';
// CHANGE THIS IMPORT: Remove the /server/ folder
import type { AppType } from '@/index';

const getBaseUrl = () => {
  if (typeof window !== 'undefined') return window.location.origin;
  if (import.meta.env.VERCEL_URL) return `https://${import.meta.env.VERCEL_URL}`;
  return 'http://localhost:4321'; 
};

export const apiClient = hc<AppType>(getBaseUrl(), {
  headers: () => {
    const headers: Record<string, string> = {};
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('ledger_token');
      if (token) headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  }
});