import type { APIRoute } from 'astro';
import app from '@/index'; 

export const ALL: APIRoute = ({ request }) => {
  return app.fetch(request);
};