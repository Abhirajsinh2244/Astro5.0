import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import transactionRoutes from '@/routes/transaction.routes'; // <-- IMPORT ADDED
import authRoutes from '@/routes/auth.routes'; // <-- IMPORT ADDED

const app = new Hono();

// Global Middleware
app.use('*', logger());
app.use('*', secureHeaders());

// Mount the routers
const routes = app
  .route('/api/auth', authRoutes) // <-- ROUTE UNCOMMENTED
  .route('/api/transactions', transactionRoutes);

// Exporting the API signature for the frontend client (hono/client)
export type AppType = typeof routes;

// Global Error Handler
app.onError((err, c) => {
  console.error(`[Server Error] ${err.message}`);
  return c.json({ success: false, error: 'Internal Server Error' }, 500);
});

export default app;