import type { Context } from 'hono';
import { randomUUID } from 'crypto';
import { supabase } from '@/db/index';
import { ApiResponse } from '@/utils/ApiResponse';
import type { TransactionDTO } from '@/models/transaction.model';

interface JwtPayload { sub: string; }

export const getAllTransactions = async (c: Context) => {
  const payload = c.get('jwtPayload') as JwtPayload;
  console.log('Fetching transactions for user:', payload.sub);
  
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', payload.sub)
    .order('date', { ascending: false });

  if (error) {
    console.error("DB Error:", error);
    return c.json(new ApiResponse(false, undefined, 'Failed to fetch database records'), 500);
  }

  return c.json(new ApiResponse<TransactionDTO[]>(true, data as TransactionDTO[]), 200);
};

export const createTransaction = async (c: Context) => {
  const payload = c.get('jwtPayload') as JwtPayload;
  const body = await c.req.json();
  
  const newRecord: TransactionDTO = { id: randomUUID(), user_id: payload.sub, ...body };

  const { data, error } = await supabase.from('transactions').insert([newRecord]).select().single();

  if (error) return c.json(new ApiResponse(false, undefined, 'Failed to persist record'), 500);

  return c.json(new ApiResponse<TransactionDTO>(true, data as TransactionDTO), 201);
};

export const deleteTransaction = async (c: Context) => {
  const payload = c.get('jwtPayload') as JwtPayload;
  const id = c.req.param('id');
  
  const { data, error } = await supabase
    .from('transactions')
    .delete()
    .eq('id', id)
    .eq('user_id', payload.sub)
    .select();

  if (error || !data || data.length === 0) {
    return c.json(new ApiResponse(false, undefined, 'Record not found or unauthorized'), 404);
  }

  return c.json({ success: true, deletedId: id });
};