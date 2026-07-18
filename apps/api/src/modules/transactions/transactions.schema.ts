import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Required title"),
  amount: z.number().positive("Value must be positive"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Required category"),
  date: z.string().datetime(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;