import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { verifyJWT } from '@/middleware/auth.middleware';
import { transactionSchema } from '@/models/transaction.model';
import { getAllTransactions, createTransaction, deleteTransaction } from '@/controllers/transaction.controller';

// FIX: Chain the middleware and route methods to preserve type inference
const router = new Hono()
  .use('/*', verifyJWT())
  .get('/', getAllTransactions)
  .post('/', zValidator('json', transactionSchema), createTransaction)
  .delete('/:id', deleteTransaction);

export default router;