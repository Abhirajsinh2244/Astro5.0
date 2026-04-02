import { z } from 'zod';

export const transactionSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  merchant: z.string().min(1, "Merchant is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  amount: z.number().positive("Amount must be greater than zero"),
  account: z.string().min(1, "Account is required"),
  status: z.enum(['Cleared', 'Pending']),
  type: z.enum(['expense', 'income'])
});

export type TransactionDTO = z.infer<typeof transactionSchema> & { id: string, user_id: string };