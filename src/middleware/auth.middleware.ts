import { jwt } from 'hono/jwt';

export const verifyJWT = () => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  return jwt({
    secret,
    alg: 'HS256'
  });
};