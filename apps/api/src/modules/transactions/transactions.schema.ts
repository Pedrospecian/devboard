import { z } from "zod";

export const createTransactionSchema = z.object({
  title: z.string().min(1, "Título obrigatório"),
  amount: z.number().positive("Valor deve ser positivo"),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string().min(1, "Categoria obrigatória"),
  date: z.string().datetime(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;