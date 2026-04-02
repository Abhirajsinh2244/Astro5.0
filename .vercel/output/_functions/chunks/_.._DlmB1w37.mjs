import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { zValidator } from '@hono/zod-validator';
import { jwt, sign } from 'hono/jwt';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

const verifyJWT = () => {
  const secret = process.env.JWT_SECRET || "fallback_secret";
  return jwt({
    secret,
    alg: "HS256"
  });
};

const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  merchant: z.string().min(1, "Merchant is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  account: z.string().min(1, "Account is required"),
  status: z.enum(["Cleared", "Pending"]),
  type: z.enum(["expense", "income"])
});

dotenv.config();
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
if (!supabaseUrl || !supabaseKey) {
  throw new Error("CRITICAL: Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment variables.");
}
const supabase = createClient(supabaseUrl, supabaseKey);

class ApiResponse {
  success;
  data;
  error;
  timestamp;
  constructor(success, data, error) {
    this.success = success;
    if (data) this.data = data;
    if (error) this.error = error;
    this.timestamp = (/* @__PURE__ */ new Date()).toISOString();
  }
}

const getAllTransactions = async (c) => {
  const payload = c.get("jwtPayload");
  const { data, error } = await supabase.from("transactions").select("*").eq("user_id", payload.sub).order("date", { ascending: false });
  if (error) {
    console.error("DB Error:", error);
    return c.json(new ApiResponse(false, void 0, "Failed to fetch database records"), 500);
  }
  return c.json(new ApiResponse(true, data), 200);
};
const createTransaction = async (c) => {
  const payload = c.get("jwtPayload");
  const body = await c.req.json();
  const newRecord = { id: randomUUID(), user_id: payload.sub, ...body };
  const { data, error } = await supabase.from("transactions").insert([newRecord]).select().single();
  if (error) return c.json(new ApiResponse(false, void 0, "Failed to persist record"), 500);
  return c.json(new ApiResponse(true, data), 201);
};
const deleteTransaction = async (c) => {
  const payload = c.get("jwtPayload");
  const id = c.req.param("id");
  const { data, error } = await supabase.from("transactions").delete().eq("id", id).eq("user_id", payload.sub).select();
  if (error || !data || data.length === 0) {
    return c.json(new ApiResponse(false, void 0, "Record not found or unauthorized"), 404);
  }
  return c.json({ success: true, deletedId: id });
};

const router$1 = new Hono().use("/*", verifyJWT()).get("/", getAllTransactions).post("/", zValidator("json", transactionSchema), createTransaction).delete("/:id", deleteTransaction);

const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long")
});

z.object({
  email: z.string().email(),
  password: z.string().min(6)
});
const getJwtSecret = () => process.env.JWT_SECRET || "fallback_secret";
const registerUser = async (c) => {
  const { email, password } = await c.req.json();
  const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single();
  if (existingUser) {
    return c.json(new ApiResponse(false, void 0, "Email is already registered"), 409);
  }
  const salt = bcrypt.genSaltSync(10);
  const password_hash = bcrypt.hashSync(password, salt);
  const userId = randomUUID();
  const { error: insertError } = await supabase.from("users").insert([{ id: userId, email, password_hash }]);
  if (insertError) {
    console.error("Supabase Register Error:", insertError);
    return c.json(new ApiResponse(false, void 0, "Failed to create user account"), 500);
  }
  const payload = { sub: userId, email, exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7 };
  const token = await sign(payload, getJwtSecret());
  return c.json({ success: true, token, user: { id: userId, email } }, 201);
};
const loginUser = async (c) => {
  const { email, password } = await c.req.json();
  const { data: user, error } = await supabase.from("users").select("*").eq("email", email).single();
  if (error || !user) {
    return c.json(new ApiResponse(false, void 0, "Invalid credentials"), 401);
  }
  const isValid = bcrypt.compareSync(password, user.password_hash);
  if (!isValid) {
    return c.json(new ApiResponse(false, void 0, "Invalid credentials"), 401);
  }
  const payload = { sub: user.id, email: user.email, exp: Math.floor(Date.now() / 1e3) + 60 * 60 * 24 * 7 };
  const token = await sign(payload, getJwtSecret());
  return c.json({ success: true, token, user: { id: user.id, email: user.email } }, 200);
};

const validateAuth = zValidator("json", authSchema, (result, c) => {
  if (!result.success) {
    return c.json(new ApiResponse(false, void 0, "Validation failed"), 400);
  }
});
const router = new Hono().post("/register", validateAuth, registerUser).post("/login", validateAuth, loginUser);

const app = new Hono();
app.use("*", logger());
app.use("*", secureHeaders());
app.route("/api/auth", router).route("/api/transactions", router$1);
app.onError((err, c) => {
  console.error(`[Server Error] ${err.message}`);
  return c.json({ success: false, error: "Internal Server Error" }, 500);
});

const ALL = ({ request }) => {
  return app.fetch(request);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  ALL
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
