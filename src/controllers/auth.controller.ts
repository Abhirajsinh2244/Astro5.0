import type { Context } from 'hono';
import { randomUUID } from 'crypto';
import { sign } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { supabase } from '../db/index';
import { ApiResponse } from '../utils/ApiResponse';
import type { AuthDTO } from '../models/auth.model';

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const getJwtSecret = () => process.env.JWT_SECRET || 'fallback_secret';

export const registerUser = async (c: Context) => {
  const { email, password } = await c.req.json();

  // 1. Check if user exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .single();

  if (existingUser) {
    return c.json(new ApiResponse(false, undefined, 'Email is already registered'), 409);
  }

  // 2. Hash password and create user
  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);
  const userId = randomUUID();

  const { error: insertError } = await supabase
    .from('users')
    .insert([{ id: userId, email, password_hash }]);

  if (insertError) {
    console.error("Supabase Register Error:", insertError);
    return c.json(new ApiResponse(false, undefined, 'Failed to create user account'), 500);
  }

  // 3. Generate JWT
  const payload = { sub: userId, email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
  const token = await sign(payload, getJwtSecret());

  // Note: Returning token at the root level to maintain compatibility with the frontend UI
  return c.json({ success: true, token, user: { id: userId, email } }, 201);
};

export const loginUser = async (c: Context) => {
  console.log('req',await c.req.json());
  const { email, password } = await c.req.json();

  // 1. Find the user
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .single();

  console.log('User',user)

  if (error || !user) {
    return c.json(new ApiResponse(false, undefined, 'Invalid credentials'), 401);
  }

  // 2. Verify password hash
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return c.json(new ApiResponse(false, undefined, 'Invalid credentials'), 401);
  }

  // 3. Generate JWT
  const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 };
  const token = await sign(payload, getJwtSecret());

  return c.json({ success: true, token, user: { id: user.id, email: user.email } }, 200);
};