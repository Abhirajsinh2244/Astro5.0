import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { authSchema } from '@/models/auth.model';
import { registerUser, loginUser } from '@/controllers/auth.controller';
import { ApiResponse } from '@/utils/ApiResponse';

// Reusable validation middleware for auth routes
const validateAuth = zValidator('json', authSchema, (result, c) => {
  if (!result.success) {
    return c.json(new ApiResponse(false, undefined, 'Validation failed'), 400);
  }
});

// FIX: Chain the route methods to preserve TypeScript type inference for Hono RPC
const router = new Hono()
  .post('/register', validateAuth, registerUser)
  .post('/login', validateAuth, loginUser);

export default router;